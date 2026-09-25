import SwiftUI

@MainActor final class TransitStore: ObservableObject {
    @Published var stations: [Station] = []
    @Published var routes: [String: Route] = [:]
    @Published var outages: [Outage] = []
    @Published var trips: [String: [Trip]] = [:]
    @Published var tripErrors: Set<String> = []
    @Published var updated: Date?
    @Published var refreshing = false
    @Published var error: String?
    @Published var favourites: [String] {
        didSet { defaults.set(favourites, forKey: "favourites") }
    }
    private let defaults: UserDefaults
    private let session: URLSession
    private var loadingTrips: Set<String> = []
    private let cacheURL: URL
    var favouriteStations: [Station] { favourites.compactMap { id in stations.first { $0.id == id } } }
    init(defaults: UserDefaults = .standard, session: URLSession = .shared) {
        self.defaults = defaults; self.session = session
        favourites = defaults.stringArray(forKey: "favourites") ?? ["M12", "M16"]
        cacheURL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0].appendingPathComponent("transit.json")
        if let data = try? Data(contentsOf: cacheURL), let saved = try? JSONDecoder().decode(FeedSnapshot.self, from: data) {
            stations = saved.stations; routes = saved.routes; outages = saved.outages; updated = saved.updated
        }
    }
    func toggleFavourite(_ station: Station) {
        if favourites.contains(station.id) { favourites.removeAll { $0 == station.id } }
        else { favourites.append(station.id) }
    }
    func outage(for equipment: Equipment) -> Outage? { outages.first { $0.equipment == equipment.id } }
    func inactiveCount(_ station: Station) -> Int { station.equipment.filter { outage(for: $0) != nil }.count }
    func refresh() async {
        guard !refreshing else { return }
        refreshing = true
        defer { refreshing = false }
        do {
            async let stopFeed = fetch("https://www.goodservice.io/api/stops")
            async let routeFeed = fetch("https://www.goodservice.io/api/routes")
            async let equipmentFeed = fetch("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fnyct_ene_equipments.json")
            async let outageFeed = fetch("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fnyct_ene.json")
            let (s, r, e, o) = try await (stopFeed, routeFeed, equipmentFeed, outageFeed)
            guard case .array = s["stops"], case .object = r["routes"], case .array = e, case .array = o else { throw FeedError.invalidResponse }
            let nextStations = FeedLogic.join(stations: s["stops"].list.map(Station.init), equipment: e.list.map(Equipment.init))
            guard !nextStations.isEmpty else { throw FeedError.invalidResponse }
            stations = nextStations
            routes = r["routes"].dictionary.mapValues { Route(color: $0["color"].text, textColor: $0["text_color"].text) }
            outages = o.list.map(Outage.init)
            updated = Date(); error = nil
            let saved = FeedSnapshot(stations: stations, routes: routes, outages: outages, updated: updated!)
            if let data = try? JSONEncoder().encode(saved) { try? data.write(to: cacheURL, options: .atomic) }
            for id in favourites { await loadTrips(id) }
        } catch {
            self.error = updated == nil ? "Couldn’t load station status. Tap refresh to retry." : "Couldn’t refresh. Showing saved status."
        }
    }
    func loadTrips(_ id: String) async {
        guard !loadingTrips.contains(id) else { return }
        loadingTrips.insert(id)
        defer { loadingTrips.remove(id) }
        do {
            var result: [Trip] = []
            for part in id.components(separatedBy: "/") {
                let value = try await fetch("https://www.goodservice.io/api/stops/\(part)")
                guard case .object = value["upcoming_trips"] else { throw FeedError.invalidResponse }
                for direction in ["north", "south"] {
                    result += value["upcoming_trips"][direction].list.map { Trip($0, direction: direction) }
                }
            }
            var seen: Set<String> = []
            trips[id] = result.sorted { $0.arrival < $1.arrival }.filter { seen.insert($0.id).inserted }
            tripErrors.remove(id)
        } catch { tripErrors.insert(id) }
    }
    private func fetch(_ address: String) async throws -> JSONValue {
        guard let url = URL(string: address) else { throw FeedError.invalidResponse }
        var request = URLRequest(url: url)
        request.timeoutInterval = 25
        // Optional deployment configuration; never embed the legacy PWA credential in source.
        if url.host == "api-endpoint.mta.info", let key = Bundle.main.object(forInfoDictionaryKey: "MTAAPIKey") as? String, !key.isEmpty, !key.hasPrefix("$(") {
            request.setValue(key, forHTTPHeaderField: "x-api-key")
        }
        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else { throw FeedError.invalidResponse }
        return try JSONDecoder().decode(JSONValue.self, from: data)
    }
    enum FeedError: Error { case invalidResponse }
}

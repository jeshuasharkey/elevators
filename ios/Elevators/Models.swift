import Foundation

// The feeds contain unrelated fields and occasionally encode numbers as strings.
indirect enum JSONValue: Codable, Sendable {
    case object([String: JSONValue]), array([JSONValue]), string(String), number(Double), bool(Bool), null
    init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if c.decodeNil() { self = .null }
        else if let v = try? c.decode(String.self) { self = .string(v) }
        else if let v = try? c.decode(Double.self) { self = .number(v) }
        else if let v = try? c.decode(Bool.self) { self = .bool(v) }
        else if let v = try? c.decode([String: JSONValue].self) { self = .object(v) }
        else { self = .array(try c.decode([JSONValue].self)) }
    }
    func encode(to encoder: Encoder) throws {
        var c = encoder.singleValueContainer()
        switch self {
        case .object(let v): try c.encode(v)
        case .array(let v): try c.encode(v)
        case .string(let v): try c.encode(v)
        case .number(let v): try c.encode(v)
        case .bool(let v): try c.encode(v)
        case .null: try c.encodeNil()
        }
    }
    subscript(_ key: String) -> JSONValue { if case .object(let v) = self { return v[key] ?? .null }; return .null }
    var text: String { switch self { case .string(let v): return v; case .number(let v): return String(v); default: return "" } }
    var number: Double { if case .number(let v) = self { return v }; return Double(text) ?? 0 }
    var list: [JSONValue] { if case .array(let v) = self { return v }; return [] }
    var dictionary: [String: JSONValue] { if case .object(let v) = self { return v }; return [:] }
}
struct Equipment: Identifiable, Codable, Sendable {
    let id: String
    let type: String
    let description: String
    let stationIDs: [String]
    let routes: [String]
    init(_ v: JSONValue) {
        id = v["equipmentno"].text; type = v["equipmenttype"].text
        description = v["shortdescription"].text
        stationIDs = v["elevatorsgtfsstopid"].text.components(separatedBy: "/").map { $0.trimmingCharacters(in: .whitespaces) }
        routes = v["trainno"].text.components(separatedBy: "/")
    }
}
struct Outage: Codable, Sendable {
    let equipment: String
    let reason: String
    let started: String
    let estimatedReturn: String
    init(_ v: JSONValue) {
        equipment = v["equipment"].text; reason = v["reason"].text
        started = v["outagedate"].text; estimatedReturn = v["estimatedreturntoservice"].text
    }
}
struct Station: Identifiable, Codable, Sendable {
    let id: String
    let name: String
    let routes: [String]
    var equipment: [Equipment] = []
    init(_ v: JSONValue) {
        id = v["id"].text; name = v["name"].text
        routes = v["routes"].dictionary.keys.sorted()
    }
}
struct Route: Codable, Sendable { let color: String; let textColor: String }
struct Trip: Identifiable, Sendable {
    let id: String
    let route: String
    let destination: String
    let arrival: Date
    init(_ v: JSONValue, direction: String) {
        route = v["route_id"].text; destination = v["destination_stop"].text
        arrival = Date(timeIntervalSince1970: v["estimated_current_stop_arrival_time"].number)
        id = "\(v["id"].text)-\(direction)-\(route)-\(destination)"
    }
}
struct FeedSnapshot: Codable {
    var stations: [Station]
    var routes: [String: Route]
    var outages: [Outage]
    var updated: Date
}
enum FeedLogic {
    static func join(stations: [Station], equipment: [Equipment]) -> [Station] {
        stations.map { station in
            var result = station
            result.equipment = equipment.filter {
                $0.stationIDs.contains(station.id) && !$0.routes.filter(station.routes.contains).isEmpty
            }
            return result
        }
    }
    static func age(_ date: Date, now: Date) -> String {
        let seconds = max(0, now.timeIntervalSince(date))
        let units: [(Double, Double, String)] = [(45, 1, "s"), (3000, 60, "m"), (79200, 3600, "h"), (2160000, 86400, "d"), (31449600, 604800, "w"), (.infinity, 31449600, "y")]
        let unit = units.first { seconds <= $0.0 }!
        return "\(Int((seconds / unit.1).rounded()))\(unit.2)"
    }
}

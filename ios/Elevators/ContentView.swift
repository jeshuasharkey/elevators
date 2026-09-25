import SwiftUI

struct ContentView: View {
    @EnvironmentObject var store: TransitStore
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    @Environment(\.scenePhase) var scenePhase
    @State private var query = ""
    @State private var listView = false
    @State private var selectedID: String = "M12"
    @State private var detail: Station?
    @State private var menu: Station?
    @State private var refreshRotation: Double = 0
    @FocusState private var searchFocused: Bool
    private var motion: Animation? { reduceMotion ? nil : .interpolatingSpring(mass: 1, stiffness: 360, damping: 24, initialVelocity: 0) }
    var body: some View {
        ZStack {
            Color.canvas.ignoresSafeArea()
            VStack(spacing: 0) {
                header
                if let error = store.error {
                    Text(error).font(.pwa(13, .medium)).foregroundStyle(Color.ink)
                        .padding(.horizontal, 20).padding(.bottom, 8).accessibilityAddTraits(.updatesFrequently)
                }
                if !query.isEmpty { searchResults }
                else if store.stations.isEmpty {
                    Spacer()
                    if store.refreshing { ProgressView().tint(.black).accessibilityLabel("Loading stations") }
                    Spacer()
                } else if store.favouriteStations.isEmpty {
                    Spacer()
                    Text("Find stations to add to favourites").font(.pwa(18)).foregroundStyle(.secondary).padding(32)
                    Spacer()
                } else if listView { stationList }
                else { carousel }
            }.accessibilityHidden(detail != nil || menu != nil)
            if detail != nil {
                LinearGradient(colors: [.clear, .black.opacity(0.3)], startPoint: .top, endPoint: UnitPoint(x: 0.5, y: 0.12))
                    .ignoresSafeArea().onTapGesture(perform: dismissDetail).transition(.opacity).zIndex(0.5)
            }
            if let detail {
                StationOverlay(station: detail, showMenu: presentMenu, dismiss: dismissDetail)
                    .transition(.move(edge: .bottom)).zIndex(1).accessibilityHidden(menu != nil)
            }
            if menu != nil {
                LinearGradient(colors: [.clear, .black.opacity(0.5)], startPoint: .top, endPoint: .bottom)
                    .ignoresSafeArea().onTapGesture(perform: dismissMenu).transition(.opacity).zIndex(2)
                    .animation(.easeInOut(duration: 0.2), value: menu?.id)
            }
            if let menu {
                StationMenu(station: menu, dismiss: dismissMenu)
                    .transition(.asymmetric(insertion: .move(edge: .bottom), removal: .offset(y: 650))).zIndex(3)
            }
        }.foregroundStyle(.black).preferredColorScheme(.light)
            .task { await store.refresh() }
            .onChange(of: scenePhase) { phase in
                if phase == .active, let updated = store.updated, Date().timeIntervalSince(updated) > 60 { Task { await store.refresh() } }
            }
            .onChange(of: store.favourites) { _ in selectedID = store.favourites.first ?? "" }
            .onChange(of: store.stations.count) { _ in
                if !store.favouriteStations.contains(where: { $0.id == selectedID }) { selectedID = store.favouriteStations.first?.id ?? "" }
            }
    }
    private var header: some View {
        HStack(spacing: 16) {
            HStack(spacing: 12) {
                PWAIcon(name: "Search")
                TextField("", text: $query, prompt: Text("Find Stations").foregroundColor(.black.opacity(searchFocused ? 0.3 : 1)))
                    .font(.pwa(18)).tracking(0.45).textInputAutocapitalization(.never)
                    .autocorrectionDisabled().focused($searchFocused).accessibilityLabel("Find Stations")
            }.frame(maxWidth: .infinity)
            if !query.isEmpty {
                IconButton(name: "Cross", label: "Clear search") { query = "" }
            } else {
                Button {
                    withAnimation(reduceMotion ? nil : .easeInOut(duration: 0.3)) { refreshRotation += 180 }
                    Task { await store.refresh() }
                } label: { PWAIcon(name: "Refresh").rotationEffect(.degrees(refreshRotation)).padding(4) }
                    .buttonStyle(CardPress()).accessibilityLabel("Refresh station status")
                IconButton(name: listView ? "Cross" : "ListView", label: listView ? "Show cards" : "Show list") {
                    searchFocused = false; listView.toggle()
                }.frame(width: 28)
            }
        }.padding(20)
    }
    private var searchResults: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(store.stations.filter { $0.name.localizedCaseInsensitiveContains(query) }) { station in
                    SmallStationCard(station: station, searchStyle: true) {
                        searchFocused = false; withAnimation(motion) { detail = station }
                    }
                }
            }.padding(.horizontal, 20).padding(.bottom, 20)
        }.scrollDismissesKeyboard(.interactively)
    }
    private var stationList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(store.favouriteStations) { station in
                    SmallStationCard(station: station) { selectedID = station.id; listView = false }
                }
            }.padding(20)
        }
    }
    private var carousel: some View {
        VStack(spacing: 0) {
            TabView(selection: $selectedID) {
                ForEach(store.favouriteStations) { station in StationCard(station: station, showMenu: presentMenu).tag(station.id) }
            }.tabViewStyle(.page(indexDisplayMode: .never))
            ZStack(alignment: .topTrailing) {
                HStack(spacing: 8) {
                    ForEach(store.favouriteStations) { station in
                        Button { withAnimation(reduceMotion ? nil : .spring(response: 0.45, dampingFraction: 0.86)) { selectedID = station.id } } label: {
                            Circle().fill(.black.opacity(selectedID == station.id ? 1 : 0.3)).frame(width: 8, height: 8)
                        }.buttonStyle(.plain).accessibilityLabel("Show \(station.name)")
                    }
                }.opacity(store.favouriteStations.count <= 1 ? 0 : 1)
                    .frame(maxWidth: .infinity).padding(.top, 16).padding(.bottom, 32)
                if let updated = store.updated {
                    TimelineView(.periodic(from: .now, by: 1)) { context in
                        Text("\(FeedLogic.age(updated, now: context.date)) ago").font(.pwa(13)).tracking(0.65)
                    }.padding(.trailing, 40).padding(.top, 12)
                }
            }
        }
    }
    private func presentMenu(_ station: Station) { withAnimation(motion) { menu = station } }
    private func dismissMenu() { withAnimation(motion) { menu = nil } }
    private func dismissDetail() { withAnimation(motion) { detail = nil; menu = nil } }
}
private struct StationOverlay: View {
    let station: Station
    let showMenu: (Station) -> Void
    let dismiss: () -> Void
    @GestureState private var drag: CGFloat = 0
    @State private var contentDrag: CGFloat = 0
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .bottom) {
                VStack(spacing: 0) {
                    Capsule().fill(.black.opacity(0.14)).frame(width: 50, height: 3.75)
                        .frame(maxWidth: .infinity).frame(height: 40).contentShape(Rectangle())
                        .gesture(DragGesture().updating($drag) { value, state, _ in state = max(0, value.translation.height) }
                            .onEnded { if $0.translation.height > 90 || $0.predictedEndTranslation.height > 200 { dismiss() } })
                    StationCard(station: station, overlay: true, showMenu: showMenu,
                        pullChanged: { contentDrag = $0 },
                        pullEnded: { translation, predicted in
                            if translation > 90 || predicted > 200 { dismiss() }
                            withAnimation(reduceMotion ? nil : .spring(response: 0.35, dampingFraction: 0.85)) { contentDrag = 0 }
                        })
                }.frame(height: max(0, proxy.size.height - 30))
                    .background(.white, in: UnevenRoundedRectangle(topLeadingRadius: 36, topTrailingRadius: 36))
                    .offset(y: max(drag, contentDrag))
            }.accessibilityAddTraits(.isModal).accessibilityAction(.escape, dismiss)
        }
    }
}
private struct StationMenu: View {
    @EnvironmentObject var store: TransitStore
    @Environment(\.openURL) var openURL
    let station: Station
    let dismiss: () -> Void
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    @State private var appeared = false
    var body: some View {
        ZStack(alignment: .bottom) {
            VStack(spacing: 20) {
                VStack(spacing: 0) {
                    Button { store.toggleFavourite(station); dismiss() } label: {
                        menuRow(store.favourites.contains(station.id) ? "Remove" : "Favourite", store.favourites.contains(station.id) ? "Remove from favourites" : "Add to favourites")
                    }
                    Rectangle().fill(Color(hex: "F3F4F6")).frame(height: 1)
                    Button {
                        var components = URLComponents(string: "https://www.google.com/maps/search/")!
                        components.queryItems = [URLQueryItem(name: "api", value: "1"), URLQueryItem(name: "query", value: "\(station.name) \(station.routes.joined(separator: "/")) Subway Station")]
                        if let url = components.url { openURL(url) }
                        dismiss()
                    } label: { menuRow("Navigate", "Navigate here") }
                }.background(.white, in: RoundedRectangle(cornerRadius: 32))
                Button(action: dismiss) {
                    Text("Cancel").font(.pwa(18, .semibold)).frame(maxWidth: .infinity).padding(16)
                        .background(.white, in: RoundedRectangle(cornerRadius: 24))
                }.offset(y: appeared || reduceMotion ? 0 : 70)
            }.buttonStyle(CardPress()).foregroundStyle(.black).padding(.horizontal, 20).padding(.bottom, 40)
                .onAppear { withAnimation(reduceMotion ? nil : .interpolatingSpring(mass: 1, stiffness: 160, damping: 18, initialVelocity: 0)) { appeared = true } }
        }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
            .accessibilityAddTraits(.isModal).accessibilityAction(.escape, dismiss)
    }
    private func menuRow(_ icon: String, _ title: String) -> some View {
        HStack(spacing: 16) { PWAIcon(name: icon); Text(title).font(.pwa(18, .semibold)); Spacer(minLength: 0) }
            .padding(24).contentShape(Rectangle())
    }
}

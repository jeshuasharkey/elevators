import SwiftUI

private struct ScrollPositionKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = nextValue() }
}
struct StationCard: View {
    @EnvironmentObject var store: TransitStore
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    let station: Station
    var overlay = false
    let showMenu: (Station) -> Void
    var pullChanged: ((CGFloat) -> Void)? = nil
    var pullEnded: ((CGFloat, CGFloat) -> Void)? = nil
    @State private var scrollOffset: CGFloat = 0
    private var compact: Bool { scrollOffset > 120 }
    var body: some View {
        ScrollView(.vertical) {
            VStack(spacing: 0) {
                GeometryReader { proxy in
                    Color.clear.preference(key: ScrollPositionKey.self, value: -proxy.frame(in: .named("card-\(station.id)")).minY)
                }.frame(height: 0)
                heading(compact: false).padding(.top, overlay ? 8 : 36).padding(.bottom, 32)
                equipment.padding(.top, 12).padding(.bottom, 32).padding(.horizontal, 32)
                departures.padding(.horizontal, 32).padding(.top, 12).padding(.bottom, 32)
            }
        }
        .scrollIndicators(.hidden)
        .coordinateSpace(name: "card-\(station.id)")
        .onPreferenceChange(ScrollPositionKey.self) { scrollOffset = $0 }
        .simultaneousGesture(DragGesture()
            .onChanged { value in
                if overlay && scrollOffset <= 0 && value.translation.height > 0 { pullChanged?(value.translation.height) }
            }
            .onEnded { value in
                if overlay { pullEnded?(scrollOffset <= 0 ? value.translation.height : 0, scrollOffset <= 0 ? value.predictedEndTranslation.height : 0) }
            })
        .overlay(alignment: .top) {
            heading(compact: true).padding(.top, 14).padding(.bottom, 4)
                .background(.white).offset(y: compact ? 0 : -400)
                .animation(reduceMotion ? nil : .easeInOut(duration: 0.6), value: compact)
                .allowsHitTesting(compact).accessibilityHidden(!compact)
        }
        .background(.white)
        .clipShape(RoundedRectangle(cornerRadius: 36, style: .circular))
        .task(id: station.id) { await store.loadTrips(station.id) }
    }
    private func heading(compact: Bool) -> some View {
        VStack(alignment: .leading, spacing: compact ? 6 : 16) {
            StationTitle(text: station.name, size: compact ? 24 : 46)
                .padding(.trailing, 40).foregroundStyle(.black)
            HStack(alignment: .top, spacing: compact ? 8 : 16) {
                WrapLayout(spacing: compact ? 4 : 8) {
                    if overlay && !compact && store.favourites.contains(station.id) {
                        PWAIcon(name: "Favourite", color: .favourite, filled: true, width: 20).padding(.trailing, 8)
                    }
                    ForEach(station.routes, id: \.self) { RouteBadge(id: $0, size: compact ? 20 : 32) }
                }.frame(maxWidth: .infinity, alignment: .leading)
                if !station.equipment.isEmpty {
                    let count = store.inactiveCount(station)
                    HStack(spacing: compact ? 5.6 : 8) {
                        PWAIcon(name: count > 0 ? "Alert" : "Tick", color: count > 0 ? .outage : .black, width: compact ? 18.2 : 26)
                        if !compact || count > 0 {
                            Text(compact ? "\(count)" : count > 0 ? "\(count) Inactive" : "All Active")
                                .font(.pwa(compact ? 14 : 20, .bold)).fixedSize()
                        }
                    }.foregroundStyle(count > 0 ? Color.outage : .black)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .overlay(alignment: .topTrailing) {
            Button { showMenu(station) } label: { PWAIcon(name: "MoreMenu").padding(.horizontal, 8).padding(.vertical, 16) }
                .buttonStyle(CardPress()).accessibilityLabel("Options for \(station.name)")
                .offset(y: compact ? -4 : -20)
        }.padding(.horizontal, 32)
    }
    private var equipment: some View {
        VStack(spacing: 12) {
            if station.equipment.isEmpty {
                HStack(alignment: .top, spacing: 12) {
                    PWAIcon(name: "NotAccessible", color: Color(hex: "E4EAEF"))
                    Text("Not an accessible station").font(.pwa(16, .medium))
                }.foregroundStyle(Color(hex: "D0D7DC"))
                    .padding(20).frame(maxWidth: .infinity, alignment: .leading)
                    .overlay(RoundedRectangle(cornerRadius: 26).stroke(Color.canvas, lineWidth: 2))
            } else {
                ForEach(station.equipment) { item in EquipmentRow(equipment: item, outage: store.outage(for: item)) }
            }
        }
    }
    private var departures: some View {
        TimelineView(.periodic(from: .now, by: 1)) { context in
            VStack(spacing: 12) {
                if store.tripErrors.contains(station.id) {
                    Button("Couldn’t load arrivals. Retry") { Task { await store.loadTrips(station.id) } }
                        .font(.pwa(14, .medium)).foregroundStyle(.secondary)
                }
                let upcoming = (store.trips[station.id] ?? []).filter { $0.arrival > context.date }
                ForEach(Array(upcoming.enumerated()), id: \.element.id) { index, trip in
                    DepartureRow(trip: trip, now: context.date, index: index)
                }
            }
        }
    }
}
private struct DepartureRow: View {
    @EnvironmentObject var store: TransitStore
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    let trip: Trip
    let now: Date
    let index: Int
    @State private var appeared = false
    var body: some View {
        let minutes = max(0, Int((trip.arrival.timeIntervalSince(now) / 60).rounded()))
        HStack(spacing: 16) {
            RouteBadge(id: trip.route, size: 24)
            Text("to \(store.stations.first { $0.id == trip.destination }?.name ?? trip.destination)")
                .font(.pwa(16, .semibold)).lineLimit(1).frame(maxWidth: .infinity, alignment: .leading)
            HStack(alignment: .firstTextBaseline, spacing: 6) {
                Text(minutes == 0 ? "Now" : "\(minutes)").font(.pwa(22, .bold))
                if minutes > 0 { Text("min").font(.pwa(16, .medium)) }
            }.frame(width: 80, alignment: .trailing)
        }.foregroundStyle(Color.ink).opacity(appeared ? 1 : 0)
            .offset(y: appeared || reduceMotion ? 0 : 20)
            .onAppear { withAnimation(reduceMotion ? nil : .easeOut(duration: 0.3).delay(0.08 * Double(index))) { appeared = true } }
    }
}
struct EquipmentRow: View {
    let equipment: Equipment
    let outage: Outage?
    var body: some View {
        HStack(spacing: 12) {
            PWAIcon(name: equipment.type == "ES" ? "Escalator" : "Elevator", color: outage == nil ? .ink : .white)
            VStack(alignment: .leading, spacing: 8) {
                Text((equipment.description + (outage.map { " (\($0.reason))" } ?? "")).capitalized)
                    .font(.pwa(15, .semibold)).fixedSize(horizontal: false, vertical: true)
                if let outage {
                    VStack(alignment: .leading, spacing: 4) {
                        outageDate(outage.started, icon: "Alert")
                        outageDate(outage.estimatedReturn, icon: "Tick")
                    }
                }
            }.frame(maxWidth: .infinity, alignment: .leading)
            Text(outage == nil ? "ACTIVE" : "INACTIVE").font(.pwa(14, .bold))
                .foregroundStyle(outage == nil ? .black : Color.outage)
                .padding(.vertical, 4).padding(.horizontal, 8).background(.white, in: Capsule()).fixedSize()
        }.foregroundStyle(outage == nil ? Color.ink : .white)
            .padding(16).frame(minHeight: 72)
            .background(outage == nil ? Color.canvas : Color.outage, in: RoundedRectangle(cornerRadius: 26))
    }
    private func outageDate(_ value: String, icon: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            PWAIcon(name: icon, color: .white, width: 16)
            Text(Self.formatDate(value)).font(.pwa(12, .medium))
        }
    }
    static func formatDate(_ value: String) -> String {
        let parser = DateFormatter(); parser.locale = Locale(identifier: "en_US_POSIX"); parser.timeZone = TimeZone(identifier: "America/New_York")
        var parsed = ISO8601DateFormatter().date(from: value)
        for format in ["MM/dd/yyyy hh:mm:ss a", "MM/dd/yyyy HH:mm:ss", "yyyy-MM-dd'T'HH:mm:ss", "yyyy-MM-dd HH:mm:ss"] where parsed == nil {
            parser.dateFormat = format; parsed = parser.date(from: value)
        }
        guard let date = parsed else { return value.isEmpty ? "Not provided" : value }
        var calendar = Calendar(identifier: .gregorian); calendar.timeZone = parser.timeZone
        let day = calendar.component(.day, from: date)
        let ordinal = NumberFormatter(); ordinal.numberStyle = .ordinal; ordinal.locale = Locale(identifier: "en_US")
        parser.dateFormat = "h:mma EEE"
        let start = parser.string(from: date).replacingOccurrences(of: "AM", with: "am").replacingOccurrences(of: "PM", with: "pm")
        parser.dateFormat = "MMM yy"
        return "\(start) \(ordinal.string(from: NSNumber(value: day)) ?? String(day)) \(parser.string(from: date))"
    }
}
struct SmallStationCard: View {
    @EnvironmentObject var store: TransitStore
    let station: Station
    var searchStyle = false
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 8) {
                StationTitle(text: station.name, size: 24).frame(maxWidth: .infinity, alignment: .leading)
                HStack(alignment: .bottom, spacing: 8) {
                    WrapLayout(spacing: 4) {
                        if searchStyle && store.favourites.contains(station.id) {
                            PWAIcon(name: "Favourite", color: .favourite, filled: true, width: 16).padding(.trailing, 8)
                        }
                        ForEach(station.routes, id: \.self) { RouteBadge(id: $0, size: 24) }
                    }.frame(maxWidth: .infinity, alignment: .leading)
                    HStack(spacing: 4) {
                        equipmentCount("ES"); equipmentCount("EL")
                        if store.inactiveCount(station) > 0 { PWAIcon(name: "Alert", color: Color(hex: "BD8A5B"), width: 24) }
                    }
                }
            }.padding(.horizontal, 24).padding(.vertical, 20)
                .background(.white, in: RoundedRectangle(cornerRadius: 30))
        }.buttonStyle(CardPress())
    }
    @ViewBuilder private func equipmentCount(_ type: String) -> some View {
        let items = station.equipment.filter { $0.type == type }
        if !items.isEmpty {
            let inactive = items.contains { store.outage(for: $0) != nil }
            HStack(spacing: 4) {
                Text("\(items.count)").font(.pwa(16))
                PWAIcon(name: type == "ES" ? "Escalator" : "Elevator", color: .white, width: 16)
            }.foregroundStyle(.white).padding(.vertical, 2).padding(.horizontal, 8)
                .background(Color(hex: inactive ? "BD8A5B" : "C5C5C5"), in: Capsule())
        }
    }
}

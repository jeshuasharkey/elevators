import XCTest
@testable import Elevators

final class ElevatorsTests: XCTestCase {
    private func json(_ source: String) throws -> JSONValue { try JSONDecoder().decode(JSONValue.self, from: Data(source.utf8)) }
    func testEquipmentJoinUsesExactStopIDsAndRoutes() throws {
        let a = Station(try json(#"{"id":"M1","name":"A","routes":{"M":[]}}"#))
        let b = Station(try json(#"{"id":"M12","name":"B","routes":{"M":[]}}"#))
        let c = Station(try json(#"{"id":"M12","name":"Other line","routes":{"J":[]}}"#))
        let equipment = Equipment(try json(#"{"equipmentno":"EL1","equipmenttype":"EL","shortdescription":"Platform","elevatorsgtfsstopid":"M12/M16","trainno":"M"}"#))
        let joined = FeedLogic.join(stations: [a, b, c], equipment: [equipment])
        XCTAssertTrue(joined[0].equipment.isEmpty)
        XCTAssertEqual(joined[1].equipment.map(\.id), ["EL1"])
        XCTAssertTrue(joined[2].equipment.isEmpty)
    }
    func testNullRouteTextColorAndNumericArrivalDecode() throws {
        let v = try json(#"{"text_color":null,"estimated_current_stop_arrival_time":"1800000000","route_id":"M","id":"test","destination_stop":"M01"}"#)
        XCTAssertEqual(v["text_color"].text, "")
        XCTAssertEqual(Trip(v, direction: "north").arrival.timeIntervalSince1970, 1800000000)
    }
    func testPWAUpdateAgeBoundaries() {
        let now = Date(timeIntervalSince1970: 1800000000)
        XCTAssertEqual(FeedLogic.age(now.addingTimeInterval(-45), now: now), "45s")
        XCTAssertEqual(FeedLogic.age(now.addingTimeInterval(-46), now: now), "1m")
        XCTAssertEqual(FeedLogic.age(now.addingTimeInterval(-3600), now: now), "1h")
        XCTAssertEqual(FeedLogic.age(now.addingTimeInterval(10), now: now), "0s")
    }
    func testOutageDatesUseNewYorkAndOrdinal() {
        XCTAssertEqual(EquipmentRow.formatDate("09/29/2026 10:00:00 PM"), "10:00pm Tue 29th Sep 26")
        XCTAssertEqual(EquipmentRow.formatDate(""), "Not provided")
    }
    func testSnapshotRoundTripRetainsEquipmentAndOutages() throws {
        let e = Equipment(try json(#"{"equipmentno":"EL1","equipmenttype":"EL","shortdescription":"Street","elevatorsgtfsstopid":"M12","trainno":"M"}"#))
        var s = Station(try json(#"{"id":"M12","name":"Flushing Av","routes":{"M":[]}}"#)); s.equipment = [e]
        let outage = Outage(try json(#"{"equipment":"EL1","reason":"Repair","outagedate":"today","estimatedreturntoservice":"tomorrow"}"#))
        let saved = FeedSnapshot(stations: [s], routes: [:], outages: [outage], updated: Date(timeIntervalSince1970: 100))
        let decoded = try JSONDecoder().decode(FeedSnapshot.self, from: JSONEncoder().encode(saved))
        XCTAssertEqual(decoded.stations[0].equipment[0].id, "EL1")
        XCTAssertEqual(decoded.outages[0].reason, "Repair")
        XCTAssertEqual(decoded.updated, saved.updated)
    }
}

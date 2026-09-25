import SwiftUI

@main struct ElevatorsApp: App {
    @StateObject private var store = TransitStore()
    var body: some Scene {
        WindowGroup { ContentView().environmentObject(store) }
    }
}

import SwiftUI
import UIKit

extension Color {
    init(hex: String) {
        let digits = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        let value = UInt64(digits, radix: 16) ?? 0
        self.init(.sRGB, red: Double((value >> 16) & 255) / 255, green: Double((value >> 8) & 255) / 255, blue: Double(value & 255) / 255, opacity: 1)
    }
    static let canvas = Color(hex: "EBF0F4")
    static let ink = Color(hex: "202020")
    static let outage = Color(hex: "E68C79")
    static let favourite = Color(hex: "B87079")
}
extension Font {
    static func pwa(_ size: CGFloat, _ weight: Font.Weight = .regular) -> Font { .system(size: size, weight: weight, design: .rounded) }
}
struct CardPress: ButtonStyle {
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    func makeBody(configuration: Configuration) -> some View {
        configuration.label.scaleEffect(configuration.isPressed && !reduceMotion ? 0.98 : 1)
            .animation(.spring(response: 0.3, dampingFraction: 0.8), value: configuration.isPressed)
    }
}
struct RouteBadge: View {
    @EnvironmentObject var store: TransitStore
    let id: String
    var size: CGFloat = 32
    var body: some View {
        let route = store.routes[id]
        Text(id).font(.pwa(size == 32 ? 18 : size == 24 ? 16 : 14, .bold))
            .foregroundStyle(Color(hex: route?.textColor.isEmpty == false ? route!.textColor : "FFFFFF"))
            .frame(width: size, height: size)
            .background(Color(hex: route?.color ?? "808183"), in: Circle())
            .overlay(Circle().fill(.white.opacity(0.3))).accessibilityLabel("Train \(id)")
    }
}
struct WrapLayout: Layout {
    var spacing: CGFloat = 8
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        arrange(subviews, width: proposal.width ?? 10000).size
    }
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = arrange(subviews, width: bounds.width)
        for (index, point) in result.points.enumerated() {
            subviews[index].place(at: CGPoint(x: bounds.minX + point.x, y: bounds.minY + point.y), proposal: .unspecified)
        }
    }
    private func arrange(_ subviews: Subviews, width: CGFloat) -> (size: CGSize, points: [CGPoint]) {
        var x: CGFloat = 0; var y: CGFloat = 0; var rowHeight: CGFloat = 0; var maxX: CGFloat = 0
        var points: [CGPoint] = []
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x > 0 && x + size.width > width { x = 0; y += rowHeight + spacing; rowHeight = 0 }
            points.append(CGPoint(x: x, y: y)); maxX = max(maxX, x + size.width)
            x += size.width + spacing; rowHeight = max(rowHeight, size.height)
        }
        return (CGSize(width: min(width, maxX), height: y + rowHeight), points)
    }
}
struct IconButton: View {
    let name: String
    let label: String
    let action: () -> Void
    var body: some View {
        Button(action: action) { PWAIcon(name: name).padding(4).contentShape(Rectangle()) }
            .buttonStyle(CardPress()).accessibilityLabel(label)
    }
}
// Match CSS line-height: 100%, without SwiftUI Text's additional font leading.
struct StationTitle: UIViewRepresentable {
    let text: String
    let size: CGFloat
    func makeUIView(context: Context) -> UILabel {
        let label = UILabel()
        label.numberOfLines = 0
        label.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
        label.isAccessibilityElement = true
        label.accessibilityTraits = .header
        return label
    }
    func updateUIView(_ label: UILabel, context: Context) {
        let base = UIFont.systemFont(ofSize: size, weight: .heavy)
        let font = UIFont(descriptor: base.fontDescriptor.withDesign(.rounded) ?? base.fontDescriptor, size: size)
        let paragraph = NSMutableParagraphStyle()
        paragraph.minimumLineHeight = size
        paragraph.maximumLineHeight = size
        label.attributedText = NSAttributedString(string: text, attributes: [
            .font: font, .foregroundColor: UIColor.black, .paragraphStyle: paragraph,
            .baselineOffset: (size - font.lineHeight) / 2
        ])
        label.accessibilityLabel = text
    }
    func sizeThatFits(_ proposal: ProposedViewSize, uiView: UILabel, context: Context) -> CGSize? {
        let width = proposal.width ?? 300
        let measured = uiView.sizeThatFits(CGSize(width: width, height: .greatestFiniteMagnitude))
        return CGSize(width: width, height: measured.height)
    }
}

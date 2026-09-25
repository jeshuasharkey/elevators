// Generated from the original PWA SVG paths. Keep geometry in sync with components/icons.
import SwiftUI

struct PWAIcon: View {
    let name: String
    var color: Color = .black
    var filled = false
    var width: CGFloat? = nil
    var body: some View {
        let size = Self.size(name)
        Canvas { context, canvas in
            context.scaleBy(x: canvas.width / size.width, y: canvas.height / size.height)
            for element in Self.elements(name) {
                if element.fill { context.fill(element.path, with: .color(element.white ? .white : color)) }
                if element.stroke > 0 { context.stroke(element.path, with: .color(color), style: StrokeStyle(lineWidth: element.stroke, lineCap: .round, lineJoin: .round)) }
                if filled && name == "Favourite" { context.fill(element.path, with: .color(color)) }
            }
        }.frame(width: width ?? size.width, height: (width ?? size.width) * size.height / size.width)
        .accessibilityHidden(true)
    }
    private struct Element { let path: Path; let stroke: CGFloat; let fill: Bool; let white: Bool }
    private static func size(_ name: String) -> CGSize {
        switch name {
        case "Alert": return CGSize(width: 26, height: 26)
        case "CardView": return CGSize(width: 20, height: 16)
        case "Cross": return CGSize(width: 16, height: 16)
        case "Elevator": return CGSize(width: 19, height: 19)
        case "Escalator": return CGSize(width: 21, height: 19)
        case "Favourite": return CGSize(width: 27, height: 24)
        case "ListView": return CGSize(width: 20, height: 14)
        case "MoreMenu": return CGSize(width: 23, height: 5)
        case "Navigate": return CGSize(width: 26, height: 23)
        case "NotAccessible": return CGSize(width: 24, height: 27)
        case "Refresh": return CGSize(width: 19, height: 18)
        case "Remove": return CGSize(width: 24, height: 26)
        case "Search": return CGSize(width: 20, height: 20)
        case "Tick": return CGSize(width: 26, height: 26)
        default: return CGSize(width: 24, height: 24)
        }
    }
    private static func elements(_ name: String) -> [Element] {
        switch name {
        case "Alert": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 13, y: 25)); p.addCurve(to: CGPoint(x: 25, y: 13), control1: CGPoint(x: 19.6274, y: 25), control2: CGPoint(x: 25, y: 19.6274)); p.addCurve(to: CGPoint(x: 13, y: 1), control1: CGPoint(x: 25, y: 6.37258), control2: CGPoint(x: 19.6274, y: 1)); p.addCurve(to: CGPoint(x: 1, y: 13), control1: CGPoint(x: 6.37258, y: 1), control2: CGPoint(x: 1, y: 6.37258)); p.addCurve(to: CGPoint(x: 13, y: 25), control1: CGPoint(x: 1, y: 19.6274), control2: CGPoint(x: 6.37258, y: 25)); p.closeSubpath() }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 13, y: 7)); p.addLine(to: CGPoint(x: 13, y: 14)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 13, y: 20)); p.addCurve(to: CGPoint(x: 14.5, y: 18.5), control1: CGPoint(x: 13.8284, y: 20), control2: CGPoint(x: 14.5, y: 19.3284)); p.addCurve(to: CGPoint(x: 13, y: 17), control1: CGPoint(x: 14.5, y: 17.6716), control2: CGPoint(x: 13.8284, y: 17)); p.addCurve(to: CGPoint(x: 11.5, y: 18.5), control1: CGPoint(x: 12.1716, y: 17), control2: CGPoint(x: 11.5, y: 17.6716)); p.addCurve(to: CGPoint(x: 13, y: 20), control1: CGPoint(x: 11.5, y: 19.3284), control2: CGPoint(x: 12.1716, y: 20)); p.closeSubpath() }, stroke: 0, fill: true, white: false),
        ]
        case "CardView": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 1, y: 3)); p.addCurve(to: CGPoint(x: 3, y: 1), control1: CGPoint(x: 1, y: 1.89543), control2: CGPoint(x: 1.89543, y: 1)); p.addLine(to: CGPoint(x: 6.53564, y: 1)); p.addCurve(to: CGPoint(x: 8.53564, y: 3), control1: CGPoint(x: 7.64021, y: 1), control2: CGPoint(x: 8.53564, y: 1.89543)); p.addLine(to: CGPoint(x: 8.53564, y: 13)); p.addCurve(to: CGPoint(x: 6.53564, y: 15), control1: CGPoint(x: 8.53564, y: 14.1046), control2: CGPoint(x: 7.64021, y: 15)); p.addLine(to: CGPoint(x: 3, y: 15)); p.addCurve(to: CGPoint(x: 1, y: 13), control1: CGPoint(x: 1.89543, y: 15), control2: CGPoint(x: 1, y: 14.1046)); p.addLine(to: CGPoint(x: 1, y: 3)); p.closeSubpath() }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 11.4634, y: 3)); p.addCurve(to: CGPoint(x: 13.4634, y: 1), control1: CGPoint(x: 11.4634, y: 1.89543), control2: CGPoint(x: 12.3588, y: 1)); p.addLine(to: CGPoint(x: 16.9991, y: 1)); p.addCurve(to: CGPoint(x: 18.9991, y: 3), control1: CGPoint(x: 18.1036, y: 1), control2: CGPoint(x: 18.9991, y: 1.89543)); p.addLine(to: CGPoint(x: 18.9991, y: 13)); p.addCurve(to: CGPoint(x: 16.9991, y: 15), control1: CGPoint(x: 18.9991, y: 14.1046), control2: CGPoint(x: 18.1036, y: 15)); p.addLine(to: CGPoint(x: 13.4634, y: 15)); p.addCurve(to: CGPoint(x: 11.4634, y: 13), control1: CGPoint(x: 12.3588, y: 15), control2: CGPoint(x: 11.4634, y: 14.1046)); p.addLine(to: CGPoint(x: 11.4634, y: 3)); p.closeSubpath() }, stroke: 2, fill: false, white: false),
        ]
        case "Cross": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 15, y: 1)); p.addLine(to: CGPoint(x: 1, y: 15)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 15, y: 15)); p.addLine(to: CGPoint(x: 1, y: 1)) }, stroke: 2, fill: false, white: false),
        ]
        case "Elevator": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 9.46666, y: 0.989258)); p.addLine(to: CGPoint(x: 15.9893, y: 0.989258)); p.addCurve(to: CGPoint(x: 17.9893, y: 2.98926), control1: CGPoint(x: 17.0938, y: 0.989258), control2: CGPoint(x: 17.9893, y: 1.88469)); p.addLine(to: CGPoint(x: 17.9893, y: 15.9893)); p.addCurve(to: CGPoint(x: 15.9893, y: 17.9893), control1: CGPoint(x: 17.9893, y: 17.0938), control2: CGPoint(x: 17.0938, y: 17.9893)); p.addLine(to: CGPoint(x: 9.46666, y: 17.9893)); p.addLine(to: CGPoint(x: 9.46666, y: 0.989258)); p.closeSubpath() }, stroke: 1.5, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 0.989258, y: 2.98926)); p.addCurve(to: CGPoint(x: 2.98926, y: 0.989258), control1: CGPoint(x: 0.989258, y: 1.88469), control2: CGPoint(x: 1.88469, y: 0.989258)); p.addLine(to: CGPoint(x: 9.51186, y: 0.989258)); p.addLine(to: CGPoint(x: 9.51186, y: 17.9893)); p.addLine(to: CGPoint(x: 2.98926, y: 17.9893)); p.addCurve(to: CGPoint(x: 0.989258, y: 15.9893), control1: CGPoint(x: 1.88469, y: 17.9893), control2: CGPoint(x: 0.989258, y: 17.0938)); p.addLine(to: CGPoint(x: 0.989258, y: 2.98926)); p.closeSubpath() }, stroke: 1.5, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 13.7278, y: 11.7557)); p.addLine(to: CGPoint(x: 13.7278, y: 7.22241)); p.move(to: CGPoint(x: 13.7278, y: 7.22241)); p.addLine(to: CGPoint(x: 12.0278, y: 8.92241)); p.move(to: CGPoint(x: 13.7278, y: 7.22241)); p.addLine(to: CGPoint(x: 15.4279, y: 8.92241)) }, stroke: 1.5, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 5.2508, y: 7.22253)); p.addLine(to: CGPoint(x: 5.2508, y: 11.7559)); p.move(to: CGPoint(x: 5.2508, y: 11.7559)); p.addLine(to: CGPoint(x: 3.55078, y: 10.0559)); p.move(to: CGPoint(x: 5.2508, y: 11.7559)); p.addLine(to: CGPoint(x: 6.95082, y: 10.0559)) }, stroke: 1.5, fill: false, white: false),
        ]
        case "Escalator": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 20.0425, y: 6.11214)); p.addCurve(to: CGPoint(x: 17.6433, y: 8.63321), control1: CGPoint(x: 20.0425, y: 7.50449), control2: CGPoint(x: 18.9683, y: 8.63321)); p.addLine(to: CGPoint(x: 16.1892, y: 8.63321)); p.addCurve(to: CGPoint(x: 15.4963, y: 8.90896), control1: CGPoint(x: 15.9315, y: 8.63321), control2: CGPoint(x: 15.6835, y: 8.73188)); p.addLine(to: CGPoint(x: 7.06355, y: 16.884)); p.addCurve(to: CGPoint(x: 4.98049, y: 17.7113), control1: CGPoint(x: 6.50072, y: 17.4163), control2: CGPoint(x: 5.75515, y: 17.7124)); p.addLine(to: CGPoint(x: 3.44191, y: 17.7091)); p.addCurve(to: CGPoint(x: 1.0427, y: 15.188), control1: CGPoint(x: 2.11686, y: 17.7091), control2: CGPoint(x: 1.0427, y: 16.5803)); p.addCurve(to: CGPoint(x: 3.44191, y: 12.6669), control1: CGPoint(x: 1.0427, y: 13.7956), control2: CGPoint(x: 2.11686, y: 12.6669)); p.addLine(to: CGPoint(x: 4.76604, y: 12.6669)); p.addCurve(to: CGPoint(x: 5.45893, y: 12.3912), control1: CGPoint(x: 5.02375, y: 12.6669), control2: CGPoint(x: 5.27168, y: 12.5683)); p.addLine(to: CGPoint(x: 13.8896, y: 4.41845)); p.addCurve(to: CGPoint(x: 15.968, y: 3.59123), control1: CGPoint(x: 14.4513, y: 3.8873), control2: CGPoint(x: 15.1949, y: 3.59131)); p.addLine(to: CGPoint(x: 17.6433, y: 3.59106)); p.addCurve(to: CGPoint(x: 20.0425, y: 6.11214), control1: CGPoint(x: 18.9683, y: 3.59106), control2: CGPoint(x: 20.0425, y: 4.71979)); p.closeSubpath() }, stroke: 1.51264, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 13.856, y: 17.6891)); p.addLine(to: CGPoint(x: 19.918, y: 11.9197)); p.move(to: CGPoint(x: 19.918, y: 11.9197)); p.addLine(to: CGPoint(x: 16.9039, y: 11.7631)); p.move(to: CGPoint(x: 19.918, y: 11.9197)); p.addLine(to: CGPoint(x: 19.7808, y: 14.8341)) }, stroke: 1.51264, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 7.97024, y: 6.14744)); p.addCurve(to: CGPoint(x: 9.10084, y: 5.01685), control1: CGPoint(x: 7.97025, y: 5.52303), control2: CGPoint(x: 8.47643, y: 5.01685)); p.addLine(to: CGPoint(x: 9.10084, y: 5.01685)); p.addCurve(to: CGPoint(x: 10.2314, y: 6.14746), control1: CGPoint(x: 9.72526, y: 5.01685), control2: CGPoint(x: 10.2315, y: 5.52304)); p.addLine(to: CGPoint(x: 10.2314, y: 7.75475)); p.addLine(to: CGPoint(x: 7.97021, y: 9.98218)); p.addLine(to: CGPoint(x: 7.97024, y: 6.14744)); p.closeSubpath() }, stroke: 1.51264, fill: true, white: true),
            Element(path: Path { p in p.addEllipse(in: CGRect(x: 8.0708, y: 0.98999, width: 2.06, height: 2.06238)) }, stroke: 1.51264, fill: true, white: true),
        ]
        case "Favourite": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 13.5, y: 23)); p.addCurve(to: CGPoint(x: 1, y: 7.50001), control1: CGPoint(x: 13.5, y: 23), control2: CGPoint(x: 1, y: 16)); p.addCurve(to: CGPoint(x: 2.47328, y: 3.37908), control1: CGPoint(x: 1, y: 5.99737), control2: CGPoint(x: 1.52062, y: 4.54114)); p.addCurve(to: CGPoint(x: 6.22525, y: 1.12624), control1: CGPoint(x: 3.42593, y: 2.21703), control2: CGPoint(x: 4.75178, y: 1.42093)); p.addCurve(to: CGPoint(x: 10.5551, y: 1.76272), control1: CGPoint(x: 7.69871, y: 0.831543), control2: CGPoint(x: 9.22876, y: 1.05646)); p.addCurve(to: CGPoint(x: 13.5, y: 5.00001), control1: CGPoint(x: 11.8814, y: 2.46898), control2: CGPoint(x: 12.9221, y: 3.61296)); p.addCurve(to: CGPoint(x: 16.4449, y: 1.76272), control1: CGPoint(x: 14.0779, y: 3.61296), control2: CGPoint(x: 15.1186, y: 2.46898)); p.addCurve(to: CGPoint(x: 20.7748, y: 1.12624), control1: CGPoint(x: 17.7712, y: 1.05646), control2: CGPoint(x: 19.3013, y: 0.831543)); p.addCurve(to: CGPoint(x: 24.5267, y: 3.37908), control1: CGPoint(x: 22.2482, y: 1.42093), control2: CGPoint(x: 23.5741, y: 2.21703)); p.addCurve(to: CGPoint(x: 26, y: 7.50001), control1: CGPoint(x: 25.4794, y: 4.54114), control2: CGPoint(x: 26, y: 5.99737)); p.addCurve(to: CGPoint(x: 13.5, y: 23), control1: CGPoint(x: 26, y: 16), control2: CGPoint(x: 13.5, y: 23)); p.closeSubpath() }, stroke: 2, fill: false, white: false),
        ]
        case "ListView": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 6, y: 1)); p.addLine(to: CGPoint(x: 19, y: 1)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 6, y: 7)); p.addLine(to: CGPoint(x: 19, y: 7)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 6, y: 13)); p.addLine(to: CGPoint(x: 19, y: 13)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 1, y: 1)); p.addLine(to: CGPoint(x: 1.01, y: 1)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 1, y: 7)); p.addLine(to: CGPoint(x: 1.01, y: 7)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 1, y: 13)); p.addLine(to: CGPoint(x: 1.01, y: 13)) }, stroke: 2, fill: false, white: false),
        ]
        case "MoreMenu": return [
            Element(path: Path { p in p.addEllipse(in: CGRect(x: 0, y: 0, width: 5, height: 5)) }, stroke: 0, fill: true, white: false),
            Element(path: Path { p in p.addEllipse(in: CGRect(x: 9, y: 0, width: 5, height: 5)) }, stroke: 0, fill: true, white: false),
            Element(path: Path { p in p.addEllipse(in: CGRect(x: 18, y: 0, width: 5, height: 5)) }, stroke: 0, fill: true, white: false),
        ]
        case "Navigate": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 22, y: 22)); p.addCurve(to: CGPoint(x: 25, y: 19), control1: CGPoint(x: 23.6569, y: 22), control2: CGPoint(x: 25, y: 20.6569)); p.addCurve(to: CGPoint(x: 22, y: 16), control1: CGPoint(x: 25, y: 17.3431), control2: CGPoint(x: 23.6569, y: 16)); p.addCurve(to: CGPoint(x: 19, y: 19), control1: CGPoint(x: 20.3431, y: 16), control2: CGPoint(x: 19, y: 17.3431)); p.addCurve(to: CGPoint(x: 22, y: 22), control1: CGPoint(x: 19, y: 20.6569), control2: CGPoint(x: 20.3431, y: 22)); p.closeSubpath() }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 6, y: 1)); p.addLine(to: CGPoint(x: 18, y: 1)); p.addCurve(to: CGPoint(x: 20.8284, y: 2.17157), control1: CGPoint(x: 19.0609, y: 1), control2: CGPoint(x: 20.0783, y: 1.42143)); p.addCurve(to: CGPoint(x: 22, y: 5), control1: CGPoint(x: 21.5786, y: 2.92172), control2: CGPoint(x: 22, y: 3.93913)); p.addCurve(to: CGPoint(x: 20.8284, y: 7.82843), control1: CGPoint(x: 22, y: 6.06087), control2: CGPoint(x: 21.5786, y: 7.07828)); p.addCurve(to: CGPoint(x: 18, y: 9), control1: CGPoint(x: 20.0783, y: 8.57857), control2: CGPoint(x: 19.0609, y: 9)); p.addLine(to: CGPoint(x: 6, y: 9)); p.addCurve(to: CGPoint(x: 2.46447, y: 10.4645), control1: CGPoint(x: 4.67392, y: 9), control2: CGPoint(x: 3.40215, y: 9.52678)); p.addCurve(to: CGPoint(x: 1, y: 14), control1: CGPoint(x: 1.52678, y: 11.4021), control2: CGPoint(x: 1, y: 12.6739)); p.addCurve(to: CGPoint(x: 2.46447, y: 17.5355), control1: CGPoint(x: 1, y: 15.3261), control2: CGPoint(x: 1.52678, y: 16.5979)); p.addCurve(to: CGPoint(x: 6, y: 19), control1: CGPoint(x: 3.40215, y: 18.4732), control2: CGPoint(x: 4.67392, y: 19)); p.addLine(to: CGPoint(x: 19, y: 19)) }, stroke: 2, fill: false, white: false),
        ]
        case "NotAccessible": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 12.0292, y: 2.61279)); p.addLine(to: CGPoint(x: 6.60248, y: 2.61279)); p.addCurve(to: CGPoint(x: 1, y: 8.21527), control1: CGPoint(x: 3.50832, y: 2.61279), control2: CGPoint(x: 1, y: 5.12111)); p.addLine(to: CGPoint(x: 1, y: 18.4361)); p.addCurve(to: CGPoint(x: 6.51463, y: 23.9507), control1: CGPoint(x: 1, y: 21.4818), control2: CGPoint(x: 3.46898, y: 23.9507)); p.addLine(to: CGPoint(x: 6.51463, y: 23.9507)); p.move(to: CGPoint(x: 11.9708, y: 23.9507)); p.addLine(to: CGPoint(x: 17.3975, y: 23.9507)); p.addCurve(to: CGPoint(x: 23, y: 18.3483), control1: CGPoint(x: 20.4917, y: 23.9507), control2: CGPoint(x: 23, y: 21.4424)); p.addLine(to: CGPoint(x: 23, y: 8.12741)); p.addCurve(to: CGPoint(x: 17.4854, y: 2.61279), control1: CGPoint(x: 23, y: 5.08177), control2: CGPoint(x: 20.531, y: 2.61279)); p.addLine(to: CGPoint(x: 17.4854, y: 2.61279)) }, stroke: 1.8, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 6.43964, y: 15.7823)); p.addLine(to: CGPoint(x: 6.43964, y: 10.7817)); p.move(to: CGPoint(x: 6.43964, y: 10.7817)); p.addLine(to: CGPoint(x: 8.37305, y: 12.6569)); p.move(to: CGPoint(x: 6.43964, y: 10.7817)); p.addLine(to: CGPoint(x: 4.50623, y: 12.6569)) }, stroke: 1.8, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 17.5607, y: 10.7812)); p.addLine(to: CGPoint(x: 17.5607, y: 15.7817)); p.move(to: CGPoint(x: 17.5607, y: 15.7817)); p.addLine(to: CGPoint(x: 19.4941, y: 13.9065)); p.move(to: CGPoint(x: 17.5607, y: 15.7817)); p.addLine(to: CGPoint(x: 15.6273, y: 13.9065)) }, stroke: 1.8, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 15.1798, y: 1)); p.addLine(to: CGPoint(x: 8.81836, y: 26)) }, stroke: 1.8, fill: false, white: false),
        ]
        case "Refresh": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 13.7598, y: 6.42621)); p.addLine(to: CGPoint(x: 18.0009, y: 6.42621)); p.addLine(to: CGPoint(x: 18.0009, y: 2.06274)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 4.00391, y: 3.34451)); p.addCurve(to: CGPoint(x: 6.52497, y: 1.60936), control1: CGPoint(x: 4.72525, y: 2.60128), control2: CGPoint(x: 5.58194, y: 2.01166)); p.addCurve(to: CGPoint(x: 9.49974, y: 1), control1: CGPoint(x: 7.468, y: 1.20707), control2: CGPoint(x: 8.47886, y: 1)); p.addCurve(to: CGPoint(x: 12.4745, y: 1.60936), control1: CGPoint(x: 10.5206, y: 1), control2: CGPoint(x: 11.5315, y: 1.20707)); p.addCurve(to: CGPoint(x: 14.9956, y: 3.34451), control1: CGPoint(x: 13.4175, y: 2.01166), control2: CGPoint(x: 14.2742, y: 2.60128)); p.addLine(to: CGPoint(x: 17.9997, y: 6.42621)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 5.24116, y: 11.5714)); p.addLine(to: CGPoint(x: 1, y: 11.5714)); p.addLine(to: CGPoint(x: 1, y: 15.9349)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 14.9958, y: 14.6531)); p.addCurve(to: CGPoint(x: 12.4748, y: 16.3883), control1: CGPoint(x: 14.2745, y: 15.3963), control2: CGPoint(x: 13.4178, y: 15.986)); p.addCurve(to: CGPoint(x: 9.49999, y: 16.9976), control1: CGPoint(x: 11.5317, y: 16.7905), control2: CGPoint(x: 10.5209, y: 16.9976)); p.addCurve(to: CGPoint(x: 6.52522, y: 16.3883), control1: CGPoint(x: 8.47911, y: 16.9976), control2: CGPoint(x: 7.46825, y: 16.7905)); p.addCurve(to: CGPoint(x: 4.00416, y: 14.6531), control1: CGPoint(x: 5.58219, y: 15.986), control2: CGPoint(x: 4.7255, y: 15.3963)); p.addLine(to: CGPoint(x: 1, y: 11.5714)) }, stroke: 2, fill: false, white: false),
        ]
        case "Remove": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 23, y: 5)); p.addLine(to: CGPoint(x: 1, y: 5)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 9, y: 11)); p.addLine(to: CGPoint(x: 9, y: 19)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 15, y: 11)); p.addLine(to: CGPoint(x: 15, y: 19)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 21, y: 5)); p.addLine(to: CGPoint(x: 21, y: 24)); p.addCurve(to: CGPoint(x: 20.7071, y: 24.7071), control1: CGPoint(x: 21, y: 24.2652), control2: CGPoint(x: 20.8946, y: 24.5196)); p.addCurve(to: CGPoint(x: 20, y: 25), control1: CGPoint(x: 20.5196, y: 24.8946), control2: CGPoint(x: 20.2652, y: 25)); p.addLine(to: CGPoint(x: 4, y: 25)); p.addCurve(to: CGPoint(x: 3.29289, y: 24.7071), control1: CGPoint(x: 3.73478, y: 25), control2: CGPoint(x: 3.48043, y: 24.8946)); p.addCurve(to: CGPoint(x: 3, y: 24), control1: CGPoint(x: 3.10536, y: 24.5196), control2: CGPoint(x: 3, y: 24.2652)); p.addLine(to: CGPoint(x: 3, y: 5)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 17, y: 5)); p.addLine(to: CGPoint(x: 17, y: 3)); p.addCurve(to: CGPoint(x: 16.4142, y: 1.58579), control1: CGPoint(x: 17, y: 2.46957), control2: CGPoint(x: 16.7893, y: 1.96086)); p.addCurve(to: CGPoint(x: 15, y: 1), control1: CGPoint(x: 16.0391, y: 1.21071), control2: CGPoint(x: 15.5304, y: 1)); p.addLine(to: CGPoint(x: 9, y: 1)); p.addCurve(to: CGPoint(x: 7.58579, y: 1.58579), control1: CGPoint(x: 8.46957, y: 1), control2: CGPoint(x: 7.96086, y: 1.21071)); p.addCurve(to: CGPoint(x: 7, y: 3), control1: CGPoint(x: 7.21071, y: 1.96086), control2: CGPoint(x: 7, y: 2.46957)); p.addLine(to: CGPoint(x: 7, y: 5)) }, stroke: 2, fill: false, white: false),
        ]
        case "Search": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 11, y: 17)); p.addCurve(to: CGPoint(x: 3, y: 9), control1: CGPoint(x: 6.58172, y: 17), control2: CGPoint(x: 3, y: 13.4183)); p.addCurve(to: CGPoint(x: 11, y: 1), control1: CGPoint(x: 3, y: 4.58172), control2: CGPoint(x: 6.58172, y: 1)); p.addCurve(to: CGPoint(x: 19, y: 9), control1: CGPoint(x: 15.4183, y: 1), control2: CGPoint(x: 19, y: 4.58172)); p.addCurve(to: CGPoint(x: 11, y: 17), control1: CGPoint(x: 19, y: 13.4183), control2: CGPoint(x: 15.4183, y: 17)); p.closeSubpath() }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 0.999609, y: 19)); p.addLine(to: CGPoint(x: 5.34961, y: 14.65)) }, stroke: 2, fill: false, white: false),
        ]
        case "Tick": return [
            Element(path: Path { p in p.move(to: CGPoint(x: 18.5, y: 10)); p.addLine(to: CGPoint(x: 11.162, y: 17)); p.addLine(to: CGPoint(x: 7.5, y: 13.5)) }, stroke: 2, fill: false, white: false),
            Element(path: Path { p in p.move(to: CGPoint(x: 13, y: 25)); p.addCurve(to: CGPoint(x: 25, y: 13), control1: CGPoint(x: 19.627, y: 25), control2: CGPoint(x: 25, y: 19.627)); p.addCurve(to: CGPoint(x: 13, y: 1), control1: CGPoint(x: 25, y: 6.373), control2: CGPoint(x: 19.627, y: 1)); p.addCurve(to: CGPoint(x: 1, y: 13), control1: CGPoint(x: 6.373, y: 1), control2: CGPoint(x: 1, y: 6.373)); p.addCurve(to: CGPoint(x: 13, y: 25), control1: CGPoint(x: 1, y: 19.627), control2: CGPoint(x: 6.373, y: 25)); p.closeSubpath() }, stroke: 2, fill: false, white: false),
        ]
        default: return []
        }
    }
}

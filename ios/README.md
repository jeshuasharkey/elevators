# Elevators for iPhone

Native SwiftUI counterpart of the PWA in this repository. iOS 17+, Xcode 15+; no external Swift packages. Open `Elevators.xcodeproj`, select the shared **Elevators** scheme, and choose an iPhone simulator.

For a device/archive, select your Apple development team in Signing & Capabilities. The bundle identifier is `com.jeshuasharkey.elevators`; change it if App Store Connect uses a different identifier. This project has not been registered in App Store Connect or connected to an Xcode Cloud workflow.

```sh
xcodebuild -project ios/Elevators.xcodeproj -scheme Elevators \
  -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build

# Substitute an installed simulator name from `xcrun simctl list devices available`.
xcodebuild -project ios/Elevators.xcodeproj -scheme Elevators \
  -destination 'platform=iOS Simulator,name=iPhone 16' CODE_SIGNING_ALLOWED=NO test
```

## Source parity

| PWA source | Native implementation |
| --- | --- |
| `pages/index.tsx`, `store/store.ts` | `ContentView.swift`, `TransitStore.swift`: default M12/M16 favourites, card/list mode, station search, page dots, update age |
| `components/Header.tsx` | 20pt padding, 16pt control gaps, 18pt SF Rounded search, 300ms half-turn refresh |
| `components/FullCard.tsx` | `StationCard.swift`: 36pt corners, 32pt horizontal inset, 36pt top inset, 46pt heavy title, 24pt sticky title after 120pt scroll |
| `components/SmallCard.tsx` | 30pt corners, 24pt horizontal/20pt vertical padding, 24pt heavy title, 0.98 pressed scale |
| `components/RouteIndicator.tsx` | 32/24/20pt badges, 18/16/14pt bold labels, feed colors with 30% white overlay |
| Equipment rows | 26pt corners, minimum 72pt height, 16pt padding, 12pt gaps, 15pt semibold descriptions, 14pt bold pills |
| Arrival rows | 24pt badges, 16pt semibold destinations, 22pt bold minutes, 80pt trailing column; 20pt entry offset staggered by 80ms |
| `components/Search.tsx` | Search results open full-height station overlay; 36pt top corners, drag handle, pull-down dismissal |
| `components/MoreMenu.tsx` | Custom overlay; 32pt action group/24pt cancel corners; 360/24 main spring, 160/18 cancel spring, gradient scrim |
| `components/icons/*` | `PWAIcon.swift`: original SVG path geometry rendered as native vector paths |
| `public/ios/apple-touch-icon.png` | Original app icon resized from 512 to 1024 for the asset catalog |

SF Rounded uses the native rounded system font descriptor; UIKit station headings set explicit paragraph line height to match CSS `line-height: 100%`. The PWA's imported IBM Plex Mono is unused by its global font rule and therefore is not bundled. White/light appearance follows the PWA. Reduced Motion suppresses travel animations.

The carousel uses native page swiping; its gesture deceleration is platform-provided rather than Embla's implementation. The search sheet uses native scrolling and a custom pull-down gesture. These interaction differences require device comparison before calling the app 1:1.

## Data and persistence

The app uses the same four MTA/goodservice endpoints and per-stop arrival endpoint as the PWA. All responded with HTTP 200 during implementation on September 24, 2026, without authentication. The optional `MTA_API_KEY` build setting is available if required by a future deployment; no PWA API key is copied into the native code.

Favourites are stored in UserDefaults. A successfully fetched complete feed snapshot is cached locally. Refresh failures preserve that snapshot with a visible stale-status message; they do not replace outages with an empty success response. The app refreshes when foregrounded after a minute, and the header supports manual refresh. Visible countdowns update every second.

Equipment matching uses exact stop-ID tokens and matching routes. Compact escalator outage counts match equipment IDs (the PWA compares an equipment number with a station name). These fixes avoid incorrect counts. Upcoming outage records retain the PWA's feed semantics.

## Validation status

- All Swift files passed a tree-sitter Swift syntax parse. This is **not** a Swift type check or build.
- Xcode project, plist, asset catalog, and shared scheme parse; source references were checked.
- Live feed schemas were inspected on September 24: 496 stations, 707 pieces of equipment, and 75 outage records at the time of the check. Default favourites resolve to Flushing Av and Marcy Av.
- Five XCTest cases cover exact station/route matching, flexible feed decoding, update-age thresholds, outage date formatting, and cached snapshot round trips. They are authored but **not run**.
- Simulator/device build, XCTest execution, pixel comparison, and interaction QA are **pending**: this Linux workspace has no Xcode or iOS simulator.
- PWA browser capture was blocked by a missing browser binary and a failed browser download. No rendered screenshot comparison is claimed.

Before release, run the commands above and compare card/list/search, healthy/outage/inaccessible stations, long names, scroll past the sticky-header threshold, menu entry/dismissal, rapid swipes, first-load errors, stale refresh, persistence after removing every favourite, and Reduced Motion on 375pt/390pt/430pt iPhones.

The shared scheme and `ci_scripts/ci_post_clone.sh` are checked in for an eventual Xcode Cloud workflow. The script sets the archive build number from `CI_BUILD_NUMBER`. No cloud build or TestFlight release has been triggered.

The local implementation was restored from the conversation on September 25 after the original workspace was reset before its blocked push. Publication and merge were explicitly authorized by the user; native validation remains pending as noted above.

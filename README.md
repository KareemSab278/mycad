# MyCAD

MyCAD is a cross-platform mobile and web app built with Expo, React Native, TypeScript, and Expo Router. It includes a shared UI component library under `src/app/components` and a component showcase screen for developing and checking those components.

## Getting started

Install dependencies and start the Expo development server:

```sh
npm install
npx expo start
```

Run on a specific platform with `npm run ios`, `npm run android`, or `npm run web`. Run the configured lint command with `npm run lint`.

The app configuration is in `app.json`. TypeScript is configured in strict mode; the `@/` alias points to `src/`, and `@/assets/` points to `assets/`.

## Project structure

```text
src/
  app/
    _layout.tsx              App-wide providers and navigation stack
    index.tsx                Expo Router entry; renders the custom Router
    Screens/                 Screen implementations and screen-local styles
    components/              Shared, reusable UI components
    constants/theme.ts       Colors, spacing, fonts, and layout constants
    helpers/                 Shared platform and app helpers
    hooks/                   Color-scheme and theme hooks
  global.css                 Tailwind, Uniwind, and HeroUI Native styles
assets/
  images/                    App icons, illustrations, and tab icons
```

The root layout installs the gesture-handler, HeroUI Native, and Expo Router theme providers. Metro is configured for Uniwind and its generated type declarations are in `src/uniwind-types.d.ts`.

## Routes and getting around

### Quick guide

After signing in and completing setup, **Support** is in the app's main navigation:

- **iOS, Android, and portrait web:** tap the Support (speech-bubble) button in the bottom navigation.
- **Landscape web:** open the menu in the top-left corner and choose **Support**.
- **From Home:** tap **View Details** in the Care section.

### Route map

| Destination | How to open it | Implementation |
| --- | --- | --- |
| Home | Main navigation; also the `/` entry route | `src/app/index.tsx` renders `Router` |
| Machines | Main navigation; or open a machine from Home | `src/screens/Machines/index.tsx`; machine links can pass a `machine_id` |
| Access | Main navigation | `src/screens/Access/index.tsx` |
| Support | Main navigation or Home's Care **View Details** button | `src/screens/Support/index.tsx` |
| Sign in | Shown when signed out; route is `/signIn` | `src/app/signIn.tsx` |
| Setup | Shown when setup is required, or from the account's edit-setup action | `src/screens/Setup/SetupPage.tsx` |

The main navigation is the `routes` list in `src/components/Router/Router.tsx`; it switches screens inside the `/` route, so **Support is an in-app destination, not a `/Support` URL**. Expo Router also has file routes for `/Access`, `/Machines`, and `/ComponentsDemo`, but the usual way to move between the main app screens is the in-app navigation above.

To add or remove a main navigation destination, update the `routes` list in `src/components/Router/Router.tsx`. To add a URL/deep-link route, add the corresponding file under `src/app/` and register it in `src/app/_layout.tsx`.

## Shared UI components

Import shared components from the barrel:

```tsx
import * as C from '@/app/components';
```

| Component | Intended use |
| --- | --- |
| `Container` | Scrollable screen content wrapper; accepts `ScrollView` props, including `contentContainerStyle` |
| `Box` | Titled section with optional description and layout `style` |
| `Charts` | Reusable bar, line, area/graph, horizontal bar, and pie charts |
| `Typography` | Text with shared `caption`, `body`, `title`, and `heading` variants |
| `Buttons` | Primary, secondary, danger, ghost, and disabled actions |
| `LinkButton` | Inline or secondary text action |
| `Card` | Content card, with optional image and press handler |
| `InputField`, `TextField`, `TextArea`, `SearchField` | Labeled, plain, multiline, and search inputs |
| `CheckBox`, `Toggler`, `Slider`, `Selector`, `TagGroup` | Selection and value controls |
| `Tabs` | Switch between related views using a fixed, safe-area-aware bar; allow space above page content for the bar |
| `Calendar` | Date selection |
| `Modal`, `Dialog`, `Menu` | Overlays, confirmations, and action menus |
| `Alert` | Dismissible info, success, warning, or error message; render it directly when needed, without an overlay wrapper |
| `Loader`, `Skeleton` | Loading indicators and content placeholders |
| `Separator` | Visual divider; `sm`, `md`, and `lg` variants |

See `src/app/Screens/ComponentsDemo` for examples of the controls and their current APIs. Use the shared components before creating screen-specific equivalents.

### Charts

Charts accept data and series configuration as props, so they can be reused with different datasets. Web uses Recharts; iOS and Android use SVG rendering.

```tsx
import * as C from '@/app/components';

const sales = [
  { label: 'Jan', sales: 42 },
  { label: 'Feb', sales: 58 },
];

<C.Charts.Bar
  data={sales}
  title="Monthly sales"
  series={[{ key: 'sales', name: 'Sales', color: '#2563EB' }]}
/>
```

Use `Charts.Line`, `Charts.Graph`, `Charts.HorizontalBar`, or `Charts.Pie` for the other chart types. Data points use `label` for their category; series `key` selects the numeric field to render.

## Page and component standards

### Screen organization

1. Put each screen in `src/app/Screens/<ScreenName>/index.tsx`. Keep screen-only styles in a sibling `styles.ts`; put reusable components and shared behavior in `src/app/components` or the shared helpers/hooks folders.
2. Export the screen as a named component and use the existing `Router` route list to expose it in the current app navigation.
3. Build screen content from the shared components. Use `Container` for scrollable content and `Box` to group related content under a heading. Keep layout styles local to the screen and prefer `StyleSheet.create`.
4. Keep screen files focused on composition and screen state. Extract a reusable component when it is useful across screens or makes the screen substantially easier to understand.

### Safe areas and the keyboard

Use one shared `Container` per screen for scrollable content. On iOS and Android it automatically scrolls focused inputs above the keyboard; the router hides its bottom navigation while typing. Do not nest containers or add a separate `KeyboardAvoidingView`, which can cause competing layout changes. The root layout supplies the keyboard provider.

The keyboard controller requires a development build and is not included in Expo Go. Rebuild the native app after installing or updating it.

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import * as C from '@/components';

export const ExampleScreen = () => (
  <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <C.Container>
      <C.Box title="Example">
        {/* Screen content */}
      </C.Box>
    </C.Container>
  </SafeAreaView>
);
```

Screens without keyboard input still need safe-area handling when their content reaches device edges. Use `SafeAreaView` from `react-native-safe-area-context`.

### Interaction and accessibility

- Use React Native `Pressable` for custom tappable surfaces, without ripple or scale animations. Preserve clear selected, checked, and disabled states where applicable.
- Use the semantic shared control for the job (for example, `Buttons` for actions, `LinkButton` for inline navigation, and `Selector` for a list choice) rather than styling a plain `View` to imitate it.
- Give controls clear visible labels, preserve disabled states, and provide accessible labels or hints for icon-only or otherwise unclear actions. Do not communicate status by color alone.
- Keep touch targets usable and ensure forms remain scrollable when the keyboard is open.

### Visual consistency

- Reuse `Typography` variants instead of creating one-off text sizes. Use `Colors`, `Spacing`, `Fonts`, and layout constants from `src/app/constants/theme.ts` where applicable.
- Keep spacing, alignment, and component styling consistent across screens. Use `StyleSheet.create` for screen styles; use the existing Uniwind/HeroUI Native setup where those utilities fit.
- Add new shared UI components under `src/app/components/<ComponentName>/`, keeping implementation and styles together, and export them from `src/app/components/index.ts`.
- Add or update a ComponentsDemo example when introducing or changing a reusable component, so its behavior can be checked in the app.

## App state and integrations

The repository includes helpers for network reachability and storage. The push-token helper file currently contains commented-out implementation, so push notifications should not be treated as an active app feature.

The existing Home and Account screens are placeholders, and Sign in currently presents a form without an authentication submission flow.

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

## Current screens and navigation

The app currently enters through Expo Router's `src/app/index.tsx`, which renders `Router`. `src/app/components/Router/Router.tsx` switches between screens using local React state; it is not currently using one Expo Router file-based route per screen.

- **Home** and **Sign in** are the screens currently listed in the custom navigation.
- **ComponentsDemo** is added to that navigation only when `EXPO_PUBLIC_DEV_MODE=true`.
- **Account** exists as a screen but is not currently connected to navigation.

To add a screen to the current navigation, create it under `src/app/Screens/<ScreenName>/`, then add its import and route entry in `src/app/components/Router/Router.tsx`. If the app later moves to file-based routes, update this guidance and navigation together.

## Shared UI components

Import shared components from the barrel:

```tsx
import * as C from '@/app/components';
```

| Component | Intended use |
| --- | --- |
| `Container` | Scrollable screen content wrapper |
| `Box` | Titled section with optional description |
| `Typography` | Text with shared `caption`, `body`, `title`, and `heading` variants |
| `Buttons` | Primary, secondary, danger, ghost, and disabled actions |
| `LinkButton` | Inline or secondary text action |
| `PressableFeedback` | Ripple and scale feedback for custom tappable surfaces |
| `Card` | Content card, with optional image and press handler |
| `InputField`, `TextField`, `TextArea`, `SearchField` | Labeled, plain, multiline, and search inputs |
| `CheckBox`, `Toggler`, `Slider`, `Selector`, `TagGroup` | Selection and value controls |
| `Tabs` | Switch between related views |
| `Calendar` | Date selection |
| `Modal`, `Dialog`, `Menu` | Overlays, confirmations, and action menus |
| `Alert` | Dismissible info, success, warning, or error message |
| `Loader`, `Skeleton` | Loading indicators and content placeholders |
| `Separator` | Visual divider; `sm`, `md`, and `lg` variants |

See `src/app/Screens/ComponentsDemo` for examples of the controls and their current APIs. Use the shared components before creating screen-specific equivalents.

## Page and component standards

### Screen organization

1. Put each screen in `src/app/Screens/<ScreenName>/index.tsx`. Keep screen-only styles in a sibling `styles.ts`; put reusable components and shared behavior in `src/app/components` or the shared helpers/hooks folders.
2. Export the screen as a named component and use the existing `Router` route list to expose it in the current app navigation.
3. Build screen content from the shared components. Use `Container` for scrollable content and `Box` to group related content under a heading. Keep layout styles local to the screen and prefer `StyleSheet.create`.
4. Keep screen files focused on composition and screen state. Extract a reusable component when it is useful across screens or makes the screen substantially easier to understand.

### Safe areas and the keyboard

Screens with text inputs must wrap the safe-area content in a `KeyboardAvoidingView` (keyboard avoidance outside, `SafeAreaView` inside). Use `padding` on iOS and `height` on Android; web can leave `behavior` undefined. Keep both containers flexed so the screen can resize:

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as C from '@/app/components';

const keyboardAvoidingBehavior =
  Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined;

export const ExampleScreen = () => (
  <KeyboardAvoidingView behavior={keyboardAvoidingBehavior} style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1 }}>
      <C.Container>
        <C.Box title="Example">
          {/* Screen content - EVERYTHING should be in a C.Box component for visual clarity */}
        </C.Box>
      </C.Container>
    </SafeAreaView>
  </KeyboardAvoidingView>
);
```

Screens without keyboard input still need safe-area handling when their content reaches device edges. Use `SafeAreaView` from `react-native-safe-area-context`.

### Interaction and accessibility

- Every tappable element should give immediate visual feedback. Use the feedback built into shared controls; for a custom pressable surface, use `PressableFeedback`, which supplies a ripple and a `0.9` press scale. Set `rippleColor` when a custom color is needed. Avoid wrapping a control that already provides feedback a second time.
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

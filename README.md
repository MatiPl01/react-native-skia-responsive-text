# 🔠 React Native Skia Responsive Text

A library providing a wrapper for the React Native Skia Text component, offering features like user-friendly text alignment, efficient multiline text management, and straightforward text truncation.

<a name="readme-top"></a>

<div align="center">
  <img src="./docs/banner.gif" />
</div>

## Motivation

React Native Skia currently offers a rather limited API for rendering text. There's ongoing development to enhance text support in future releases, but this progress might still take some time until it's officially rolled out (please refer to [this](https://github.com/Shopify/react-native-skia/issues/968) issue for more detail).

This lightweight library comes as a handy solution, providing a more straightforward API for managing text, similar to the React Native text API (a bit limited).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

### Prerequisites

This library uses [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) for text animations. To use the library, you have to install [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) and [react-native-skia](https://shopify.github.io/react-native-skia/) first. Refer to these libraries documentation for installation details.

### Installing the library

To install this library, run one of the following commands in your project's directory:

- installation with `yarn`:

```sh
yarn add react-native-skia-responsive-text
```

- installation with `npm`:

```sh
npm i react-native-skia-responsive-text
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Example

This example is very similar to the `Text` usage example from React Native Skia [docs](https://shopify.github.io/react-native-skia/docs/text/text/#simple-text).

```tsx
import { Canvas, useFont } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';
import ResponsiveText from 'react-native-skia-responsive-text';

export default function UsageExample() {
  const font = useFont(require('../../assets/Poppins-Regular.ttf'), 16);

  if (!font) {
    return null;
  }

  return (
    <Canvas style={styles.fill}>
      <ResponsiveText font={font} text='Hello World!' width={50} />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Properties

The `ResponsiveText` component accepts all the properties available to the `Text`` component from React Native Skia, while also introducing additional features. These include the ability to adjust text alignment, set the number of lines, and the ellipsize mode, among others.

| Name                  | Type                                                                                       | Default          | Required | Description                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------ | ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| font                  | `SkFont`                                                                                   | -                | yes      | Font to use (React Native Skia doesn't require this property but `ResponsiveText` does in order to properly wrap text)                                                               |
| text                  | `string`                                                                                   | -                | yes      | Text to draw                                                                                                                                                                         |
| x                     | `number`                                                                                   | 0                | no       | Left position of the text                                                                                                                                                            |
| y                     | `number`                                                                                   | 0                | no       | Top position the text                                                                                                                                                                |
| width                 | `number`                                                                                   | text line width  | no       | Width of the text component (isn't required but should be specified to properly render text)                                                                                         |
| height                | `number`                                                                                   | text line height | no       | Height of the text component (used only for the vertical alignment. Overflowing text is visible)                                                                                     |
| lineHeight            | `number`                                                                                   | fontSize         | no       | Text line height                                                                                                                                                                     |
| overflow              | `'hidden'` &#124; `'visible'`                                                              | `'visible'`      | no       | React Native `Text` component is cropped to dimensions of the container. The `ResponsiveText` doesn't crop the overflowing content by default. To do this, set overflow to `hidden`. |
| horizontalAlignment   | `'center'` &#124; `'center-left'` &#124; `'center-right'` &#124; `'left'` &#124; `'right'` | `left`           | no       | Text alignment in the X axis                                                                                                                                                         |
| verticalAlignment     | `'bottom'` &#124; `'center'` &#124; `'top'`                                                | `top`            | no       | Text alignment in the Y axis                                                                                                                                                         |
| numberOfLines         | `number`                                                                                   | -                | no       | Maximum number of text lines (the overflowing text will be cropped to occupy at most `numberOfLines` lines)                                                                          |
| ellipsizeMode         | `'clip'` &#124; `'head'` &#124; `'middle'` &#124; `'tail'`                                 | `'tail'`         | no       | Determines how the overflowing text will be truncated                                                                                                                                |
| color                 | `string`                                                                                   | `#000000`        | no       | The color of the text                                                                                                                                                                |
| backgroundColor       | `string`                                                                                   | -                | no       | The color of the text background                                                                                                                                                     |
| animationSettings     | `AnimationSettings`\*                                                                      | -                | no       | Text lines transition animation settings (on alignment, lineHeight, text height changes)                                                                                             |
| animationProgress\*\* | `SharedValue<number>`                                                                      | -                | no       | Custom animation progress (can be used instead of animationSettings)                                                                                                                 |

\*`AnimationSettings` type contains the following properties:

```tsx
type AnimationSettings = {
  duration?: number;
  easing?: AnimationEasing;
  onComplete?: (finished?: boolean) => void;
};
```

\*\*animationProgress allows animating text based on custom progress value (e.g. when the user scrolls some content, opens the bottom sheet, etc.). It makes it easy to animate text in sync with another animation.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Animated properties

`ResponsiveText` accepts reanimated [shared values](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#shared-value) for some of its properties. This makes it possible to update these values without having to re-render the component or create smooth animations of these properties.

The following properties can be passed as `SharedValues`:

- `x`,
- `y`,
- `color`,
- `backgroundColor`,
- `lineHeight`,
- `horizontalAlignment`,
- `verticalAlignment`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Animations

### Timing-based animations

Animations based on settings specified in the `animationSettings` property. By default, the `ResponsiveText` component is not animated. That means, every change of any property will be reflected without transition.

When `animationSettings` are specified, every change of `ResponsiveText` properties resulting in text lines position change (i.e. alignment, line height, text component height change) will be animated.

#### Example

https://github.com/MatiPl01/react-native-skia-responsive-text/assets/52978053/f6a1cffa-18ae-4ff1-9d27-4291f67dbbd0

\* This recording was made in the demo app (see the [Demo app](#demo-app) section for more details)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Progress based animations

Progress based animations are the alternative way to animate text. Instead of passing `animationSettings` property, you have to pass the `animationProgress` which is a reanimated shared value indicating the current transition progress.

Every progress transition starts from the current text position and animates text lines to the new target position (updated alignment).

#### How to properly create progress-based animations?

To create smooth text animations, you have to follow these rules:

1. Use reanimated shared values as `horizontalAlignment` and `verticalAlignment` instead of plain numbers (to ensure that there is no delay in updating alignment settings),
2. Update `horizontalAlignment` and `verticalAlignment` before updating the `animationProgress` (the animation to new alignment values will start when the `animationProgress` is modified),
3. Ensure that the `animationProgress` value is set to `0` before you start updating the progress (to start the animation from the current text position).

#### Example

https://github.com/MatiPl01/react-native-skia-responsive-text/assets/52978053/cde6401c-98a7-49b1-8e11-4e6457a8b80a

\* This recording was made in the demo app (see the [Demo app](#demo-app) section for more details)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Demo app

This repository contains an interactive demo application to demonstrate how the `ResponsiveText` component works. It shows similarities and differences between the React Native `Text` component implementation and the `ResponsiveText` from this library.

All animations settings are applied only to the `ResponsiveText`, because the React native `Text` is not animated.

### Running the app

To run the example app, you need to clone the repository and install dependencies.

```sh
git clone react-native-skia-responsive-text
cd react-native-skia-responsive-text
yarn
```

You can start the example app using the following command.

```sh
yarn example start
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

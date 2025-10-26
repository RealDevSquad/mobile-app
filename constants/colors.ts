// DEPRECATED: This file is deprecated. Use theme from @/constants/theme instead.
// This file is kept for backward compatibility only.

import { theme } from "./theme";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";
const primaryColor = theme.colors.primary[500]; // Use theme primary color (#7E3AF2)

export default {
  primary: primaryColor,

  light: {
    text: theme.colors.text.primary,
    background: theme.colors.background.primary,
    tint: tintColorLight,
    tabIconDefault: theme.colors.text.secondary,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: theme.colors.text.inverted,
    background: theme.colors.gray[900],
    tint: tintColorDark,
    tabIconDefault: theme.colors.text.secondary,
    tabIconSelected: tintColorDark,
  },
};

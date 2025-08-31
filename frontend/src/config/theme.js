import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// 1. Define the initial color mode configuration
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// 2. Define global styles
const styles = {
  global: (props) => ({
    body: {
      bg: mode("gray.100", "gray.800")(props),
      color: mode("gray.800", "whiteAlpha.900")(props),
    },
  }),
};

// 3. Define custom colors
const colors = {
  brand: {
    50: "#e6fffa",
    100: "#b2f5ea",
    200: "#81e6d9",
    300: "#4fd1c5",
    400: "#38b2ac", // Main Teal Color
    500: "#319795",
    600: "#2c7a7b",
    700: "#285e61",
    800: "#234e52",
    900: "#1d4044",
  },
};

// 4. Define custom component styles (optional, but good practice)
const components = {
  Button: {
    baseStyle: {
      fontWeight: "bold",
    },
    variants: {
      solid: (props) => ({
        bg: mode("brand.400", "brand.300")(props),
        color: mode("white", "gray.800")(props),
        _hover: {
          bg: mode("brand.500", "brand.400")(props),
        },
      }),
    },
  },
  Link: {
      baseStyle: props => ({
          color: mode('brand.500', 'brand.200')(props),
      }),
  },
};

// 5. Export the complete theme object
const theme = extendTheme({
  config,
  styles,
  colors,
  components,
});

export default theme;

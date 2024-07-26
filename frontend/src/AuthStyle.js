import React from "react";
import {
  Authenticator,
  ThemeProvider,
  Theme,
  useTheme,
  View,
} from "@aws-amplify/ui-react";

export function AuthStyle({ children }) {
  const { tokens } = useTheme();
  const theme = {
    name: "Auth Custom Theme",
    tokens: {
      components: {
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay["10"]}`,
            borderWidth: "0",
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: "#113584", // Primary brand color
            _hover: {
              backgroundColor: "#ff5065", // Secondary color on hover
            },
          },
          link: {
            color: "#113584", // Primary brand color
            _hover: {
              color: "#ff5065", // Secondary color on hover
            },
          },
        },
        fieldcontrol: {
          _focus: {
            boxShadow: `0 0 0 2px #ff5065`, // Secondary color for active form inputs
          },
        },
        tabs: {
          item: {
            color: tokens.colors.neutral["80"],
            _active: {
              borderColor: tokens.colors.neutral["100"],
              color: "#113584", // Primary brand color
            },
            _hover: {
              color: "#ff5065", // Secondary color on hover
            },
          },
        },
      },
    },
  };

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

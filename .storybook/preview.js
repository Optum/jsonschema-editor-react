import { addDecorator } from "@storybook/react";
import * as React from "react";
import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import '@storybook/addon-console';


const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <CSSReset />
      {children}
    </ThemeProvider>
  );
};

addDecorator(storyFn => <AppProvider>{storyFn()}</AppProvider>);

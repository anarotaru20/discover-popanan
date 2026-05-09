import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { createVuetify } from "vuetify";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          background: "#0F0F0F",
          surface: "#181818",
          primary: "#FF8A00",
          secondary: "#F5F5F5",
        },
      },
    },
  },
});

export default vuetify;
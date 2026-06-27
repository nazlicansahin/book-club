import type { CapacitorConfig } from "@capacitor/cli";

const productionUrl = "https://book-club-wheat-seven.vercel.app";

const config: CapacitorConfig = {
  appId: "com.questlog.bookclub",
  appName: "Quest Log",
  webDir: "www",
  server: {
    url: process.env.CAPACITOR_SERVER_URL ?? productionUrl,
    cleartext: false,
    allowNavigation: [productionUrl, "accounts.google.com", "*.google.com", "*.firebaseapp.com"],
  },
  ios: {
    contentInset: "never",
    backgroundColor: "#08122b",
  },
  android: {
    backgroundColor: "#08122b",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#08122b",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#08122b",
    },
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
    },
  },
};

export default config;

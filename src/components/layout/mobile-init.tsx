"use client";

import { useEffect } from "react";

export function MobileInit() {
  useEffect(() => {
    void initNativeShell();
  }, []);

  return null;
}

async function initNativeShell() {
  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform()) return;

  const { StatusBar, Style } = await import("@capacitor/status-bar");
  const { SplashScreen } = await import("@capacitor/splash-screen");
  const { App } = await import("@capacitor/app");

  await StatusBar.setStyle({ style: Style.Dark });
  if (Capacitor.getPlatform() === "android") {
    await StatusBar.setBackgroundColor({ color: "#08122b" });
  }
  await SplashScreen.hide();

  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      void App.exitApp();
    }
  });
}

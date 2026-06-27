#!/usr/bin/env node
/**
 * Cap sync re-adds CapacitorFirebaseAuthentication (Lite) to Podfile.
 * Google sign-in requires the /Google subspec instead.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const podfilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../ios/App/Podfile"
);

let content = readFileSync(podfilePath, "utf8");

// Remove Lite pod from capacitor_pods block
content = content.replace(
  /^\s*pod 'CapacitorFirebaseAuthentication', :path => '\.\.\/\.\.\/node_modules\/@capacitor-firebase\/authentication'\n/m,
  ""
);

const googlePod =
  "  pod 'CapacitorFirebaseAuthentication/Google', :path => '../../node_modules/@capacitor-firebase/authentication'";

if (!content.includes("CapacitorFirebaseAuthentication/Google")) {
  content = content.replace(
    /target 'App' do\n  capacitor_pods\n/,
    `target 'App' do\n  capacitor_pods\n${googlePod}\n`
  );
}

writeFileSync(podfilePath, content);
console.log("Podfile patched for Google Sign-In");

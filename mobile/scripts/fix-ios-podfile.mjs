#!/usr/bin/env node
/**
 * Ensure Podfile uses base CapacitorFirebaseAuthentication pod + GoogleSignIn
 * (subspec-only installs create an empty aggregate target on iOS).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const podfilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../ios/App/Podfile"
);

const expectedAuthLine =
  "pod 'CapacitorFirebaseAuthentication', :path => '../../node_modules/@capacitor-firebase/authentication'";

let content = readFileSync(podfilePath, "utf8");

content = content.replace(
  /pod 'CapacitorFirebaseAuthentication[^']*',[^\n]+\n/g,
  ""
);

if (!content.includes(expectedAuthLine)) {
  content = content.replace(
    /(pod 'CapacitorStatusBar'[^\n]+\n)/,
    `$1  ${expectedAuthLine}\n`
  );
}

writeFileSync(podfilePath, content);
console.log("Podfile patched for CapacitorFirebaseAuthentication + GoogleSignIn");

#!/usr/bin/env node
/**
 * CapacitorFirebaseAuthentication uses static_framework which causes CocoaPods
 * to create an empty aggregate target — the plugin never registers on iOS.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const podspecPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../node_modules/@capacitor-firebase/authentication/CapacitorFirebaseAuthentication.podspec"
);

let content = readFileSync(podspecPath, "utf8");
let patched = content.replace("  s.static_framework = true\n", "");

if (!patched.includes("s.dependency 'GoogleSignIn'")) {
  const needle = "  s.dependency 'FirebaseAuth', '~> 11.7.0'\n";
  const replacement =
    needle + "  s.dependency 'GoogleSignIn', '7.1.0'\n";
  writeFileSync(
    podspecPath,
    patched.replace(needle, replacement)
  );
  console.log("Patched podspec: removed static_framework, added GoogleSignIn dependency");
} else {
  writeFileSync(podspecPath, patched);
  console.log("Patched podspec: removed static_framework");
}

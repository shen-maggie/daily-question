import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_ANON_KEY before running this script.");
  process.exit(1);
}

const output = `window.SIDEQUEST_CONFIG = ${JSON.stringify({
  supabaseUrl: url,
  supabaseAnonKey: key,
  displayName: "You",
}, null, 2)};\n`;

fs.writeFileSync(path.resolve("dist/config.js"), output, "utf8");
console.log("Configured dist/config.js for Supabase.");


import { readFileSync, writeFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const dir = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(dir, "../..");

const template = readFileSync(resolve(dir, "template.html"), "utf8");
const css = readFileSync(resolve(dir, "styles.css"), "utf8");
const cssGz = gzipSync(css, { level: 9 }).length;

const fontFiles = [
  "fonts/bodoni-moda-500.woff2",
  "fonts/jost-400.woff2",
  "fonts/jost-500.woff2",
];
const imgFiles = ["img/portrait.avif", "img/pigeon.avif", "img/site.avif", "img/bshirre.avif"];

const size = (files) => files.reduce((sum, f) => sum + statSync(resolve(dir, f)).size, 0);
const fontTotal = size(fontFiles);
const fontCritical =
  statSync(resolve(dir, "fonts/bodoni-moda-500.woff2")).size +
  statSync(resolve(dir, "fonts/jost-400.woff2")).size;
const imgTotal = size(imgFiles);

const kb = (bytes) => (bytes / 1024).toFixed(1);

let commit = "unknown";
try {
  commit = execSync("git rev-parse --short HEAD", { cwd: root, encoding: "utf8" }).trim();
} catch {}

const buildDate = new Date().toISOString().slice(0, 10);

const profiles = {
  "2g": { kbps: 250, rtt: 600 },
  "3g": { kbps: 1600, rtt: 150 },
  "4g": { kbps: 9000, rtt: 85 },
  wifi: { kbps: 30000, rtt: 20 },
};

const estimate = (criticalBytes, profile) =>
  (((3 * profile.rtt + (criticalBytes * 8) / profile.kbps) / 1000) * 1.5).toFixed(1);

const fill = (html, values) => {
  let out = html;
  for (const [key, value] of Object.entries(values)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
};

const baseValues = {
  COMMIT: commit,
  BUILD_DATE: buildDate,
  CSS_GZ: kb(cssGz),
  FONT_CRIT_KB: kb(fontCritical),
  FONT_KB: kb(fontTotal),
  IMG_KB: kb(imgTotal),
  T_2G: "0.0",
  T_3G: "0.0",
  T_4G: "0.0",
  T_WIFI: "0.0",
  HTML_GZ: "0.0",
  CRITICAL_KB: "0.0",
  TOTAL_KB: "0.0",
};

let html = fill(template, baseValues);
let htmlGz = gzipSync(html, { level: 9 }).length;
let critical = htmlGz + cssGz + fontCritical;

for (let i = 0; i < 4; i += 1) {
  const values = {
    ...baseValues,
    HTML_GZ: kb(htmlGz),
    CRITICAL_KB: kb(critical),
    TOTAL_KB: kb(htmlGz + cssGz + fontTotal + imgTotal),
    T_2G: estimate(critical, profiles["2g"]),
    T_3G: estimate(critical, profiles["3g"]),
    T_4G: estimate(critical, profiles["4g"]),
    T_WIFI: estimate(critical, profiles.wifi),
  };
  const next = fill(template, values);
  const nextGz = gzipSync(next, { level: 9 }).length;
  html = next;
  if (nextGz === htmlGz) break;
  htmlGz = nextGz;
  critical = htmlGz + cssGz + fontCritical;
}

writeFileSync(resolve(dir, "index.html"), html);

console.log({
  htmlGz: kb(htmlGz) + " KB",
  cssGz: kb(cssGz) + " KB",
  fontCritical: kb(fontCritical) + " KB",
  fontTotal: kb(fontTotal) + " KB",
  images: kb(imgTotal) + " KB",
  total: kb(htmlGz + cssGz + fontTotal + imgTotal) + " KB",
  critical: kb(critical) + " KB",
  commit,
});

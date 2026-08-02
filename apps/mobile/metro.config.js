const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];
// bun installs packages into a non-hoisted layout under <root>/node_modules/.bun
// with nested node_modules per package group. Resolve through the real paths so
// Metro can find transitive dependencies (e.g. regenerator-runtime, whatwg-fetch)
// that are nested inside those cache directories instead of hoisted to the root.
config.resolver.unstable_enableSymlinks = true;
config.resolver.disableHierarchicalLookup = false;

module.exports = withNativeWind(config, { input: "./styles/global.css" });

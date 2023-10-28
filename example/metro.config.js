const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const rootDir = path.resolve(__dirname, '..');
const rootPkg = require(path.join(rootDir, 'package.json'));

const modules = [
  '@babel/runtime',
  ...Object.keys({
    ...rootPkg.dependencies,
    ...rootPkg.peerDependencies
  })
];

const externalNodeModules = modules.reduce((acc, name) => {
  acc[name] = path.join(__dirname, 'node_modules', name);
  return acc;
}, {});

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,

  projectRoot: __dirname,
  watchFolders: [rootDir],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we blacklist them at the root, and alias them to the versions in example's node_modules
  resolver: {
    ...defaultConfig.resolver,

    blacklistRE: exclusionList(
      modules.map(
        m =>
          new RegExp(`^${escape(path.join(rootDir, 'node_modules', m))}\\/.*$`)
      )
    ),

    extraNodeModules: {
      ...externalNodeModules
    }
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  }
};

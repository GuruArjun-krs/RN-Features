const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    assetExts: [...getDefaultConfig(__dirname).resolver.assetExts, 'geojson'],
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'geojson'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

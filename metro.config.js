const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Optimizaciones para reducir tiempo de build
config.transformer = {
  ...config.transformer,
  minifierPath: 'metro-minify-terser',
  minifierConfig: {
    compress: {
      drop_console: false, // Mantener console.log en desarrollo
    },
  },
};

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'css'],
};
 
module.exports = withNativeWind(config, { input: './global.css' });
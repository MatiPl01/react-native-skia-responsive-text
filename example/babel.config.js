module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ts', '.tsx', '.svg', '.json'],
          alias: {
            // This needs to be mirrored in tsconfig.json
            '@': './src',
            'react-native-skia-responsive-text': '../src'
          }
        }
      ]
    ]
  };
};

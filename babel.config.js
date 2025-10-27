module.exports = function (api) {
  api.cache(true); // Cache the config for speed
  return {
    presets: ['babel-preset-expo'], // Use Expo's preset config for React Native
  };
};

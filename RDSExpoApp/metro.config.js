const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.blacklistRE = /mobile-app\/.*/; // Prevent bundling the CLI app

module.exports = config;

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to disable APK splits in Android build.gradle
 * This ensures only single-architecture APKs are built based on ABI filters
 */
const withDisableApkSplits = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const buildGradlePath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'build.gradle'
      );

      // Only modify if the file exists (after prebuild)
      if (!fs.existsSync(buildGradlePath)) {
        console.warn(
          '⚠️  build.gradle not found, skipping APK splits disable. Run prebuild first.'
        );
        return config;
      }

      let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

      // Check if android block exists
      if (!buildGradleContent.includes('android {')) {
        console.warn('⚠️  No android block found in build.gradle');
        return config;
      }

      // Pattern to match splits block (may span multiple lines)
      const splitsPattern = /splits\s*\{[^}]*\}/s;

      const splitsConfig = `
    splits {
        abi {
            enable false
        }
    }`;

      if (splitsPattern.test(buildGradleContent)) {
        // Replace existing splits block
        buildGradleContent = buildGradleContent.replace(
          splitsPattern,
          splitsConfig.trim()
        );
        console.log('✅ Modified existing splits block in build.gradle');
      } else {
        // Add splits block after android {
        buildGradleContent = buildGradleContent.replace(
          /(android\s*\{)/,
          `$1${splitsConfig}`
        );
        console.log(
          '✅ Added splits block to disable ABI splits in build.gradle'
        );
      }

      // Set ndk.abiFilters in defaultConfig to prevent building native libs for other ABIs
      const defaultConfigPattern = /(defaultConfig\s*\{)/;
      if (defaultConfigPattern.test(buildGradleContent)) {
        // Check if ndk block already exists in defaultConfig
        const ndkInDefaultConfig = /defaultConfig\s*\{[^}]*ndk/s.test(
          buildGradleContent
        );
        if (!ndkInDefaultConfig) {
          buildGradleContent = buildGradleContent.replace(
            defaultConfigPattern,
            `$1\n        ndk {\n            abiFilters 'arm64-v8a'\n        }`
          );
          console.log('✅ Added ndk abiFilters to defaultConfig');
        } else {
          // Replace existing ndk block
          buildGradleContent = buildGradleContent.replace(
            /(defaultConfig\s*\{[^}]*?)ndk\s*\{[^}]*\}/s,
            `$1ndk {\n            abiFilters 'arm64-v8a'\n        }`
          );
          console.log('✅ Updated existing ndk abiFilters in defaultConfig');
        }
      }

      // For newer AGP versions, use pickFirst instead of abiFilters in packaging
      // The ndk.abiFilters in defaultConfig should be sufficient to filter native libs
      // Packaging block is mainly for excluding duplicates, not filtering ABIs

      fs.writeFileSync(buildGradlePath, buildGradleContent);
      return config;
    },
  ]);
};

module.exports = withDisableApkSplits;

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withAndroidAssets(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const assetsDir = path.join(config.modRequest.platformProjectRoot, 'app/src/main/assets');
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      
      const fileContent = 'DDS2J7FKGIIV6AAAAAAAAAAAAA';
      const targetFilePath = path.join(assetsDir, 'adi-registration.properties');
      
      fs.writeFileSync(targetFilePath, fileContent);
      console.log(`[Config Plugin] Successfully injected adi-registration.properties into native Android assets.`);
      
      return config;
    },
  ]);
};

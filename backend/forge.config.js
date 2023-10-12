const path = require('path');
/** @type {import('@electron-forge/maker-squirrel').MakerSquirrelConfig} */
const makerSquirrelConfig = {
  title: "Leitor de notas de corretagem",
  name: "leitor-de-notas-de-corretagem",
  authors: "Planet's Lightning Arrester",
  description: "Parse Brazilian PDF brokerage notes",
  setupExe: "LeitorInstall.exe",
  setupMsi: "LeitorInstall.msi",
  setupIcon: path.join(__dirname, 'src', 'images', 'icon-setup.ico'),
  loadingGif: path.join(__dirname, 'src', 'images', 'icon-setup.gif'),
};
/** @type {import('@electron-forge/shared-types').ForgeConfig} */
module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'src', 'images', 'icon'),
    executableName: 'leitor',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: makerSquirrelConfig,
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};

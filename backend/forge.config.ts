import path from 'path';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDeb } from '@electron-forge/maker-deb';
import { type ForgeConfig } from '@electron-forge/shared-types';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { MakerSquirrel, type MakerSquirrelConfig } from '@electron-forge/maker-squirrel';
import { ElectronegativityPlugin, type ElectronegativityConfig } from '@electron-forge/plugin-electronegativity';

const electronNgConfig: ElectronegativityConfig = {
  parserPlugins: [],
  isSarif: true
};

const makerSquirrelConfig: MakerSquirrelConfig = {
  title: "Leitor de notas de corretagem",
  name: "leitor-de-notas-de-corretagem",
  authors: "Planet's Lightning Arrester",
  description: "Parse Brazilian PDF brokerage notes",
  setupExe: "LeitorInstall.exe",
  setupMsi: "LeitorInstall.msi",
  setupIcon: path.join(__dirname, 'src', 'images', 'icon-setup.ico'),
  loadingGif: path.join(__dirname, 'src', 'images', 'icon-setup.gif'),
  iconUrl: 'https://raw.githubusercontent.com/planetsLightningArrester/leitor-de-notas-de-corretagem/electron/backend/src/images/icon-setup.ico',
};

const config: ForgeConfig = {
  packagerConfig: {
    name: "Leitor de notas de corretagem",
    asar: true,
    icon: path.join(__dirname, 'src', 'images', 'icon'),
    executableName: 'leitor',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel(makerSquirrelConfig),
    new MakerZIP({}),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new ElectronegativityPlugin(electronNgConfig),
  ],
};

export default config;
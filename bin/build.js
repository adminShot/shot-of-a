import { log } from 'console';
import * as esbuild from 'esbuild';
import { rmSync } from 'fs';
import { networkInterfaces } from 'os';

// Функция для получения первого внешнего IPv4 адреса
const getLocalIP = () => {
  const interfaces = networkInterfaces();

  for (const interfaceName of Object.keys(interfaces)) {
    const addresses = interfaces[interfaceName];
    for (const addressInfo of addresses) {
      if (addressInfo.family === 'IPv4' && !addressInfo.internal && interfaceName !== 'lo') {
        return addressInfo.address;
      }
    }
  }

  return 'localhost'; // fallback
};

// Config output
const BUILD_DIRECTORY = 'dist/assets';
const PRODUCTION = process.env.NODE_ENV === 'production';

// Config entrypoint files
const ENTRY_POINTS = ['src/index.ts'];

// Config dev serving
const LIVE_RELOAD = !PRODUCTION;
const SERVE_PORT = 3000;
const LOCAL_IP = getLocalIP(); // Определяем IP здесь
const SERVE_ORIGIN = `http://${LOCAL_IP}:${SERVE_PORT}`;

// Create context
const baseConfig = {
  entryPoints: ENTRY_POINTS,
  outdir: BUILD_DIRECTORY,
  bundle: true,
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: PRODUCTION ? 'es2020' : 'esnext',
  define: {
    SERVE_ORIGIN: JSON.stringify(SERVE_ORIGIN),
  },
};

const prodConfig = {
  entryNames: '[name]-[hash]',
  chunkNames: '[name]-[hash]',
  assetNames: '[name]-[hash]',
};

rmSync('dist', { recursive: true, force: true });

const context = await esbuild.context({
  ...baseConfig,
  ...(PRODUCTION ? prodConfig : {}),
  metafile: true,
  inject: LIVE_RELOAD ? ['./bin/live-reload.js'] : undefined,
});

// Build files in prod
if (PRODUCTION) {
  const result = await context.rebuild();
  const mainFile = Object.keys(result.metafile.outputs).find(
    (file) => file.endsWith('.js') && !file.endsWith('.map')
  );
  log(mainFile);
  context.dispose();
}

// Watch and serve files in dev
else {
  await context.watch();
  await context
    .serve({
      servedir: process.cwd(),
      port: SERVE_PORT,
      host: '0.0.0.0', // Сервер слушает все интерфейсы
    })
    .then(logServedFiles);
}

function logServedFiles() {
  console.log('\n\x1b[36m%s\x1b[0m', 'Available URLs:');
  console.log(`Local:    \x1b[32m${SERVE_ORIGIN}\x1b[0m`);
  console.log(`Network:  \x1b[32mhttp://${LOCAL_IP}:${SERVE_PORT}\x1b[0m\n`);
}

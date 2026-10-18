const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const distDirectory = path.join(projectRoot, 'dist');

fs.mkdirSync(distDirectory, { recursive: true });

const unixLauncher = '#!/usr/bin/env sh\nnode "$(dirname "$0")/../src/index.js"\n';
const windowsLauncher = '@echo off\r\nnode "%~dp0..\\src\\index.js"\r\n';

fs.writeFileSync(path.join(distDirectory, 'hello'), unixLauncher);
fs.writeFileSync(path.join(distDirectory, 'hello.cmd'), windowsLauncher);

if (process.platform !== 'win32') {
  fs.chmodSync(path.join(distDirectory, 'hello'), 0o755);
}

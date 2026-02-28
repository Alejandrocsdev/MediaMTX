const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const rtsp = () => {
  const root = process.cwd();

  const mediamtxPath = path.join(root, 'temp', 'mediamtx');
  const configPath = path.join(root, 'rtsp.yml');

  // --- Validate files ---

  if (!fs.existsSync(mediamtxPath)) {
    throw new Error('❌ MediaMTX binary not found at ./temp/mediamtx');
  }

  if (!fs.existsSync(configPath)) {
    throw new Error('❌ rtsp.yml not found — run "config" first');
  }

  console.log('Starting MediaMTX...\n');

  const proc = spawn(mediamtxPath, [configPath], {
    stdio: 'inherit'
  });

  proc.on('error', (error) => {
    console.error('❌ Failed to start MediaMTX:', error.message);
  });

  proc.on('exit', (code) => {
    console.log(`MediaMTX exited with code ${code}`);
  });
};

module.exports = rtsp;
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const webcam = () => {
  const root = process.cwd();
  const configPath = path.join(root, 'config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error('❌ config.json not found');
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const devices = fs
    .readdirSync('/dev')
    .filter((device) => device.startsWith('video'))
    .map((device) => `/dev/${device}`);

  const webcams = [];

  devices.forEach((device) => {
    try {
      const output = execSync(`v4l2-ctl --device=${device} --list-formats`, {
        encoding: 'utf8',
      });

      if (output.includes('MJPG') || output.includes('YUYV')) {
        webcams.push({
          name: `webcam${webcams.length + 1}`,
          device,
          format: output.includes('MJPG') ? 'mjpeg' : 'yuyv',
        });
      }
    } catch {
      // ignore invalid devices
    }
  });

  config.webcam = webcams;

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log(`✅ ${webcams.length} webcam(s) detected\n`);

  webcams.forEach((cam) => {
    console.log(`🔵 ${cam.name}`);
    console.log(`   device: ${cam.device}`);
    console.log(`   format: ${cam.format}\n`);
  });
};

module.exports = webcam;

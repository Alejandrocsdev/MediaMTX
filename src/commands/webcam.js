const fs = require('fs');
const { execSync } = require('child_process');

const getFormats = (output) => {
  const formats = [];

  const lines = output.split('\n');

  for (const line of lines) {
    const start = line.indexOf("'");
    const end = line.indexOf("'", start + 1);

    if (start !== -1 && end !== -1) {
      const format = line.slice(start + 1, end);
      formats.push(format);
    }
  }

  return formats;
};

const mapFormat = (format) => {
  const formatMap = {
    YUYV: 'yuyv422',
    MJPG: 'mjpeg',
    UYVY: 'uyvy422',
    H264: 'h264',
    NV12: 'nv12',
  };

  return formatMap[format] || format.toLowerCase();
};

const webcam = () => {
  const devices = fs
    .readdirSync('/dev')
    .filter((device) => device.startsWith('video'))
    .map((device) => `/dev/${device}`);

  const webcams = [];

  devices.forEach((device) => {
    try {
      const formatsOutput = execSync(
        `v4l2-ctl --device=${device} --list-formats`,
        { encoding: 'utf8' },
      );

      const formats = getFormats(formatsOutput);

      if (!formats.length) return;

      const nameOutput = execSync(`v4l2-ctl --device=${device} --info`, {
        encoding: 'utf8',
      });

      const modelLine = nameOutput
        .split('\n')
        .find((line) => line.toLowerCase().includes('model'));

      const model = modelLine
        ? modelLine.substring(modelLine.indexOf(':') + 1).trim()
        : 'Unknown Webcam';

      webcams.push({
        name: `webcam${webcams.length + 1}`,
        device,
        model,
        formats,
        format: mapFormat(formats[0]),
      });
    } catch (error) {
      // console.log(`Skipping ${device}: ${error.message}`);
    }
  });

  return webcams;
};

module.exports = webcam;

const fs = require('fs');
const path = require('path');

const { removeEmpty } = require('../utils');

const config = () => {
  const root = process.cwd();

  const configPath = path.join(root, 'config.json');
  const templateDir = path.join(root, 'src', 'template');

  const videosDir = path.join(root, 'videos');
  removeEmpty(videosDir);

  const outputFile = path.join(root, 'rtsp.yml');

  // --- Validate files ---

  if (!fs.existsSync(configPath)) {
    throw new Error('❌ config.json not found');
  }

  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
    console.log('videos folder created');
  }

  const mainTemplate = fs.readFileSync(
    path.join(templateDir, 'main.txt'),
    'utf8',
  );

  const pathTemplate = fs.readFileSync(
    path.join(templateDir, 'paths.txt'),
    'utf8',
  );

  const webcamTemplate = fs.readFileSync(
    path.join(templateDir, 'webcamPaths.txt'),
    'utf8',
  );

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // --- Scan videos ---

  const videos = fs.readdirSync(videosDir).filter((file) => {
    const fullPath = path.join(videosDir, file);
    const isFile = fs.statSync(fullPath).isFile();
    const isMp4 = file.toLowerCase().endsWith('.mp4');
    return isFile && isMp4;
  });

  if (videos.length === 0) {
    throw new Error('❌ No MP4 files found in videos folder');
  }

  // --- Build paths section ---

  let pathsBlock = '';

  // --- Video streams ---
  videos.forEach((file, index) => {
    const streamName = `cam${index + 1}`;
    const videoPath = path.join(videosDir, file);

    let block = pathTemplate
      .replaceAll('{{RTSP_PATH}}', streamName)
      .replaceAll('{{VIDEO_PATH}}', videoPath)
      .replaceAll('{{RTSP_HOST}}', config.rtspHost)
      .replaceAll('{{RTSP_PORT}}', config.rtspPort);

    pathsBlock += block + '\n';
  });

  // --- Webcam streams ---
  if (Array.isArray(config.webcam)) {
    config.webcam.forEach((cam) => {
      let block = webcamTemplate
        .replaceAll('{{RTSP_PATH}}', cam.name)
        .replaceAll('{{WEBCAM}}', cam.device)
        .replaceAll('{{RTSP_HOST}}', config.rtspHost)
        .replaceAll('{{RTSP_PORT}}', config.rtspPort);

      pathsBlock += block + '\n';
    });
  }

  // --- Build final YAML ---

  const output = mainTemplate
    .replace('{{RTSP_PORT}}', config.rtspPort)
    .replace('{{RTSP_PATHS}}', pathsBlock);

  fs.writeFileSync(outputFile, output);

  const webcamCount = Array.isArray(config.webcam) ? config.webcam.length : 0;
  const totalStreams = videos.length + webcamCount;

  console.log(`✅ rtsp.yml generated with ${totalStreams} stream(s)\n`);

  // --- Print video streams ---
  videos.forEach((file, index) => {
    const videoName = path.parse(file).name;
    const rtspUrl = `rtsp://${config.rtspHost}:${config.rtspPort}/cam${index + 1}`;

    console.log(`${videoName}:`);
    console.log(`${rtspUrl}\n`);
  });

  // --- Print webcam streams ---
  if (webcamCount > 0) {
    config.webcam.forEach((cam) => {
      const rtspUrl = `rtsp://${config.rtspHost}:${config.rtspPort}/${cam.name}`;

      console.log(`${cam.name}:`);
      console.log(`${rtspUrl}\n`);
    });
  }
};

module.exports = config;

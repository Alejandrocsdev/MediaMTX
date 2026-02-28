const fs = require('fs');
const path = require('path');

const config = () => {
  const root = process.cwd();

  const configPath = path.join(root, 'config.json');
  const templateDir = path.join(root, 'src', 'template');
  const videosDir = path.join(root, 'videos');
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

  // --- Build final YAML ---

  const output = mainTemplate
    .replace('{{RTSP_PORT}}', config.rtspPort)
    .replace('{{RTSP_PATHS}}', pathsBlock);

  fs.writeFileSync(outputFile, output);

  console.log(`✅ rtsp.yml generated with ${videos.length} stream(s)`);

  videos.forEach((_, index) => {
    const rtspUrl = `rtsp://${config.rtspHost}:${config.rtspPort}/cam${index + 1}`;
    console.log(`🔵 ${rtspUrl}`);
  });
};

module.exports = config;

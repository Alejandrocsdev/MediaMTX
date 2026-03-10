const help = require('./help');
const rtsp = require('./rtsp');
const config = require('./config');
const webcam = require('./webcam');

const commands = async (argv) => {
  const args = argv.slice(2);

  const command = args[0];

  if (!command) {
    throw new Error('❌ Missing command, use "config" or "rtsp"');
  }

  if (args.length > 1) {
    throw new Error('❌ Too many arguments');
  }

  switch (command) {
    case 'help':
      return help();
    case 'rtsp':
      return rtsp();
    case 'config':
      return config();
    case 'webcam':
      return webcam();
  }

  throw new Error(`❌ Unknown or malformed command: "${command}"`);
};

module.exports = commands;

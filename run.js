const { mediaMTX } = require('./src/mediaMTX');
const { safeRun } = require('./src/utils');

safeRun(() => mediaMTX(process.argv));

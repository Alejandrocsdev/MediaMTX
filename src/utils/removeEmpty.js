const fs = require('fs');
const path = require('path');

const removeEmpty = (dir) => {
  const file = path.join(dir, 'empty.txt');
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
};

module.exports = removeEmpty;

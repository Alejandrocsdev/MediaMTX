const fs = require('fs');
const path = require('path');

const help = () => {
  const file = path.join(__dirname, 'help.txt');
  const content = fs.readFileSync(file, 'utf8');
  console.log(content);
};

module.exports = help;

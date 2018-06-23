
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const fse = require('fs-extra');

module.exports = function (opts) {
  const dirPath = opts['dirPath'] || os.tmpdir();
  return function spawn() {
    const subDirName = randomChars(2);
    const fileNameNew = uniqueChars();
    const fileExt = '.jpg';
    const subDirPath = path.join(dirPath, subDirName);
    fse.ensureDirSync(subDirPath);
    return {'all': path.join(dirPath, subDirName, fileNameNew + fileExt), 'relative': path.posix.join('/', subDirName, fileNameNew + fileExt)};
  }
};

function uniqueChars() {
  const timestamp = (+new Date()).toString();
  return crypto.createHash('md5').update(timestamp).digest('hex');
}

function randomChars(num=2) {
  chars = '';
  for (let i=0; i<num; i++) {
    chars += int2Char(randomInt(65, 90));
  }
  return chars;
}

function int2Char(i) {
  return String.fromCharCode(i)
}

function randomInt(from, to) {
  to = to + 1;
  return Math.floor(Math.random() * (to - from)) + from;
}
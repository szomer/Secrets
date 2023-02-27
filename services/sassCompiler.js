const sass = require('sass');
const fs = require('fs');

module.exports = function compile() {
  const compressed = sass.compile('./scss/_custom.scss', {
    style: 'compressed',
  });

  fs.writeFile('./public/css/style.css', compressed.css, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('File compressed & saved');
  });
};

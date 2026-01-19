const fs = require("fs");
const path = require("path");

module.exports = {
    cloudflar3: fs.readFileSync(path.join(__dirname, "cloudflar3.html")).toString(),
    g00gle: fs.readFileSync(path.join(__dirname, "g00gle.html")).toString(),
    iis: fs.readFileSync(path.join(__dirname, "iis.html")).toString(),
    oracl3: fs.readFileSync(path.join(__dirname, "oracl3.html")).toString(),
    t0mcat: fs.readFileSync(path.join(__dirname, "t0mcat.html")).toString()
};

const crypto = require("crypto");
const fs = require("fs");
const packageJson = require("../package.json");
const path = require("path");

function GET_COMMIT_ID() {
    let commitId = "nightly";

    try {
        const rootDirectory = path.resolve(__dirname, "..");
        commitId = fs.readFileSync(rootDirectory + "/.git/HEAD", {"encoding": "utf-8"}).trim();

        if (commitId.match(/^ref: refs\/heads\/main$/) !== null) {
            commitId = fs.readFileSync(rootDirectory + "/.git/refs/heads/main", {"encoding": "utf-8"}).trim();
        }
    } catch (e) {
        //intentional
    }

    return commitId;
}

const manifest = {
    timestamp: new Date().toISOString(),
    version: packageJson.version,
    sha256sums: {

    }
}

const binaries = {
    "NoCloud-armv7": "./build/armv7/NoCloud",
    "NoCloud-armv7-lowmem": "./build/armv7/NoCloud-lowmem",
    "NoCloud-aarch64": "./build/aarch64/NoCloud",

    "NoCloud-armv7.upx": "./build/armv7/NoCloud.upx",
    "NoCloud-armv7-lowmem.upx": "./build/armv7/NoCloud-lowmem.upx",
    "NoCloud-aarch64.upx": "./build/aarch64/NoCloud.upx",
}

Object.values(binaries).forEach((path, i) => {
    const name = Object.keys(binaries)[i];

    try {
        const bin = fs.readFileSync(path);
        const checksum = crypto.createHash("sha256");
        checksum.update(bin);

        manifest.sha256sums[name] = checksum.digest("hex");
    } catch(e) {
        if(e.code === "ENOENT") {
            // eslint-disable-next-line no-console
            console.warn(`Couldn't find ${name} at ${path}`);
        } else {
            // eslint-disable-next-line no-console
            console.error(e);
        }
    }
})

if (process.argv.length > 2 && process.argv[2] === "nightly") {
    manifest.version = GET_COMMIT_ID();

    try {
        manifest.changelog = fs.readFileSync("./build/changelog_nightly.md").toString();
    } catch(e) {
        //intentional
    }
}

fs.writeFileSync("./build/NoCloud_release_manifest.json", JSON.stringify(manifest, null, 2))

const fs = require('fs');
const path = require("path");


function GET_NoCloud_VERSION() {
    let NoCloudVersion = "unknown";

    try {
        const rootDirectory = path.resolve(__dirname, "..");
        const packageContent = fs.readFileSync(rootDirectory + "/package.json", {"encoding": "utf-8"});

        if (packageContent) {
            NoCloudVersion = JSON.parse(packageContent.toString()).version;
        }
    } catch (e) {
        //intentional
    }

    return NoCloudVersion;
}

function GET_COMMIT_ID() {
    let commitId = "unknown";

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


const metadata = {
    version: GET_NoCloud_VERSION(),
    commit:  GET_COMMIT_ID(),
    buildTimestamp: new Date().toISOString(),
};

fs.writeFileSync(
    path.join(__dirname, "../backend/lib/res/build_metadata.json"),
    JSON.stringify(metadata)
);

const assert = require("node:assert");
const { describe, it } = require("node:test");

const GithubNoCloudUpdateProvider = require("../../../../../lib/updater/lib/update_provider/GithubNoCloudUpdateProvider");
const path = require("path");
const {promises: fs} = require("fs");

describe("GithubNoCloudUpdateProvider", () => {
    it("parses regular overview response correctly", async () => {
        const updateProvider = new GithubNoCloudUpdateProvider();
        const data = JSON.parse(await fs.readFile(path.join(__dirname, "/res/GithubNoCloudUpdateProvider/regular_overview_response.json"), { encoding: "utf-8" }));
        const expected = JSON.parse(await fs.readFile(path.join(__dirname, "/res/GithubNoCloudUpdateProvider/correctly_parsed_regular_overview_response.json"), { encoding: "utf-8" }));
        const actual = updateProvider.parseReleaseOverviewApiResponse(data);

        assert.deepStrictEqual(JSON.parse(JSON.stringify(actual)), expected);
    });

    it("parses incorrectly sorted overview response correctly", async () => {
        const updateProvider = new GithubNoCloudUpdateProvider();
        const data = JSON.parse(await fs.readFile(path.join(__dirname, "/res/GithubNoCloudUpdateProvider/incorrectly_sorted_overview_response.json"), { encoding: "utf-8" }));
        const expected = JSON.parse(await fs.readFile(path.join(__dirname, "/res/GithubNoCloudUpdateProvider/correctly_parsed_regular_overview_response.json"), { encoding: "utf-8" }));
        const actual = updateProvider.parseReleaseOverviewApiResponse(data);

        assert.deepStrictEqual(JSON.parse(JSON.stringify(actual)), expected);
    });
});

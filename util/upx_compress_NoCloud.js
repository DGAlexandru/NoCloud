/* eslint-disable */
const fs = require("fs");
const UPX = require("upx");
const glob = require("glob");

const binaries = {
    armv7: {
        base: glob.sync("./build_dependencies/pkg/v3.5/fetched-*-linuxstatic-armv7")[0] ? glob.sync("./build_dependencies/pkg/v3.5/fetched-*-linuxstatic-armv7")[0] : "./build_dependencies/pkg/v3.5/built-v20.10.0-linuxstatic-armv7",
        built: "./build/armv7/NoCloud",
        out: "./build/armv7/NoCloud.upx",
        upx: UPX({
            //ultraBrute: true // Disabled for now (2022-05-07) due to performance issues with the latest upx devel

            // instead of ultraBrute, this also works okay-ish
            lzma: true,
            best: true
        })
    },
    armv7_lowmem: {
        base: glob.sync("./build_dependencies/pkg/v3.5/fetched-*-linuxstatic-armv7")[0] ? glob.sync("./build_dependencies/pkg/v3.5/fetched-*-linuxstatic-armv7")[0] : "./build_dependencies/pkg/v3.5/built-v20.10.0-linuxstatic-armv7",
        built: "./build/armv7/NoCloud-lowmem",
        out: "./build/armv7/NoCloud-lowmem.upx",
        upx: UPX({
            //ultraBrute: true // Disabled for now (2022-05-07) due to performance issues with the latest upx devel

            // instead of ultraBrute, this also works okay-ish
            lzma: true,
            best: true
        })
    },
    aarch64: {
        base: glob.sync("./build_dependencies/pkg/v3.5/fetched-*-linuxstatic-arm64")[0] ? glob.sync("./build_dependencies/pkg/v3.5/fetched-*-linuxstatic-arm64")[0] : "./build_dependencies/pkg/v3.5/built-v20.10.0-linuxstatic-arm64",
        built: "./build/aarch64/NoCloud",
        out: "./build/aarch64/NoCloud.upx",
        upx: UPX({
            //ultraBrute: true // Disabled for now (2022-05-07) due to performance issues with the latest upx devel

            // instead of ultraBrute, this also works okay-ish
            lzma: true,
            best: true
        })
    }
};

/**
 * There is absolutely no error handling in here. Great :)
 *
 * Note that this only works with patched base binaries
 */
console.log("Starting UPX compression");

Object.values(binaries).forEach(async (b,i) => {
    console.log("Compressing " + b.built);
    const name = Object.keys(binaries)[i];

    console.time(name);

    const baseSize = fs.readFileSync(b.base).length;
    const built = fs.readFileSync(b.built);

    const runtime = built.subarray(0, baseSize);
    const payload = built.subarray(baseSize);

    // UPX will reject files without the executable bit on linux. Also, default mode is 666
    fs.writeFileSync(b.out + "_runtime", runtime, {mode: 0o777});

    const upxResult = await b.upx(b.out + "_runtime").start();

    console.log("Compressed " + b.built + " from " + upxResult.fileSize.before + " to " + upxResult.fileSize.after + ". Ratio: " + upxResult.ratio);

    const compressedRuntime = fs.readFileSync(b.out + "_runtime");
    fs.unlinkSync(b.out + "_runtime");

    const fullNewBinary = Buffer.concat([compressedRuntime, payload]);

    fs.writeFileSync(b.out, fullNewBinary, {mode: 0o777});

    console.log("Successfully wrote " + b.out);
    console.timeEnd(name);
});


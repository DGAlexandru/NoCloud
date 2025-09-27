/* eslint-disable */
const fs = require("fs");
const path = require("path");
const UPX = require("upx");
const glob = require("glob");

const upxBinDir = path.join(process.cwd(), "node_modules", "upx", "bin");

// Ensure UPX bundled binaries are executable (important on CI Linux runners)
try {
  if (fs.existsSync(upxBinDir)) {
    const upxFiles = fs.readdirSync(upxBinDir);
    upxFiles.forEach(f => {
      const p = path.join(upxBinDir, f);
      try {
        // 0o755 should be enough; original 0o777 is "too much"
        fs.chmodSync(p, 0o755);
      } catch (err) {
        console.warn(`Warning: failed to chmod ${p}: ${err.message}`);
      }
    });
    console.log(`Set exec bit on ${upxFiles.length} upx files in ${upxBinDir}`);
  } else {
    console.warn(`UPX bin dir not found at ${upxBinDir}`);
  }
} catch (err) {
  console.warn("Could not ensure UPX binary is executable:", err.message);
}

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
 * Added some error handling.
 *
 * Also, as UPX version has been updated, it should also work with non-patched NodeJS base binaries
 */
console.log("Starting UPX compression");

(async () => {
  for (const [name, b] of Object.entries(binaries)) {
    console.log("Compressing " + b.built);
    console.time(name);

    // defensive checks
    if (!fs.existsSync(b.base)) {
      console.error(`Base file not found: ${b.base}`);
      continue;
    }
    if (!fs.existsSync(b.built)) {
      console.error(`Built file not found: ${b.built}`);
      continue;
    }

    const baseSize = fs.readFileSync(b.base).length;
    const built = fs.readFileSync(b.built);

    const runtime = built.subarray(0, baseSize);
    const payload = built.subarray(baseSize);

    // UPX will reject files without the executable bit on linux. Default mode is 0o666
    const runtimePath = b.out + "_runtime";
    fs.writeFileSync(runtimePath, runtime, { mode: 0o755 });

    try {
      const upxResult = await b.upx(runtimePath).start();

      console.log("Compressed " + b.built + " from " + upxResult.fileSize.before + " to " + upxResult.fileSize.after + ". Ratio: " + upxResult.ratio);

      const compressedRuntime = fs.readFileSync(runtimePath);
      try { fs.unlinkSync(runtimePath); } catch (e) { /* ignore */ }

      const fullNewBinary = Buffer.concat([compressedRuntime, payload]);

      fs.writeFileSync(b.out, fullNewBinary, { mode: 0o755 });

      console.log("Successfully wrote " + b.out);
    } catch (err) {
      console.error("UPX compression failed for", b.built, ":", err && err.message ? err.message : err);
    } finally {
      console.timeEnd(name);
    }
  }
})();

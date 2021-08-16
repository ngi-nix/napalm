#!/usr/bin/env node

/*
  This script patches script section of package.json, so that
  it uses npx in order to use binaries from node_modules
*/
import fs from "fs";
import { loadJSONFile } from "./lib.mjs"

if (process.argv.length != 3) {
    console.log("Usage:");
    console.log(`    ${process.argv[0]} ${process.argv[1]} [package.json]}`);

    process.exit(-1);
}

const npxify = (command) => {
    // TODO: Improve this method

    if (command.includes("npx")) return command;

    return `npx ${command}`;
};

const jsFile = process.argv[2];

loadJSONFile(jsFile).then((pkg) => {
    const scripts = pkg.scripts;

    for (const script in scripts) {
	scripts[script] = npxify(scripts[script]);
    };

    fs.writeFileSync(jsFile, JSON.stringify(pkg), {encoding:'utf8',flag:'w'});

    console.log(`[npx-patcher] Sucesfully updated ${jsFile}`)
}).catch((err) => {
    console.error("[npx-patcher] Error:");
    console.error(err);
    process.exit(-1);
});

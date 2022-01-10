import { NS } from '/../NetscriptDefinitions.js';


export async function main(ns: NS): Promise<void> {
    const skill = ns.getHackingLevel();
    const programs = Programs.filter((program) => !ns.fileExists(program.name) && program.hacking <= skill);

    for (const program of programs) {
        while (!ns.fileExists(program.name)) {
            if (!ns.isBusy()) {
                ns.createProgram(program.name);
            } else {
                await ns.sleep(5000);
            }
        }
    }
}

const Programs = [
    {
        name: "BruteSSH.exe",
        hacking: 50
    },
    {
        name: "FTPCrack.exe",
        hacking: 100
    },
    {
        name: "relaySMTP.exe",
        hacking: 250
    },
    {
        name: "HTTPWorm.exe",
        hacking: 500
    },
    {
        name: "SQLInject.exe",
        hacking: 750
    },
    {
        name: "DeepscanV1.exe",
        hacking: 75
    },
    {
        name: "DeepscanV2.exe"
        , hacking: 400
    },
    {
        name: "ServerProfiler.exe",
        hacking: 75
    },
    {
        name: "AutoLink.exe",
        hacking: 25
    }
];
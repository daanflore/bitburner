import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns: NS): Promise<void> {
    const target = <string>ns.args[0];
    const sTime = <number>ns.args[1];

    if (sTime > 0) {
        await ns.sleep(sTime);
    }

    await ns.hack(target);
}
import { NS } from "/../NetscriptDefinitions.js";
import { HacknetManager } from '/hacknet/HacknetManager.js';

export async function main(ns : NS) : Promise<void> {
    const hacknetManager = new HacknetManager(ns);

    while(true) {
        hacknetManager.CreateNewNode();
        const sleepDuration = hacknetManager.UpgradeMostValuedHacknetNode() ? 1000: 60000;
        await ns.sleep(sleepDuration);
    }
}
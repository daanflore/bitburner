import { HashManager } from "./HashManager";
import { NS } from "/../NetscriptDefinitions.js";
import { ApplicationSettings } from "/ApplicationSettings.js";
import { HacknetManager } from '/hacknet/HacknetManager.js';

export async function main(ns: NS): Promise<void> {
    const hacknetManager = new HacknetManager(ns);
    const hashManager = new HashManager(ns);

    while (true) {
        hacknetManager.CreateNewNode();
        const sleepDuration = 500;
        const numberOfLoops = hacknetManager.UpgradeMostValuedHacknetNode() ? 1 : 60000 / sleepDuration;

        for (let loop = 0; loop < numberOfLoops; loop++) {
            while (hashManager.CheckReachedHashLimit()) {
                if (!hashManager.SpendHashes(ApplicationSettings.HacknetSettings.UpgradeName, ApplicationSettings.HacknetSettings.Target)) {
                    hashManager.SpendHashes("Sell for Money");
                }

                loop++;
                await ns.sleep(sleepDuration);
            }

            await ns.sleep(sleepDuration);
        }
    }
}

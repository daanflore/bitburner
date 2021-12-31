import { HashManager } from "/hacknet/HashManager.js";
import { NS } from "/../NetscriptDefinitions.js";
import { HacknetManager } from '/hacknet/HacknetManager.js';
import { HacknetSettings } from "/hacknet/HacknetSettings.js";

export async function main(ns: NS): Promise<void> {
    const hacknetSettings = new HacknetSettings(ns);
    const hacknetManager = new HacknetManager(ns);
    const hashManager = new HashManager(ns);

    while (true) {
        hacknetManager.CreateNewNode();
        const sleepDuration = 500;
        const numberOfLoops = hacknetManager.UpgradeMostValuedHacknetNode() ? 1 : 60000 / sleepDuration;
        let hasMoneyBeenUsed = true;
        
        for (let loop = 0; loop < numberOfLoops; loop++ && hasMoneyBeenUsed) {
            while (hashManager.CheckReachedHashLimit()) {
                if (!hashManager.SpendHashes(hacknetSettings.UpgradeName, hacknetSettings.Target)) {
                    if (!hashManager.SpendHashes("Sell for Money")) {
                        hasMoneyBeenUsed = false;
                    }
                }

                loop++;
            }

            await ns.sleep(sleepDuration);
        }
    }
}

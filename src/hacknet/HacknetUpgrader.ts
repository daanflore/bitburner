import { HashManager } from "/hacknet/HashManager.js";
import { NS } from "/../NetscriptDefinitions.js";
import { HacknetManager } from '/hacknet/HacknetManager.js';
import { HacknetSettings } from "/hacknet/HacknetSettings.js";

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    const hacknetSettings = new HacknetSettings(ns);
    const hacknetManager = new HacknetManager(ns);
    const hashManager = new HashManager(ns, hacknetSettings);

    while (true) {
        hacknetManager.CreateNewNode();
        const sleepDuration = 500;
        const numberOfLoops = hacknetManager.UpgradeMostValuedHacknetNode() ? 1 : 60000 / sleepDuration;
        
        for (let loop = 0; loop < numberOfLoops; loop++ ) {
            SpendHashes();
            await ns.sleep(sleepDuration);
        }
    }

    function SpendHashes(): void {
        let hasMoneyBeenUsed = true;
        while (hashManager.CheckReachedHashLimit() && hasMoneyBeenUsed) {
            if (!hashManager.SpendHashes(hacknetSettings.UpgradeName, hacknetSettings.Target)) {
                if (!hashManager.SpendHashes("Sell for Money")) {
                    hasMoneyBeenUsed = false;
                }
            }
        }
    }
}

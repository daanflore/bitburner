import { HashManager } from "/hacknet/HashManager.js";
import { NS } from "/../NetscriptDefinitions.js";
import { HacknetSettings } from "hacknet/HacknetSettings.js";

export async function main(ns: NS): Promise<void> {
    const hacknetSettings = new HacknetSettings(ns);
    const hashManager = new HashManager(ns, hacknetSettings);

    while (true) {
        SpendHashes(hashManager, hacknetSettings);
        await ns.sleep(1000);
    }
}

export function SpendHashes(hashManager: HashManager, hacknetSettings: HacknetSettings): void {
    let hasMoneyBeenUsed = true;
    
    while (hashManager.CheckHasMinimumHashesStored() && hasMoneyBeenUsed) {
        if (!hashManager.SpendHashes(hacknetSettings.UpgradeName, hacknetSettings.Target)) {
            if (hashManager.CheckReachedHashLimit()) {
                hasMoneyBeenUsed = hashManager.SpendHashes("Sell for Money");
            } else {
                hasMoneyBeenUsed = false;
            }
        }
    }
}

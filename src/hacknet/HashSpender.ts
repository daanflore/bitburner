import { HashManager } from "/hacknet/HashManager.js";
import { NS } from "/../NetscriptDefinitions.js";
import { HacknetSettings } from "/hacknet/HacknetSettings.js";

export async function main(ns: NS): Promise<void> {
    const hacknetSettings = new HacknetSettings(ns);
    const hashManager = new HashManager(ns, hacknetSettings);

    while (true) {
        SpendHashes();
        await ns.sleep(1000);
    }

    function SpendHashes(): void {
        let hasMoneyBeenUsed = true;

        while (hashManager.CheckHasMinimumHashesStored() && hasMoneyBeenUsed) {
            if (!hashManager.SpendHashes(hacknetSettings.UpgradeName, hacknetSettings.Target)) {
                if (hashManager.CheckReachedHashLimit() && !hashManager.SpendHashes("Sell for Money")) {
                    hasMoneyBeenUsed = false;
                }
            }
        }
    }
}

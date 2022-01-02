import { HashManager } from "/hacknet/HashManager.js";
import { NS } from "/../NetscriptDefinitions.js";
import { HacknetManager } from '/hacknet/HacknetManager.js';
import { HacknetSettings } from "/hacknet/HacknetSettings.js";
import { Logger } from "/helpers/Logger.js";
import { LogLevelEnum } from "/LogLevelEnum.js";

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    ns.clearLog();

    const hacknetSettings = new HacknetSettings(ns);
    const logger = new Logger(ns, hacknetSettings);
    const hacknetManager = new HacknetManager(ns, hacknetSettings, logger);
    const hashManager = new HashManager(ns, hacknetSettings);

    logger.LogToScriptLog("Starting log", LogLevelEnum.Info);

    while (true) {
        logger.LogToScriptLog("main loop", LogLevelEnum.Info);
        logger.AddIndent();
        hacknetManager.CreateNewNode();
        const sleepDuration = 100;
        const numberOfLoops = hacknetManager.UpgradeMostValuedHacknetNode() ? 1 : 60000 / sleepDuration;
        logger.RemoveIndent();
        logger.LogToScriptLog(`wait ${numberOfLoops * sleepDuration} milliseconds before trying next upgrade`, LogLevelEnum.Info);

        for (let loop = 0; loop < numberOfLoops; loop++) {
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

import { HashManager } from "/hacknet/HashManager.js";
import { NS } from "/../NetscriptDefinitions.js";
import { HacknetManager } from '/hacknet/HacknetManager.js';
import { HacknetSettings } from "/hacknet/HacknetSettings.js";
import { Logger } from "/helpers/Logger.js";
import { LogLevelEnum } from "/LogLevelEnum.js";
import { HacknetUpgradeStatusEnum } from "./HacknetUpgradeEnum";
import { SpendHashes } from "/hacknet/HashSpender.js";

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    ns.clearLog();
    const hacknetSettings = new HacknetSettings(ns);
    const logger = new Logger(ns, hacknetSettings);
    const hacknetManager = new HacknetManager(ns, hacknetSettings, logger);
    const hashManager = new HashManager(ns, hacknetSettings, logger);
    logger.LogToScriptLog("Starting log", LogLevelEnum.Info);

    while (true) {
        logger.LogToScriptLog("main loop", LogLevelEnum.Info);
        logger.AddIndent();
        hacknetManager.CreateNewNode();
        const sleepDuration = 100;
        const hacknetUpgradeStatus = hacknetManager.UpgradeMostValuedHacknetNode();

        let numberOfLoops = 1;

        if (HacknetUpgradeStatusEnum.Upgraded === hacknetUpgradeStatus) {
            numberOfLoops = 1;
        } else if (HacknetUpgradeStatusEnum.NotEnoughMoney === hacknetUpgradeStatus) {
            numberOfLoops = 60000 / sleepDuration;
        } else if (HacknetUpgradeStatusEnum.FullyUpgraded === hacknetUpgradeStatus) {
            ns.spawn("/hacknet/HashSpender.js");
        }

        numberOfLoops = hacknetUpgradeStatus === HacknetUpgradeStatusEnum.Upgraded ? 1 : 60000 / sleepDuration;
        logger.RemoveIndent();
        logger.LogToScriptLog(`wait ${numberOfLoops * sleepDuration} milliseconds before trying next upgrade`, LogLevelEnum.Info);
        logger.AddIndent();

        for (let loop = 0; loop < numberOfLoops; loop++) {
            await SpendHashes(hashManager, hacknetSettings);
            await ns.sleep(sleepDuration);
        }

        logger.RemoveIndent();
    }
}

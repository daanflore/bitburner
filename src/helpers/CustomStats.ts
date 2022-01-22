import { NS } from '../../NetscriptDefinitions.js';
import { ServerInfo } from 'servers/ServerInfo.js';
import { CreateStatDisplay, UpdateStatDisplay, DeleteStatDisplay } from 'helpers/DomHelpers.js';

/** @param {NS} ns **/
export async function main(ns: NS): Promise<void> {
    
    ns.disableLog("ALL");
    const args = ns.flags([["help", false], ["refreshRate", 1000]]) as { "help": boolean; "refreshRate": number };
    const scriptIncomeDispaly = "TotalScriptIncome";
    const scriptExperienceDispaly = "TotalExcperienceIncome";
    const hashDisplay = "Hashes";


    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    CreateStatDisplay(scriptIncomeDispaly, "Money", false, "#ffd700");
    CreateStatDisplay(scriptExperienceDispaly, "XP", false);
    CreateStatDisplay(hashDisplay, "Hashes");

    ns.atExit(() => {
        DeleteStatDisplay(scriptIncomeDispaly);
        DeleteStatDisplay(scriptExperienceDispaly);
        DeleteStatDisplay(hashDisplay);
    });

    while (true) {
        try {
            const scriptIncome = ns.getScriptIncome();

            // Add script income per second
            if (Array.isArray(scriptIncome)) {
                UpdateStatDisplay(scriptIncomeDispaly, ns.nFormat(scriptIncome[0], '$0.00a') + '/sec');
            }

            // Add script exp gain rate per second
            UpdateStatDisplay(scriptExperienceDispaly, ns.nFormat(ns.getScriptExpGain(), '0.00a') + '/sec');

            // TODO: Add more neat stuff
            UpdateStatDisplay(hashDisplay,`${ns.nFormat(ns.hacknet.numHashes(), '0.00a')} /${ns.nFormat(ns.hacknet.hashCapacity(), '0.00a')}`);

            /*if (server !== undefined) {
                headers.push(server.name);
                values.push(ns.nFormat(server.maxMoney, "$0.0a"));
            }*/


        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(args.refreshRate);
    }
}
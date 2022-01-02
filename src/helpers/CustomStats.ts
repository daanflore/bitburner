import { NS } from '../../NetscriptDefinitions.js';

/** @param {NS} ns **/
export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    const args = ns.flags([["help", false]]);
    
    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const doc = eval('document'); // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');

    while (true) {
        try {
            const headers: string[] = [];
            const values: string[] = [];
            const scriptIncome = ns.getScriptIncome();

            // Add script income per second
            if (Array.isArray(scriptIncome)) {
                headers.push("ScrInc");
                headers.push(ns.nFormat(scriptIncome[0], '$0.0a') + '/sec');
            }

            // Add script exp gain rate per second
            headers.push("ScrExp");
            headers.push(ns.nFormat(ns.getScriptExpGain(), '0.0a') + '/sec');
            // TODO: Add more neat stuff
            headers.push("Hashes");
            headers.push(`${ns.nFormat(ns.hacknet.numHashes(), '0.0a')} /${ns.nFormat(ns.hacknet.hashCapacity(), '0.0a')}`);

            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
}
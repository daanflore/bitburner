import { NS } from "/../NetscriptDefinitions.js";

export async function main(ns: NS): Promise<void> {
    /** @param {NS} ns **/
    ns.disableLog("ALL");
    ns.clearLog();
    let target: string | undefined;

    if (typeof ns.args[0] === "string") {
        target = ns.args[0];
    }

    if (target === undefined || target.length === 0) {
        target = ns.getHostname();
    }

    const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}
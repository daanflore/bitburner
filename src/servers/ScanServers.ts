import { NS } from "/../NetscriptDefinitions.js";
import { Server } from "/servers/Server.js";

export async function main(ns: NS): Promise<void> {
    //ns.disableLog("ALL");

    const maxDepth = 15;
    const completedServers: Array<string> = [];//["home"];
    let hasChildServers = true;
    let serverIterator = ["home"];
    let currentDepth = 0;
    const servers: Array<Server> = [];

    while (currentDepth < maxDepth && hasChildServers) {
        let childServers: Array<string> = [];

        for (let i = 0; i < serverIterator.length; i++) {
            const current = serverIterator[i];
            const portsReq = ns.getServerNumPortsRequired(current);
            const srv = new Server(current, portsReq);
            srv.maxMoney = ns.getServerMaxMoney(current);
            srv.growTime = ns.getGrowTime(current);
            srv.weakenTime = ns.getWeakenTime(current);
            srv.hackTime = ns.getHackTime(current);
            srv.growth = ns.getServerGrowth(current);
            srv.minSec = ns.getServerMinSecurityLevel(current);
            srv.hackLevel = ns.getServerRequiredHackingLevel(current);
            srv.money = ns.getServerMoneyAvailable(current);
            srv.security = ns.getServerSecurityLevel(current);
            srv.maxRam = ns.getServerMaxRam(current);
            srv.hasRoot = ns.hasRootAccess(current);
            servers.push(srv);
            childServers = childServers.concat(ns.scan(current));
            completedServers.push(current);
        }

        serverIterator = childServers.filter(function (el) {
            return !completedServers.includes(el);
        });

        ns.print(serverIterator.toString());

        if (serverIterator.length > 0) {
            hasChildServers = true;
        } else {
            hasChildServers = false;
            ns.print("No accessible servers remaining.");
        }
        currentDepth++;
        ns.print(serverIterator.length + " new children at depth " + currentDepth);

        if (currentDepth === maxDepth) {
            ns.print("Reached max depth");
        }
    }

    ns.write("serverlist.txt", JSON.stringify(servers), "w");
}
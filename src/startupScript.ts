import { NS } from '../NetscriptDefinitions';

export async function main(ns: NS): Promise<void> {
    ns.exec("monitor.js", ns.getHostname(), 1, "--selfscan", "--rooted", "--hackable");
    ns.exec("/helpers/CustomStats.js", ns.getHostname());
    ns.exec("hackAllServers.js", ns.getHostname(), 1, "--script", "hack.js" ,"--loop");
    ns.exec("/hacknet/HacknetUpgrader.js", ns.getHostname());
}
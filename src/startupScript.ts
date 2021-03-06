import { NS } from '/../NetscriptDefinitions.js';

export function main(ns: NS): void {
    ns.exec("Watcher.js", ns.getHostname());
    ns.exec("/servers/ScanServers.js", ns.getHostname());
    ns.exec("/helpers/CustomStats.js", ns.getHostname());
    ns.exec("/hacking/BasicHackAllServers.js", ns.getHostname(), 1, "--script", "/hacking/HackScript.js" ,"--loop");
    ns.exec("/hacknet/HacknetUpgrader.js", ns.getHostname());
    ns.exec("/stock/StockTrader.js", ns.getHostname());
}
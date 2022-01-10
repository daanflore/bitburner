import { NS } from '../NetscriptDefinitions';

export async function main(ns: NS): Promise<void> {
    ns.exec("/servers/ScanServers.js", ns.getHostname());
    ns.exec("/helpers/CustomStats.js", ns.getHostname());
    ns.exec("/hacking/BasicHackAllServers.js", ns.getHostname(), 1, "--script", "/hacking/HackScript.js" ,"--loop");
    ns.exec("/hacknet/HacknetUpgrader.js", ns.getHostname());
}
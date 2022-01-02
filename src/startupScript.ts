import { NS } from '../NetscriptDefinitions';

export async function main(ns: NS): Promise<void> {
    ns.exec("alphanuke.js", ns.getHostname());
    ns.exec("monitor.js", ns.getHostname(), 1, "--selfscan", "--rooted", "--hackable");
    ns.exec("/helpers/CustomStats.js", ns.getHostname());
    ns.exec("hackAllServers.js", ns.getHostname(), 1, "--script", "hack.js" ,"--loop");
    ns.exec("/hack/targetfinder.js", ns.getHostname());
}
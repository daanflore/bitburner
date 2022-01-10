import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns: NS): Promise<void> {

    const arr = ns.ls(ns.getHostname(), ".js");
    arr.push(...ns.ls(ns.getHostname(), ".txt"));
    arr.push(...ns.ls(ns.getHostname(), ".log"));
    arr.push(...ns.ls(ns.getHostname(), ".script"));
    // eslint-disable-next-line no-alert
    const result = eval("window").confirm("Do you want to delete all the files? " + arr.join(", "));
    if (result) {
        for (const i in arr) {
            if (ns.rm(arr[i])) {
                ns.tprint("successfully deleted " + arr[i]);
            }
            else {
                ns.tprint("failed to delete " + arr[i]);
            }

            await ns.sleep(0);
        }
    }
}
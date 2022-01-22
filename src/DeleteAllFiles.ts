import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns: NS): Promise<void> {

    const arr = ns.ls(ns.getHostname(), ".js");
    arr.push(...ns.ls(ns.getHostname(), ".txt"));
    arr.push(...ns.ls(ns.getHostname(), ".log"));
    arr.push(...ns.ls(ns.getHostname(), ".script"));
    // eslint-disable-next-line no-alert
    const result = (<Window>eval("window")).confirm("Do you want to delete all the files? " + arr.join(", "));
    
    if (result) {
        for (const i of arr) {
            if (ns.rm(i)) {
                ns.tprint("successfully deleted " + i);
            }
            else {
                ns.tprint("failed to delete " + i);
            }

            await ns.sleep(0);
        }
    }
}
import { NS } from "/../NetscriptDefinitions.js";
import { IDatabase } from "/database/IDatabase.js";
import { LocalStorageDatabase } from "/database/LocalStorageDatabase.js";
import { ServerDbInfo, ServerInfo } from "/servers/ServerInfo.js";

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    const database: IDatabase = new LocalStorageDatabase(ns, ServerDbInfo.Name);

    while (true) {
        const maxDepth = 100;
        const completedServers: Array<string> = [];//["home"];
        let hasChildServers = true;
        let serverIterator = ["home"];
        let currentDepth = 0;
        const servers: Array<ServerInfo> = [];

        while (currentDepth < maxDepth && hasChildServers) {
            let childServers: Array<string> = [];

            for (let i = 0; i < serverIterator.length; i++) {
                const current = serverIterator[i];
                const srv = new ServerInfo(ns.getServer(current));
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

        database.SetItem(ServerDbInfo.keys.all, servers);
        await ns.sleep(100);
    }
}

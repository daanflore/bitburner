import { NS } from '/../NetscriptDefinitions.js';
import { IDatabase } from '/database/IDatabase.js';
import { LocalStorageDatabase } from '/database/LocalStorageDatabase.js';
import { ServerDbInfo, ServerInfo } from '/servers/ServerInfo.js';

export async function main(ns: NS): Promise<void> {
    const database: IDatabase = new LocalStorageDatabase(ns, ServerDbInfo.Name);
    const taskPort = ns.getPortHandle(1);
    const acceptPort = ns.getPortHandle(2);
    const resultPort = ns.getPortHandle(3);
    console.log(taskPort);

    //while (true) {
        const servers = database.GetItem<Array<ServerInfo>>(ServerDbInfo.keys.nonHackNode) ?? [];

        for (const server of servers) {

        }
   // }

}
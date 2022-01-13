import { NS } from '/../NetscriptDefinitions.js';
import { constants } from 'ApplicationConstants.js';
import { IDatabase } from 'database/IDatabase.js';
import { LocalStorageDatabase } from 'database/LocalStorageDatabase.js';
import { ServerDbInfo, ServerInfo } from 'servers/ServerInfo.js';

export async function main(ns: NS): Promise<void> {
    const database: IDatabase = new LocalStorageDatabase(ns, ServerDbInfo.Name);
    const taskPort = ns.getPortHandle(constants.TaskPort);
    const acceptPort = ns.getPortHandle(constants.AccPort);
    const resultPort = ns.getPortHandle(constants.ResultPort);
    console.log(taskPort);

    while (true) {
        await PauseUntilTaskPortContainsItems();
        await CreateHackingTasks();
        await ns.sleep(1000);
    }

    //while (true) {
    const servers = database.GetItem<Array<ServerInfo>>(ServerDbInfo.keys.nonHackNode) ?? [];

    for (const server of servers) {

    }
    // }

    async function PauseUntilTaskPortContainsItems(): Promise<void> {
        while (!taskPort.empty()) {
            await ns.sleep(1000);
        }
    }

    async function CreateHackingTasks(): Promise<void> {
        // todo write logic
    }
}



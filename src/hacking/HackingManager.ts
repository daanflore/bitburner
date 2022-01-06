import { NS } from '/../NetscriptDefinitions.js';
import { ServerInfo } from '/servers/ServerInfo.js';
import { ServerManager } from "/servers/ServerManager.js";


export class HackingManager {
    private _serverManager: ServerManager;
    /**
     *
     */
    constructor(private _ns: NS) {
        this._serverManager = new ServerManager(_ns);
    }

    public PrepareHackTasks(): void {
        const servers = this._serverManager.GetServers((server) => server.maxMoney > 0).sort(this.Compare);
        const serversToProcess: Array<ServerInfo> = servers.slice(0, 300);

        console.log(serversToProcess);

        //this._ns.server;
    }

    private Compare(a: ServerInfo, b: ServerInfo): number {
        if (a.maxMoney > b.maxMoney) {
            return -1;
        }

        if (a.maxMoney < b.maxMoney) {
            return 1;
        }

        return 0;
    }
}


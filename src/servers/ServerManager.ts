import { NS } from "/../NetscriptDefinitions.js";
import { ServerInfo } from '/servers/ServerInfo.js';

export class ServerManager {
    private Servers: Array<ServerInfo> = [];
    /**
     *
     */
    constructor(private _ns: NS) {
        this.ReleadAllServers();
    }

    public ReleadAllServers(): void {
        const completedServers: Array<string> = [];//["home"];
        let hasChildServers = true;
        let serverIterator = ["home"];
        let currentDepth = 0;
        this.Servers = [];

        while (hasChildServers) {
            const childServers: Array<string> = [];
            serverIterator = childServers.filter(function (el) {
                return !completedServers.includes(el);
            });

            this._ns.print(serverIterator.toString());

            if (serverIterator.length > 0) {
                hasChildServers = true;
            } else {
                hasChildServers = false;
                this._ns.print("No accessible servers remaining.");
            }
            currentDepth++;
            this._ns.print(serverIterator.length + " new children at depth " + currentDepth);
        }
    }

    public GetServers(filter?:(value: ServerInfo, index: number, array: ServerInfo[]) => boolean): Array<ServerInfo> {
        if (filter !== undefined) {
            return this.Servers.filter(filter);
        } else {
            return this.Servers;
        }
    }
}
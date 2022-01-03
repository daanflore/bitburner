import { NS } from "/../NetscriptDefinitions.js";
import { Server } from '/servers/Server.js';

export class ServerManager {
    private Servers: Array<Server> = [];
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
            let childServers: Array<string> = [];

            for (let i = 0; i < serverIterator.length; i++) {
                const current = serverIterator[i];
                const portsReq = this._ns.getServerNumPortsRequired(current);
                const srv = new Server(current, portsReq);
                srv.maxMoney = this._ns.getServerMaxMoney(current);
                srv.growTime = this._ns.getGrowTime(current);
                srv.weakenTime = this._ns.getWeakenTime(current);
                srv.hackTime = this._ns.getHackTime(current);
                srv.growth = this._ns.getServerGrowth(current);
                srv.minSec = this._ns.getServerMinSecurityLevel(current);
                srv.hackLevel = this._ns.getServerRequiredHackingLevel(current);
                srv.money = this._ns.getServerMoneyAvailable(current);
                srv.security = this._ns.getServerSecurityLevel(current);
                srv.maxRam = this._ns.getServerMaxRam(current);
                srv.hasRoot = this._ns.hasRootAccess(current);
                this.Servers.push(srv);
                childServers = childServers.concat(this._ns.scan(current));
                completedServers.push(current);
            }

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

    public GetServers(filter?:(value: Server, index: number, array: Server[]) => boolean): Array<Server> {
        if (filter !== undefined) {
            return this.Servers.filter(filter);
        } else {
            return this.Servers;
        }
    }
}
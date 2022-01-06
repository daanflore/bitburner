
import { Server } from "/../NetscriptDefinitions.js";

export class ServerInfo {
    name: string;
    portsReq: number;
    hackLevel: number;
    maxMoney: number;
    minSec: number;
    money: number;
    security: number;
    maxRam: number;
    usedRam: number;
    hasRoot: boolean;
    cores: number;
    openPorts: number;
    playerServer: boolean;

    constructor(server: Server) {
        this.name = server.hostname;
        this.portsReq = server.numOpenPortsRequired;
        this.hackLevel = server.requiredHackingSkill;
        this.openPorts = server.openPortCount;
        this.maxMoney = server.moneyMax;
        this.minSec = server.minDifficulty;
        this.security = server.hackDifficulty;
        this.hasRoot = server.hasAdminRights;
        this.cores = server.cpuCores;
        this.money = server.moneyAvailable;
        this.maxRam = server.maxRam;
        this.usedRam = server.ramUsed;
        this.playerServer = server.purchasedByPlayer;
    }
}

export const ServerDbInfo = {
    Name: "Server",
    keys: {
        all: "Servers",
        nonHackNode: "NonHackNode"
    }
};
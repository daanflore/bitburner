import { NS } from '/../NetscriptDefinitions.js';
import { IDatabase } from 'database/IDatabase.js';
import { LocalStorageDatabase } from 'database/LocalStorageDatabase.js';
import { IServerInfo, ServerDbInfo } from 'servers/ServerInfo.js';

export async function main(ns: NS): Promise<void> {
    const flags = ns.flags([
        ["loop", false],
        ["script", ""],
        ["serverRam", 64],
        ["tail", false]
    ]);

    ns.disableLog("ALL");
    ns.clearLog();

    if (flags.tail) {
        ns.tail();
    }

    const database: IDatabase = new LocalStorageDatabase(ns, ServerDbInfo.Name);

    const script = flags.script;
    ns.print(`script ${script}`);

    if (flags.loop) {
        while (true) {
            await RunHackAllServers(false);
            await ns.sleep(10000);
        }
    } else {
        await RunHackAllServers(true);
    }


    async function RunHackAllServers(killScript: boolean): Promise<void> {
        const servers = database.GetItem<Array<IServerInfo>>(ServerDbInfo.keys.nonHackNode) ?? [];

        for (const server of servers) {
            ns.print("Checking: " + server.name);
            ns.print(`script ${script}`);

            if (!server.openPortsTool.sshPortOpen && ns.fileExists("BruteSSH.exe")) {
                ns.brutessh(server.name);
                server.openPortsTool.sshPortOpen = true;
                server.openPorts += 1;
            }

            if (!server.openPortsTool.ftpPortOpen && ns.fileExists("FTPCrack.exe")) {
                ns.ftpcrack(server.name);
                server.openPortsTool.ftpPortOpen = true;
                server.openPorts += 1;
            }

            if (!server.openPortsTool.smtpPortOpen && ns.fileExists("relaySMTP.exe")) {
                ns.relaysmtp(server.name);
                server.openPortsTool.smtpPortOpen = true;
                server.openPorts += 1;
            }

            if (!server.openPortsTool.httpPortOpen && ns.fileExists("HTTPWorm.exe")) {
                ns.httpworm(server.name);
                server.openPortsTool.httpPortOpen = true;
                server.openPorts += 1;
            }

            if (!server.openPortsTool.sqlPortOpen && ns.fileExists("SQLInject.exe")) {
                ns.sqlinject(server.name);
                server.openPortsTool.sqlPortOpen = true;
                server.openPorts += 1;
            }

            if (!server.hasRoot) {
                ns.print("Open ports " + server.openPorts + " Needed ports: " + server.portsReq);
                if (server.openPorts >= server.portsReq) {
                    ns.nuke(server.name);
                    server.hasRoot = true;
                } else {
                    ns.print("Need more ports open");
                }
            }

            if (server.hackLevel <= ns.getPlayer().hacking) {
                if (server.maxMoney !== 0) {
                    if (server.hasRoot && server.hackLevel <= ns.getPlayer().hacking) {
                        if (server.maxRam > 0) {
                            await KillAndRunScript(server, script, killScript);
                        } else {
                            await BuyServerAndRunScript(server.name, script, flags.serverRam, killScript);
                        }
                    }
                    else {
                        ns.print("No admin rights");
                    }
                } else {
                    ns.print("No money to hack");
                }
            } else {
                ns.print("Hacking Level to low");
            }
        }
    }

    async function KillAndRunScript(server: IServerInfo, script: string, killScript: boolean, ...scriptArgs: (string | number | boolean)[]): Promise<void> {
        if (killScript) {
            if (ns.scriptKill(script, server.name)) {
                ns.print("Ram: " + server.usedRam);
            } else {
                ns.print("No script killed");
            }
        } else {
            ns.print("Kill flag is false");
        }

        ns.print(`server max ram ${server.maxRam} - server used ram ${ns.getServerUsedRam(server.name)} - script used ram ${ns.getScriptRam(script, server.name)}`);
        const threads = Math.floor((server.maxRam - ns.getServerUsedRam(server.name)) / ns.getScriptRam(script, server.name));

        if (threads > 0) {
            ns.print("Starting script: " + script);
            await ns.scp(script, "home", server.name);
            ns.exec(script, server.name, threads, ...scriptArgs);
        } else {
            ns.print("not enough threads");
        }
    }

    async function BuyServerAndRunScript(server: string, script: string, ram: number, killScript: boolean): Promise<void> {
        ns.print(`Getting server`);
        let servers = ns.getPurchasedServers();
        ns.print(servers);
        let serverToUse;
        servers = servers.filter(playerServer => playerServer.includes(server));
        ns.print(`Filtering servers ${servers}`);
        const serverName = `auto-${server}-${ram}`;

        if (servers.length === 0) {
            serverToUse = ns.purchaseServer(serverName, ram);
            ns.print(`Purchasing server ${serverToUse}`);
        } else {
            serverToUse = servers[0];
            ns.print(`Found existing server ${serverToUse}`);

            if (ns.getServerMaxRam(serverToUse) < ram) {
                ns.print(`Ram not equal or lower removing server ${serverToUse}`);
                ns.deleteServer(serverToUse);
                serverToUse = ns.purchaseServer(serverName, ram);
                ns.print(`Buying new Server ${serverToUse}`);
            }
        }

        if (serverToUse === undefined || serverToUse === '') {
            ns.print("No server bought");
            return;
        }

        const playerServer: IServerInfo = {
            name: serverToUse,
            maxRam: ns.getServerMaxRam(serverToUse),
            maxMoney: 0,
            openPorts: 0,
            security: 0,
            cores: 1, hackLevel: 0,
            hasRoot: true, usedRam: 0,
            minSec: 0,
            money: 0,
            playerServer: true,
            portsReq: 0,
            openPortsTool: {
                httpPortOpen: false,
                ftpPortOpen: false,
                smtpPortOpen: false,
                sqlPortOpen: false,
                sshPortOpen: false
            },
        };

        await KillAndRunScript(playerServer, script, killScript, server);
    }
}

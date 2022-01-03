import { NS } from '/../NetscriptDefinitions.js';
import { ServerManager } from '/servers/ServerManager.js';


export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();
    const serverManger = new ServerManager(ns);
    const flags = ns.flags([
        ["loop", false],
        ["script", ""],
        ["serverRam", 64]
    ]);


    const script = flags.script;
    ns.print(`script ${script}`);

    if (flags.loop) {
        while (true) {
            serverManger.ReleadAllServers();
            await RunHackAllServers(false);
            await ns.sleep(10000);
        }
    } else {
        await RunHackAllServers(true);
    }


    async function RunHackAllServers(killScript: boolean): Promise<void> {
        const servers = await serverManger.GetServers((checkServer) => !checkServer.name.startsWith("hacknet-node-"));

        for (const server of servers) {
            ns.print("Checking: " + server.name);
            ns.print(`script ${script}`);
            let targetServer = ns.getServer(server.name);

            if (!targetServer.sshPortOpen && ns.fileExists("BruteSSH.exe")) {
                ns.brutessh(server.name);
            }

            if (!targetServer.ftpPortOpen && ns.fileExists("FTPCrack.exe")) {
                ns.ftpcrack(server.name);
            }

            if (!targetServer.smtpPortOpen && ns.fileExists("relaySMTP.exe")) {
                ns.relaysmtp(server.name);
            }

            if (!targetServer.httpPortOpen && ns.fileExists("HTTPWorm.exe")) {
                ns.httpworm(server.name);
            }

            if (!targetServer.sqlPortOpen && ns.fileExists("SQLInject.exe")) {
                ns.sqlinject(server.name);
            }

            ns.print("reget server");
            targetServer = ns.getServer(server.name);

            if (!targetServer.hasAdminRights) {
                ns.print("Open ports " + targetServer.openPortCount + " Needed ports: " + targetServer.numOpenPortsRequired);
                if (targetServer.openPortCount >= targetServer.numOpenPortsRequired) {
                    ns.nuke(server.name);
                    targetServer = ns.getServer(server.name);

                } else {
                    ns.print("Need more ports open");
                }
            }

            if (targetServer.requiredHackingSkill <= ns.getPlayer().hacking) {
                if (targetServer.moneyMax !== 0) {
                    if (targetServer.hasAdminRights && targetServer.requiredHackingSkill <= ns.getPlayer().hacking) {
                        if (targetServer.maxRam > 0) {
                            await KillAndRunScript(server.name, script, killScript);
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

    async function KillAndRunScript(server: string, script: string, killScript: boolean, ...scriptArgs: (string | number | boolean)[]): Promise<void> {
        if (killScript) {
            if (ns.scriptKill(script, server)) {
                ns.print("Ram: " + ns.getServerUsedRam(server));
            } else {
                ns.print("No script killed");
            }
        } else {
            ns.print("Kill flag is false");
        }
        const targetServer = ns.getServer(server);
        ns.print(`server max ram ${targetServer.maxRam} - server used ram ${ns.getServerUsedRam(server)} - script used ram ${ns.getScriptRam(script, server)}`);
        const threads = Math.floor((targetServer.maxRam - ns.getServerUsedRam(server)) / ns.getScriptRam(script, server));

        if (threads > 0) {
            ns.print("Starting script: " + script);
            await ns.scp(script, "home", server);
            ns.exec(script, server, threads, ...scriptArgs);
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

        await KillAndRunScript(serverToUse, script, killScript, server);
    }
}

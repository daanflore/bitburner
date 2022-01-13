import { NS } from '/../NetscriptDefinitions.js';
import { IDatabase } from 'database/IDatabase.js';
import { LocalStorageDatabase } from 'database/LocalStorageDatabase.js';
import { ServerDbInfo, ServerInfo } from 'servers/ServerInfo.js';

export async function main(ns: NS): Promise<void> {
    const flags = ns.flags([
        ['refreshrate', 200],
        ['help', false],
        ['selfscan', false],
        ['servers', []],
        ['hackable', false],
        ['rooted', false]
    ]);

    if ((flags.selfscan !== true && flags.servers.length === 0) || flags.help) {
        ns.tprint("This script helps visualize the money and security of a server.");
        ns.tprint(`USAGE: run ${ns.getScriptName()} --servers SERVER_NAME[;SERVER_NAME2]`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} --servers n00dles`);
        return;
    }

    const database: IDatabase = new LocalStorageDatabase(ns, ServerDbInfo.Name);

    ns.tail();
    ns.disableLog('ALL');


    while (true) {
        ns.clearLog();
        let servers: Array<ServerInfo> = database.GetItem(ServerDbInfo.keys.all) ?? [];

        if (!flags.selfscan) {
            servers = servers.filter(serverInfo => flags.servers.includes(serverInfo.name));
        }

        for (const server of servers) {
            try {
                if (((flags.hackable && server.maxMoney > 0) || !flags.hackable) && ((flags.rooted && server.hasRoot) || !flags.rooted)) {
                    const minSec = server.minSec;
                    const sec = server.security;
                    ns.print(`${server.name}:`);

                    if (server.maxMoney === 0) {
                        ns.print(`server can not be hacked no money source`);
                    } else if (server.hasRoot) {

                        ns.print(` $_______: ${ns.nFormat(server.money, "$0.000a")} / ${ns.nFormat(server.maxMoney, "$0.000a")} (${(server.money / server.maxMoney * 100).toFixed(2)}%)`);
                        ns.print(` security: +${(sec - minSec).toFixed(2)}`);
                        ns.print(` skill___: ${ns.getHackingLevel()}/${server.hackLevel}`);
                        ns.print(` hack____: ${ns.tFormat(ns.getHackTime(server.name))} (t=${Math.ceil(ns.hackAnalyzeThreads(server.name, server.money))})`);
                        ns.print(` grow____: ${ns.tFormat(ns.getGrowTime(server.name))} (t=${Math.ceil(ns.growthAnalyze(server.name, server.maxMoney / server.money))})`);
                        ns.print(` weaken__: ${ns.tFormat(ns.getWeakenTime(server.name))} (t=${Math.ceil((sec - minSec) * 20)})`);
                        ns.print(` Ram_____: ${server.usedRam}/${server.maxRam} GB`);
                        //createDisplay(server);
                        //eval('document').getElementById(`${server}-hook-1`).innerHTML = ns.nFormat(ns.getRunningScript().onlineMoneyMade / ns.getRunningScript().onlineRunningTime, '$0.0a');
                    } else {
                        ns.print(` root____: ${server.hasRoot} `);
                    }
                }
            } catch {
                ns.print("problem reading all info");
            }
        }

        await ns.sleep(flags.refreshrate);
    }
}
import { NS } from '../../NetscriptDefinitions.js';
import { IDatabase } from 'database/IDatabase.js';
import { LocalStorageDatabase } from 'database/LocalStorageDatabase.js';
import { ServerDbInfo, ServerInfo } from 'servers/ServerInfo.js';

/** @param {NS} ns **/
export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    const args = ns.flags([["help", false]]);
    const database: IDatabase = new LocalStorageDatabase(ns, ServerDbInfo.Name);
    
    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const doc = eval('document'); // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');

    while (true) {
        try {
            const server = getBestServer(database.GetItem<Array<ServerInfo>>(ServerDbInfo.keys.nonHackNode)?.filter((server) => server.maxMoney > 0 && server.hackLevel <= ns.getHackingLevel() && server.hasRoot)?? []);
            const headers: string[] = [];
            const values: string[] = [];
            const scriptIncome = ns.getScriptIncome();

            // Add script income per second
            if (Array.isArray(scriptIncome)) {
                headers.push("ScrInc");
                headers.push(ns.nFormat(scriptIncome[0], '$0.0a') + '/sec');
            }

            // Add script exp gain rate per second
            headers.push("ScrExp");
            headers.push(ns.nFormat(ns.getScriptExpGain(), '0.0a') + '/sec');
            // TODO: Add more neat stuff
            headers.push("Hashes");
            headers.push(`${ns.nFormat(ns.hacknet.numHashes(), '0.0a')} /${ns.nFormat(ns.hacknet.hashCapacity(), '0.0a')}`);
            
            if(server !== undefined) {
                headers.push("Best server:");
                headers.push(server.name);
                headers.push(ns.nFormat(server.maxMoney, "$0.0a"));
            }

            headers.push(...ShowRamUsage("home"));

            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }

    function getBestServer(servers: Array<ServerInfo>): ServerInfo | undefined {
        let bestServer: ServerInfo | undefined;

        for(const server of servers) {
            if(bestServer === undefined || bestServer.maxMoney < server.maxMoney) {
                bestServer = server;
            }
        }

        return bestServer;        
    }

    function ShowRamUsage(server: string): string[] {
        const info: string[] = [];
        info.push(`${server} RAM usage`);
        
        for (const processInfo of ns.ps()){
            info.push(`${processInfo.filename} (${ns.getScriptRam(processInfo.filename, server) * processInfo.threads}GB)`);
        }

        return info;
    }
}
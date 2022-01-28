import { GetServerTree, ServerTreeNode } from 'servers/GetServerTree.js';

export async function main(ns: NS): Promise<void> {
    ns.disableLog("getHackingLevel");
    ns.disableLog("scan");
    ns.tail();
    const serverTree = GetServerTree(ns);
    await backDoorServer(serverTree);
    ns.connect("home");

    async function  backDoorServer(node: ServerTreeNode): Promise<void> {
        const server  =ns.getServer(node.name);
        if (!server.backdoorInstalled && server.requiredHackingSkill <= ns.getHackingLevel() && server.numOpenPortsRequired <= server.openPortCount && server.purchasedByPlayer === false) {
            const path = node.FindPathToServer();

            for(const serverToConnect of  path) {
                ns.connect(serverToConnect);
            }
            
            await ns.installBackdoor();
        }

        for(const child of node.children) {
            await backDoorServer(child);
        }
        
    }
}
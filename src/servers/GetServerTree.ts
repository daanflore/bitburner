
export function GetServerTree(ns : NS) : ServerTreeNode {
    const rootServer = ns.getHostname();
    return ScanServer(rootServer, undefined);

    function ScanServer(serverName: string, parent: ServerTreeNode | undefined): ServerTreeNode {
        const node = new ServerTreeNode(serverName, parent); 
        const childServers = ns.scan(serverName).filter(scannedServer => scannedServer !== parent?.name);

        for (const childServer of childServers) {
            node.children.push(ScanServer(childServer, node));
        }

        return node;
    }
}

export class ServerTreeNode{
    public  name: string;
    public children: Array<ServerTreeNode>;
    public parent: ServerTreeNode | undefined;

    constructor(name: string, parent: ServerTreeNode | undefined) {
        this.name = name;
        this.parent = parent;
        this.children = [];
    }

    /**
     * FindServer
     * name: string : ServerTreeNode    */
    public FindServer(name: string): ServerTreeNode | undefined {
        if(this.name === name) {
            return this;
        }

        for (const child of this.children) {
           const foundChild = child.FindServer(name);

           if( foundChild !== undefined) {
               return foundChild;
           }
        }

        return undefined;
    }

    public FindPathToServer(): Array<string> {
        const path: Array<string> = [];
        if(this.parent !== undefined) {
            path.push(...this.parent.FindPathToServer());
        }

        path.push(this.name);
        return path;
    }
}
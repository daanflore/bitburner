export class Server {
    name = "";
    portsReq = 0;
    hackLevel = 0;
    growTime = 0;
    maxMoney = 0;
    growth = 0;
    weakenTime = 0;
    hackTime = 0;
    minSec = 0;
    money = 0;
    security = 0;
    maxRam = 0;
    hasRoot = false;

    constructor(cname: string, cports: number) {
        this.name = cname;
        this.portsReq = cports;
    }
}
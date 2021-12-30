import { HacknetServer } from "/hacknet/HacknetInstance.js";
import { HacknetUpgradeEnum } from "/hacknet/HacknetUpgradeEnum.js";
import { HacknetUpgrade } from '../hacknet/HacknetUpgrade.js';
import { Hacknet, NS } from "/../NetscriptDefinitions.js";

export class HacknetManager {
    private _list: Array<HacknetServer> = [];
    private _hacknet: Hacknet;
    private _maxNodes: number;

    public get CurrentNumberOfNodes(): number {
        return this._hacknet.numNodes();
    }

    /**
     * Create a new instance of HacknetManager
     * @param {NS} ns
     */
    constructor(private ns: NS) {
        if (ns === undefined) {
            throw new Error("ns is required param");
        }

        this._hacknet = ns.hacknet;
        this._maxNodes = this._hacknet.maxNumNodes();

        for (let index = 0; index < this.CurrentNumberOfNodes; index++) {
            this._list.push(new HacknetServer(ns, index));
        }
    }

    /**
     * @returns {boolean} note if upgrade was a success
     */
    public UpgradeMostValuedHacknetNode(): boolean {
        const upgrades: Array<HacknetUpgrade> = [];
        let bestHacknetUpgrade: HacknetUpgrade = this.CreateHacknetUpgradeForCreate();

        for (const hacknetServer of this._list) {
            upgrades.push(hacknetServer.GetBestUpgrade());
        }

        for (const hackNetUpgrade of upgrades) {
            if (bestHacknetUpgrade === undefined || bestHacknetUpgrade.valueOfUpgrade < hackNetUpgrade.valueOfUpgrade) {
                bestHacknetUpgrade = hackNetUpgrade;
            }
        }

        if (bestHacknetUpgrade !== undefined) {
            return bestHacknetUpgrade.performUpgrade();
        }

        return false;
    }

    private CreateHacknetUpgradeForCreate(): HacknetUpgrade {
        const extraHashesPerSecond = this.ns.formulas.hacknetServers.hashGainRate(1, 0, 1, 1, this.ns.getPlayer().hacknet_node_money_mult * this.ns.getBitNodeMultipliers().HacknetNodeMoney);
        const cost = this._hacknet.getPurchaseNodeCost();
        const valueOfUpgrade = extraHashesPerSecond / cost;

        return {
            id: 0,
            cost: cost,
            valueOfUpgrade: valueOfUpgrade,
            extraHashesPerSecond: extraHashesPerSecond,
            type: HacknetUpgradeEnum.CreateNew,
            performUpgrade: () => this.CreateNewNode()
        };
    }

    public CreateNewNode(): boolean {
        const id = this._hacknet.purchaseNode();

        if(id !== -1) {
            this._list.push(new HacknetServer(this.ns, id));
            return true;
        }

        return false;
    }
} 
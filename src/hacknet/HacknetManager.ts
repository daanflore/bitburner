import { HacknetServer, HacknetUpgrade } from "/hacknet/HacknetInstance.js";
import { HacknetUpgradeEnum } from "/hacknet/HacknetUpgradeEnum.js";
import { Hacknet, NS } from "/../NetscriptDefinitions.js";
import { HacknetSettings } from "/hacknet/HacknetSettings.js";
import { Logger } from "/helpers/Logger.js";
import { LogLevelEnum } from "/LogLevelEnum.js";

export class HacknetManager {
    private _list: Array<HacknetServer> = [];
    private _hacknet: Hacknet;
    private _maxNodes: number;
    private _logger: Logger;
    private _hacknetSettings: HacknetSettings;

    public get CurrentNumberOfNodes(): number {
        return this._hacknet.numNodes();
    }

    /**
     * Create a new instance of HacknetManager
     * @param {NS} ns
     */
    constructor(private ns: NS, hacknetSettings?: HacknetSettings, logger?: Logger) {
        if (ns === undefined) {
            throw new Error("ns is required param");
        }

        this._hacknet = ns.hacknet;
        this._maxNodes = this._hacknet.maxNumNodes();
        this._hacknetSettings = hacknetSettings ?? new HacknetSettings(ns);
        this._logger = logger ?? new Logger(ns, this._hacknetSettings);
        
        for (let index = 0; index < this.CurrentNumberOfNodes; index++) {
            this._list.push(new HacknetServer(ns, index));
        }
    }

    /**
     * @returns {boolean} note if upgrade was a success
     */
    public UpgradeMostValuedHacknetNode(): boolean {
        const upgrades: Array<HacknetUpgrade> = [];
        let bestHacknetUpgrade: HacknetUpgrade | undefined = this.CreateHacknetUpgradeForCreate();

        for (const hacknetServer of this._list) {
            upgrades.push(hacknetServer.GetBestUpgrade());
        }

        for (const hackNetUpgrade of upgrades) {
            if (bestHacknetUpgrade === undefined || bestHacknetUpgrade.valueOfUpgrade < hackNetUpgrade.valueOfUpgrade) {
                bestHacknetUpgrade = hackNetUpgrade;
            }
        }

        if (bestHacknetUpgrade !== undefined) {
            const remainingMoney = this.ns.getPlayer().money - bestHacknetUpgrade.cost;
            this._logger.LogToScriptLog(`Best upgrade ${bestHacknetUpgrade.type.toString()} costs ${this.ns.nFormat(bestHacknetUpgrade.cost, '$0.000a')}`, LogLevelEnum.Info);
            this._logger.LogToScriptLog(`Player will have ${this.ns.nFormat(remainingMoney, '$0.000a')} remaining after upgrade`, LogLevelEnum.Debug);
            this._logger.LogToScriptLog(`Player needs to keep ${this.ns.nFormat(this._hacknetSettings.MinMoneyToKeep, '$0.000a')}`, LogLevelEnum.Debug);

            if (remainingMoney >= this._hacknetSettings.MinMoneyToKeep) {
                this._logger.LogToScriptLog(`Performing upgrade`, LogLevelEnum.Info);
                return bestHacknetUpgrade.performUpgrade();
            }
        }

        return false;
    }

    private CreateHacknetUpgradeForCreate(): HacknetUpgrade | undefined {
        if(this._maxNodes === this.CurrentNumberOfNodes) {
            return undefined;
        }

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
        if(this._maxNodes === this.CurrentNumberOfNodes) {
            this._logger.LogToScriptLog(`Reached max number of nodes`, LogLevelEnum.Debug);
            return false;
        }

        this._logger.LogToScriptLog(`Player will have ${this.ns.nFormat(this.ns.getPlayer().money - this._hacknet.getPurchaseNodeCost(), '$0.000a')} remaining after purchasing new node`, LogLevelEnum.Debug);

        if (this.ns.getPlayer().money - this._hacknet.getPurchaseNodeCost() < this._hacknetSettings.MinMoneyToKeep) {
            this._logger.LogToScriptLog(`Not enough remaining money after purchase needed ${this.ns.nFormat(this._hacknetSettings.MinMoneyToKeep, '$0.000a')}`, LogLevelEnum.Debug);
            return false;
        }

        const id = this._hacknet.purchaseNode();
        this._logger.LogToScriptLog(`New node purchased with id ${id}`, LogLevelEnum.Info);

        if (id !== -1) {
            this._list.push(new HacknetServer(this.ns, id));
            return true;
        }

        return false;
    }
} 
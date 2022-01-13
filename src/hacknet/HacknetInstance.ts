/*
    ns.getPlayer().hacknet_node_money_mult * ns.getBitNodeMultipliers().HacknetNodeMoney
    HacknetServersFormulas.hashGainRate()
    https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.hacknet.md
*/

import { Hacknet, NS } from '../../NetscriptDefinitions';
import { HacknetUpgradeEnum } from 'hacknet/HacknetUpgradeEnum.js';

export abstract class HacknetInstance {
    public abstract GetBestUpgrade(): HacknetUpgrade | undefined;
    public abstract PerformUpgrade(type: HacknetUpgradeEnum): void;
}

export class HacknetServer extends HacknetInstance {
    private hacknet: Hacknet;

    public get Level(): number {
        return this.hacknet.getNodeStats(this.id).level;
    }

    public get Ram(): number {
        return this.hacknet.getNodeStats(this.id).ram;
    }

    public get RamLevel(): number {
        return Math.log2(this.Ram);
    }

    public get RamUsed(): number {
        return this.hacknet.getNodeStats(this.id).ramUsed;
    }

    public get Cores(): number {
        return this.hacknet.getNodeStats(this.id).cores;
    }

    /**
     * Create a new instance of HacknetManager
     * @param {NS} ns
     * @param {number} id 
     */
    constructor(private ns: NS, public id: number) {
        if (ns === undefined) {
            throw new Error("ns is required param");
        }

        super();
        this.hacknet = ns.hacknet;
    }

    public GetBestUpgrade(): HacknetUpgrade | undefined {
        let bestUpgrade: HacknetUpgrade | undefined;

        for (const hackNetUpgrade of [this.GetRamHashGain(), this.GetLevelHashGain(), this.GetCoreHashGain()]) {
            if ((bestUpgrade === undefined && hackNetUpgrade !== undefined) || (bestUpgrade !== undefined && hackNetUpgrade !== undefined && bestUpgrade.valueOfUpgrade < hackNetUpgrade.valueOfUpgrade)) {
                bestUpgrade = hackNetUpgrade;
            }
        }

        return bestUpgrade;
    }

    public PerformUpgrade(type: HacknetUpgradeEnum): boolean {
        switch (type) {
            case HacknetUpgradeEnum.Level: {
                return this.hacknet.upgradeLevel(this.id, 1);
                break;
            }
            case HacknetUpgradeEnum.Ram: {
                return this.hacknet.upgradeRam(this.id, 1);
                break;
            }
            case HacknetUpgradeEnum.Core: {
                return this.hacknet.upgradeCore(this.id, 1);
                break;
            }
            case HacknetUpgradeEnum.CacheLevel: {
                return this.hacknet.upgradeCache(this.id, 1);
                break;
            }
        }

        throw new Error("No Valid upgradeType");
    }

    private GetRamHashGain(): HacknetUpgrade | undefined {
        return this.GetUpgradedHashGain(HacknetUpgradeEnum.Ram);
    }

    private GetLevelHashGain(): HacknetUpgrade | undefined {
        return this.GetUpgradedHashGain(HacknetUpgradeEnum.Level);
    }

    private GetCoreHashGain(): HacknetUpgrade | undefined {
        return this.GetUpgradedHashGain(HacknetUpgradeEnum.Core);
    }

    private GetUpgradeCost(upgradeType: HacknetUpgradeEnum): number {
        switch (upgradeType) {
            case HacknetUpgradeEnum.Level:
                return this.hacknet.getLevelUpgradeCost(this.id, 1);
            case HacknetUpgradeEnum.Ram:
                return this.hacknet.getRamUpgradeCost(this.id, 1);
            case HacknetUpgradeEnum.Core:
                return this.hacknet.getCoreUpgradeCost(this.id, 1);
        }

        throw new Error("No Valid upgradeType");
    }

    private GetUpgradedHashGain(upgradeType: HacknetUpgradeEnum): HacknetUpgrade | undefined {
        const upgradeCost = this.GetUpgradeCost(upgradeType);

        if (!isFinite(upgradeCost)) {
            return undefined;
        }

        const currentHashGain = this.ns.formulas.hacknetServers.hashGainRate(this.Level, this.RamUsed, this.Ram, this.Cores, this.ns.getPlayer().hacknet_node_money_mult * this.ns.getBitNodeMultipliers().HacknetNodeMoney);
        const level = upgradeType === HacknetUpgradeEnum.Level ? this.Level + 1 : this.Level;
        const ram = upgradeType === HacknetUpgradeEnum.Ram ? Math.pow(2, this.RamLevel + 1) : this.Ram;
        const cores = upgradeType === HacknetUpgradeEnum.Core ? this.Cores + 1 : this.Cores;
        const multipler = this.ns.getPlayer().hacknet_node_money_mult * this.ns.getBitNodeMultipliers().HacknetNodeMoney;
        const numberOfHashes = this.ns.formulas.hacknetServers.hashGainRate(level, this.RamUsed, ram, cores, multipler);
        const diffHashesPerSecond = numberOfHashes - currentHashGain;
        const valueOfUpgrade = diffHashesPerSecond / upgradeCost;

        return {
            id: this.id,
            type: upgradeType,
            cost: upgradeCost,
            extraHashesPerSecond: diffHashesPerSecond,
            valueOfUpgrade: valueOfUpgrade,
            performUpgrade: () => this.PerformUpgrade(upgradeType),
        };

    }
}


export interface HacknetUpgrade {
    id: number;
    type: HacknetUpgradeEnum;
    cost: number;
    extraHashesPerSecond: number;
    valueOfUpgrade: number;
    performUpgrade: () => boolean;
}

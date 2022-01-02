import { Hacknet, NS } from "/../NetscriptDefinitions.js";
import { HacknetSettings } from "hacknet/HacknetSettings.js";

export class HashManager {
    private _hacknet: Hacknet;
    private _hacknetSettings: HacknetSettings;
    /**
     * Create a new instance of HashManager
     * @param {NS} ns
     */
    constructor(private ns: NS, hacknetSettings?: HacknetSettings) {
        if (ns === undefined) {
            throw new Error("ns is required param");

        }

        this._hacknet = ns.hacknet;
        this._hacknetSettings = hacknetSettings ?? new HacknetSettings(ns);
    }

    public CheckReachedHashLimit(): boolean {
        const hasHacknetNodes = this._hacknet.hashCapacity() !== 0;
        const hasReachedConfiguredLimit = (this._hacknet.numHashes() >= (this._hacknet.hashCapacity() * this._hacknetSettings.PercentageToFill));
        const hasReachedLimit = this._hacknet.hashCapacity() === this._hacknet.numHashes();
        return hasHacknetNodes && (hasReachedConfiguredLimit || hasReachedLimit);
    }

    public SpendHashes(upgrade: string, target?: string | undefined): boolean {
        if (this._hacknet.getHashUpgrades().includes(upgrade)) {
            return this._hacknet.spendHashes(upgrade, target);
        }

        return false;
    }
} 
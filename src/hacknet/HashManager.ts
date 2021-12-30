import { Hacknet, NS } from "/../NetscriptDefinitions.js";
import { ApplicationSettings } from "/ApplicationSettings.js";

export class HashManager {
    private _hacknet: Hacknet;
    private _applicationSettings;
    /**
     * Create a new instance of HashManager
     * @param {NS} ns
     */
    constructor(private ns: NS) {
        if (ns === undefined) {
            throw new Error("ns is required param");
        }

        this._hacknet = ns.hacknet;
        this._applicationSettings = ApplicationSettings;
    }

    public CheckReachedHashLimit(): boolean {
        return (this._hacknet.numHashes() >= (this._hacknet.hashCapacity() * this._applicationSettings.HacknetSettings.PercentageToFill));
    }

    public SpendHashes(upgrade: string, target?: string | undefined): boolean {
        if (this._hacknet.getHashUpgrades().includes(upgrade)) {
            return this._hacknet.spendHashes(upgrade, target);
        }
        
        return false;
    }
} 
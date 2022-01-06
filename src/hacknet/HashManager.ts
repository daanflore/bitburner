import { Hacknet, NS } from "/../NetscriptDefinitions.js";
import { HacknetSettings } from "hacknet/HacknetSettings.js";
import { Logger } from "helpers/Logger.js";
import { LogLevelEnum } from "/LogLevelEnum.js";

export class HashManager {
    private _hacknet: Hacknet;
    private _hacknetSettings: HacknetSettings;
    private _logger: Logger;
    /**
     * Create a new instance of HashManager
     * @param {NS} ns
     */
    constructor(private ns: NS, hacknetSettings?: HacknetSettings, logger?: Logger) {
        if (ns === undefined) {
            throw new Error("ns is required param");

        }

        this._hacknet = ns.hacknet;
        this._hacknetSettings = hacknetSettings ?? new HacknetSettings(ns);
        this._logger = logger ?? new Logger(ns, this._hacknetSettings);
    }

    public CheckHasMinimumHashesStored(): boolean {
        const hasHacknetNodes = this._hacknet.hashCapacity() !== 0;
        const hasReachedConfiguredLimit = (this._hacknet.numHashes() >= (this._hacknet.hashCapacity() * this._hacknetSettings.PercentageToFill));
        this._logger.LogToScriptLog(`Has hacknodes ${hasHacknetNodes} and has reached configured maximum ${hasReachedConfiguredLimit}`, LogLevelEnum.Debug);
        return hasHacknetNodes && hasReachedConfiguredLimit;
    }

    public CheckReachedHashLimit(): boolean {
        const hasReachedLimit = this._hacknet.hashCapacity() * 0.99 <= this._hacknet.numHashes();
        this._logger.LogToScriptLog(`Has reached hash limit ${hasReachedLimit}`, LogLevelEnum.Debug);
        return this.CheckHasMinimumHashesStored() && hasReachedLimit;
    }

    public SpendHashes(upgrade: string, target?: string | undefined): boolean {
        this._logger.LogToScriptLog(`Spending hashes on ${upgrade} ${target}`, LogLevelEnum.Info);

        if (this._hacknet.getHashUpgrades().includes(upgrade)) {
            return this._hacknet.spendHashes(upgrade, target);
        }

        return false;
    }
} 
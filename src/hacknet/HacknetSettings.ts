import { NS } from "/../NetscriptDefinitions.js";
import { SettingsObject } from "/Database/SettingsObject.js";
import { LogLevelEnum } from "LogLevelEnum.js";

export class HacknetSettings extends SettingsObject {
    public PercentageToFill: number;
    public UpgradeName: string;
    public Target: string | undefined;
    public LogLevel: LogLevelEnum

    /**
     *
     */
    constructor(ns: NS) {
        super(ns, HacknetSettings.name);
        this.UpgradeName = "Sell for Money";
        this.PercentageToFill = 0.9;
        this.LogLevel = LogLevelEnum.Debug;
        this.ReadValuesFromDatabase();
        this.StoreSettingsInDatabase();
    }
}
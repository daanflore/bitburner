import { NS } from "/../NetscriptDefinitions.js";
import { SettingsObject } from "database/SettingsObject.js";
import { LogLevelEnum } from "LogLevelEnum.js";
import { ILoggerSettings } from "helpers/ILoggerSettings.js";

export class HacknetSettings extends SettingsObject implements ILoggerSettings {
    public PercentageToFill: number;
    public UpgradeName: string;
    public Target: string | undefined;
    public LogLevel: LogLevelEnum;
    public MinMoneyToKeep: number;

    /**
     *
     */
    constructor(ns: NS) {
        super(ns, HacknetSettings.name);
        this.UpgradeName = "Sell for Money";
        this.PercentageToFill = 0.9;
        this.LogLevel = LogLevelEnum.Debug;
        this.MinMoneyToKeep = 0;
        this.ReadValuesFromDatabase();
        this.StoreSettingsInDatabase();
    }
}
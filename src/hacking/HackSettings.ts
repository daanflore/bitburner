import { NS } from "/../NetscriptDefinitions.js";
import { SettingsObject } from "database/SettingsObject.js";
import { LogLevelEnum } from "LogLevelEnum.js";
import { ILoggerSettings } from "helpers/ILoggerSettings.js";

export class HackSettings extends SettingsObject implements ILoggerSettings {
    public MoneyThresholMulitplier: number;
    public SecurityMargen: number;
    public LogLevel: LogLevelEnum;
    
    /**
     *
     */
    constructor(ns: NS) {
        super(ns, HackSettings.name);
        this.MoneyThresholMulitplier = 0.75;
        this.SecurityMargen = 5;
        this.LogLevel = LogLevelEnum.Debug;
        this.ReadValuesFromDatabase();
        this.StoreSettingsInDatabase();
    }
}
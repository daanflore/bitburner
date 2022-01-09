import { CrimeEnum } from "/singularity/CrimeEnum.js";
import { NS } from "/../NetscriptDefinitions.js";
import { SettingsObject } from "/database/SettingsObject.js";
import { ILoggerSettings } from "/helpers/ILoggerSettings.js";
import { LogLevelEnum } from "LogLevelEnum.js";

export class CrimeSettings extends SettingsObject implements ILoggerSettings {
    LogLevel: LogLevelEnum;
    CrimeType: CrimeEnum;
    MinSuccessRate: number;
    KeepRunning: boolean;
    Priority: "karma" | "money";

    /**
     *
     */
    constructor(private _ns: NS) {
        super(_ns, CrimeSettings.name);
        this.LogLevel = LogLevelEnum.Info;
        this.CrimeType = CrimeEnum.ShopLift;
        this.MinSuccessRate = 0.9;
        this.KeepRunning = true; 
        this.Priority = "karma";
        this.ReadValuesFromDatabase();
        this.StoreSettingsInDatabase();
    }
}
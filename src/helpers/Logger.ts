import { NS } from "/../NetscriptDefinitions.js";
import { LogLevelEnum } from "LogLevelEnum.js";
import { ILoggerSettings } from "helpers/ILoggerSettings.js";

export class Logger {
    private _indents = 0;
    /**
     *
     */
    constructor(private _ns: NS, private _logsetting: ILoggerSettings) {
    }

    public LogToScriptLog(log: string, requiredLogLevel: LogLevelEnum): void {
        if(this._logsetting.LogLevel >= requiredLogLevel) {
            this._ns.print(`${"\t".repeat(this._indents)}${log}`);
        }
    }

    public AddIndent(): void {
        this._indents++;
    }

    public RemoveIndent(): void {
        this._indents--;
    }
}
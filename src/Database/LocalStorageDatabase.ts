import { IDatabase } from "database/IDatabase.js";
import { NS } from "/../NetscriptDefinitions.js";

export class LocalStorageDatabase implements IDatabase {
    private _callBack: ((e: StorageEvent) => void) | undefined = undefined;
    /**
     *
     */
    constructor(private _ns: NS, private _databaseName: string, callback?: (key: string | undefined, value: string | null) => void) {
        const windowHandle = eval('window');

        if (callback !== undefined) {
            this._callBack = function (e: StorageEvent) {
                if (e.key?.startsWith(_databaseName)) {
                    return callback(e.key.split('-').at(-1), e.newValue !== null? JSON.parse(e.newValue) : e.newValue);
                }
            };
            _ns.atExit(() => windowHandle.removeEventListener('storage', this._callBack));
            windowHandle.addEventListener('storage', this._callBack);
        }
    }

    public GetItem<T>(key: string): T | null {
        const data = localStorage.getItem(`${this._databaseName}-${key}`);
        if (!data) return null;
        let obj: T | null;

        try {
            obj = <T>JSON.parse(data);
        } catch (error) {
            obj = null;
        }

        return obj;
    }

    public SetItem<T>(key: string, value: T): void {
        localStorage.setItem(`${this._databaseName}-${key}`, JSON.stringify(value));
    }

    public ContainsItem(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}
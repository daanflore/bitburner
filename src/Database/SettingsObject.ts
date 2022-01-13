import { LocalStorageDatabase } from "database/LocalStorageDatabase.js";
import { NS } from "/../NetscriptDefinitions.js";
import { IDatabase } from "database/IDatabase.js";

export abstract class SettingsObject {
    [key: string]: any;
    protected _database: IDatabase;
    protected _parentScriptName: string;
    /**
     *
     */
    constructor(ns: NS, databaseName: string) {
        this._parentScriptName = ns.getScriptName();
        this._database = new LocalStorageDatabase(ns, databaseName, (key, value) => this.SetValue(this, key, value));
    }

    protected ReadValuesFromDatabase(): void {
        for (const prop of Object.keys(this)) {
            if (!prop.startsWith("_")) {
                const value = this._database.GetItem(prop);

                if (value !== null) {
                    this[prop] = value;
                }
            }
        }
    }

    protected SetValue(objectToAlter: SettingsObject, key: string | undefined, value: string | null): void {
        if (key !== undefined && value !== null) {
            console.log(`[${this._parentScriptName}]Altering "${key} "to "${value}"`);
            objectToAlter[key] = value;
        }
    }

    protected StoreSettingsInDatabase(force = false): void {
        for (const prop of Object.keys(this)) {
            if (!prop.startsWith("_") && (force || !this._database.ContainsItem(prop))) {
                this._database.SetItem(prop, this[prop]);
            }
        }
    }
}
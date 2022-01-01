import { LocalStorageDatabase } from "/Database/LocalStorageDatabase.js";
import { NS } from "/../NetscriptDefinitions.js";
import { IDatabase } from "/Database/IDatabase.js";

export abstract class SettingsObject {
    [key: string]: any;
    protected _database: IDatabase;
    protected _parentScriptName: string;
    /**
     *
     */
    constructor(ns: NS, databaseName: string) {
        this._parentScriptName = ns.getScriptName();
        //this._ns = ns.ps;
        this._database = new LocalStorageDatabase(ns, databaseName, (key, value) => this.SetValue(this, key, value));
    }

    protected ReadValuesFromDatabase(): void {
        for (const prop of Object.keys(this)) {
            if (!prop.startsWith("_")) {
                this[prop] = this._database.GetItem(prop);
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
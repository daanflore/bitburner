export interface IDatabase {
    GetItem<T>(key: string): T | null;
    SetItem<T>(key: string, value: T): void;
    ContainsItem(key: string): boolean;
}
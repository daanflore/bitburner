import { CrimeSettings } from '/singularity/CrimeSettings.js';
import { CrimeStats, NS } from '/../NetscriptDefinitions.js';
import { CrimeEnum } from '/singularity/CrimeEnum.js';

export class CrimeManager {
    private _crimeSettings: CrimeSettings;
    /**
     *
     */
    constructor(private _ns: NS, crimeSettings?: CrimeSettings) {
        this._crimeSettings = crimeSettings ?? new CrimeSettings(_ns);
    }

    public GetBestCrime(priority: "karma" | "money"): CrimeStats | undefined {
        const CrimeValues: Array<string> = Object.values(CrimeEnum);
        let crimes: Array<CrimeStats> = [];

        for (const crimeName of CrimeValues) {
            crimes.push(this._ns.getCrimeStats(crimeName));
        }

        const sortFunction = priority === "karma" ? this.SortOnKarma : this.SortOnMoneyPerSecond;
        crimes = crimes.sort(sortFunction);

        for (const crime of crimes) {
            if(this._ns.getCrimeChance(crime.type) >= this._crimeSettings.MinSuccessRate){
                return crime;
            }
        }

        return undefined;
    }

    public PerformCrime(crimeStats: CrimeStats): [boolean, number] {
        if(!this._ns.isBusy()) {
            return [true, this._ns.commitCrime(crimeStats.type)];
        } else {
            return [false, 0];
        }
    }

    private SortOnKarma(first: CrimeStats, second: CrimeStats): number {
        return (second.karma/ second.time) - (first.karma/ first.time);
    }

    private SortOnMoneyPerSecond(first: CrimeStats, second: CrimeStats): number {
        return (second.money / second.time) - (first.money / first.time);
    }
}
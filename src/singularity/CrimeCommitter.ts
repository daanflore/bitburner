/* eslint-disable no-alert */
import { CrimeManager } from '/singularity/CrimeManager.js';
import { CrimeSettings } from '/singularity/CrimeSettings.js';
import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns : NS) : Promise<void> {
    const crimeSettings = new CrimeSettings(ns);
    const crimeManager = new CrimeManager(ns, crimeSettings);

    if(ns.isBusy()) {
        alert("already doing work");
        return;
    }

    while(crimeSettings.KeepRunning) {
        const crime = crimeManager.GetBestCrime(crimeSettings.Priority);

        if(crime !== undefined) {
            const result = crimeManager.PerformCrime(crime);

            if(result[0]) {
                await ns.sleep(result[1]);
            } else {
                await ns.sleep(1000);
            }
        } else {
            alert("No valid crime found");
            return;
        }
    }
}
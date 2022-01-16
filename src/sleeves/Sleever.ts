import { SleeveManager } from 'sleeves/SleeveManager.js';
import { NS } from '/../NetscriptDefinitions.js';

export function main(ns : NS) : void {
    const sleeveManager: SleeveManager = new SleeveManager(ns);

    for (let i = 0; i < sleeveManager.NumberOfSleeves; i++) {
        sleeveManager.InstallAugumentations(i);
    }
}
import { BladeburnerManager } from 'bladeburner/BladeburnerManager.js';
import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns : NS) : Promise<void> {
    const bladeBurner = new BladeburnerManager(ns);
    bladeBurner.ContinueAction();
}
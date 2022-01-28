import { BladeburnerManager } from 'bladeburner/BladeburnerManager.js';
import { BladeburnerAction } from 'bladeburner/BladeburnerClass.js';
import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns: NS): Promise<void> {
    const bladeBurner = new BladeburnerManager(ns);
    let currentAction: BladeburnerAction | undefined;

    while (true) {
        const result = bladeBurner.ActionToPerform("Operations");

        if (currentAction === undefined || currentAction.Name !== result.Name || currentAction.Type !== result.Type) {
            currentAction = result;
            bladeBurner.RunBladeBurnerAction(result);
        } else {
            currentAction = result;
        }

        await ns.sleep(result.Duration);
    }
}
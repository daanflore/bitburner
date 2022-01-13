import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns : NS) : Promise<void> {
    await ns.sleep(<number>ns.args[1]);
    await ns.weaken(<string>ns.args[0]);
}
import { NS } from '../../NetscriptDefinitions';

export async function main(ns: NS): Promise<void> {
    if (typeof ns.args[0] === "string") {
        ns.hack(ns.args[0]);
    }
}
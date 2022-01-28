export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    const stanek = ns.stanek;

    while (true) {
        const activeFragments = stanek.activeFragments();
        const test = activeFragments.map(fragment => fragment.numCharge);
        let maxCharge = Math.max(...test);
        maxCharge += 1;

        for (const fragment of activeFragments) {
            let timesCharged = 0;
            while (maxCharge > fragment.numCharge + timesCharged) {
                await stanek.charge(fragment.x, fragment.y);
                timesCharged += 1;
            }
        }

        await ns.sleep(0);
    }
}
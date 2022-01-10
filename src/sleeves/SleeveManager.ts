import { NS, Sleeve } from '/../NetscriptDefinitions.js';

export class SleeveManager {
    private sleeve: Sleeve;

    public get NumberOfSleeves(): number {
        return this.sleeve.getNumSleeves();
    }

    /**
     *
     */
    constructor(private _ns: NS) {
        this.sleeve = _ns.sleeve;
    }

    /**
     * InstallAugumentations
     */
    public InstallAugumentations(sleeveNumber: number): void {
        const augumentations = this.sleeve.getSleevePurchasableAugs(sleeveNumber);

        for (const augumentation of augumentations) {
            this.sleeve.purchaseSleeveAug(sleeveNumber, augumentation.name);
        }
    }
}
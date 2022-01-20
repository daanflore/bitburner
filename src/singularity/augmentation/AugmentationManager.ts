import { NS } from '/../NetscriptDefinitions.js';

export class AugmentationManager {

    /**
     *
     */
    constructor(private _ns: NS) {

    }

    /**
     * GetInstalledAugmentations: string []   */
    public GetInstalledAugmentations(): string[] {
        return this._ns.getOwnedAugmentations(true);
    }

    public GetAugmentationsToInstall(): Augmentation[] {
        const Augmentations: Augmentation[] = [];
        const installedAugmentations = this.GetInstalledAugmentations();

        for (const faction of this._ns.getPlayer().factions) {
            const AugmentationsOfFaction = this._ns.getAugmentationsFromFaction(faction).filter(Augmentation => !installedAugmentations.includes(Augmentation));

            for (const aug of AugmentationsOfFaction) {
                Augmentations.push(new Augmentation(aug, faction, this._ns.getAugmentationPrice(aug), this._ns.getAugmentationRepReq(aug)));
            }
        }

        return Augmentations;
    }

    public BuyAugumentation(augmentation: Augmentation): boolean {
        if (this._ns.getPlayer().money < augmentation.price || this._ns.getFactionRep(augmentation.faction) < augmentation.reputation) {
            return false;
        }

        if (this.GetInstalledAugmentations().includes(augmentation.name)) {
            return true;
        }

        return this._ns.purchaseAugmentation(augmentation.faction, augmentation.name);
    }

    public GetInterestingFactionsWithAugmentations(): Map<string, Augmentation[]> {
        const augmap = new Map<string, Augmentation[]>();

        const installedAugmentations = this.GetInstalledAugmentations();

        for (const faction of this._ns.checkFactionInvitations()) {
            const AugmentationsOfFaction = this._ns.getAugmentationsFromFaction(faction).filter(Augmentation => !installedAugmentations.includes(Augmentation));
            const augmentations: Augmentation[] = [];

            for (const aug of AugmentationsOfFaction) {
                augmentations.push(new Augmentation(aug, faction, this._ns.getAugmentationPrice(aug), this._ns.getAugmentationRepReq(aug)));
            }

            if(augmentations.length > 0) {
                augmap.set(faction, augmentations);
            }
        } 
        
        return augmap;
    }
}

export class Augmentation {
    name: string;
    faction: string;
    price: number;
    reputation: number;

    /**
     *
     */
    constructor(name: string, faction: string, price: number, reputation: number) {
        this.name = name;
        this.faction = faction;
        this.price = price;
        this.reputation = reputation;
    }
}
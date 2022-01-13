import { AugmentationManager } from 'singularity/augmentation/AugmentationManager.js';
import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns: NS): Promise<void> {
    const augmentationManager = new AugmentationManager(ns);

    const augmentationToInstall = augmentationManager.GetAugmentationsToInstall().sort((aug1, aug2) => aug2.price - aug1.price);

    for (const aug of augmentationToInstall) {
        augmentationManager.BuyAugumentation(aug);
        await ns.sleep(0);
    }
}
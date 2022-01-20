import { AugmentationManager } from 'singularity/augmentation/AugmentationManager.js';
import { NS } from '/../NetscriptDefinitions.js';

export function main(ns: NS): void {
    const augmentationManager = new AugmentationManager(ns);
    const result = augmentationManager.GetInterestingFactionsWithAugmentations();
    
    for (const faction of result.keys()) {
        ns.joinFaction(faction);
    }
}
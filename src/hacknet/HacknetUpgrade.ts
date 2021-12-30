import { HacknetUpgradeEnum } from "/hacknet/HacknetUpgradeEnum.js";

export interface HacknetUpgrade {
    id: number;
    type: HacknetUpgradeEnum;
    cost: number;
    extraHashesPerSecond: number;
    valueOfUpgrade: number;
    performUpgrade: () => boolean;
}
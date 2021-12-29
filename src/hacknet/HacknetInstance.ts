/*
    ns.getPlayer().hacknet_node_money_mult * ns.getBitNodeMultipliers().HacknetNodeMoney
    HacknetServersFormulas.hashGainRate()
    https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.hacknet.md
*/ 

import { Hacknet, NS } from '../../NetscriptDefinitions';

export abstract class HacknetInstance {
    public abstract GetBestUpgrade(): HacknetUpgrade;
}

export class HacknetServer extends HacknetInstance {
    private hacknet: Hacknet;
   /**
    *
    */
   constructor(private ns : NS) {
       super();
       this.hacknet = ns.hacknet;
       //this.hacknet.
   }

   public GetBestUpgrade(): HacknetUpgrade {
        return {
            type: HacknetUpgrade.Ram,
            cost: 1,
            gain: 1,
        };
    }
}

export class HacknetNode {

}

export interface HacknetUpgrade {
    type: HacknetUpgrade;
    cost: number;
    gain: number;
}

export enum HacknetUpgrade {
    Level = 1,
    Ram,
    Cores,
    CacheLevel,
}
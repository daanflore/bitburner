import { Bladeburner, NS, Player } from "/../NetscriptDefinitions.js";

export class BladeburnerManager {
    private _bladeburner: Bladeburner;
    /**
     *
     */
    constructor(private _ns: NS) {
        this._bladeburner = _ns.bladeburner;
    }

    public ContinueAction(): void {
        const bladeburnerCurAction = this._bladeburner.getCurrentAction();
        const type = bladeburnerCurAction.type;
        const name = bladeburnerCurAction.name;
        const staminaPercentage = this.getStaminaPercentage();
        const healthPercentage = this.getHealthPercentage();

        console.log(staminaPercentage);
        console.log(healthPercentage);
    }

    public getStaminaPercentage(): number {
        const res = this._bladeburner.getStamina();
        return res[0] / res[1];
    }

    public getHealthPercentage(): number {
        const maxhealth = this._ns.getPlayer().max_hp;
        const health = this._ns.getPlayer().hp;
        return health / maxhealth;
    }
}
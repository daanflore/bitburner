import { BladeburnerAction } from "/bladeburner/BladeburnerClass.js";
import { Bladeburner, NS } from "/../NetscriptDefinitions.js";

export class BladeburnerManager {
    private _bladeburner: Bladeburner;
    private _performReduceCityChaos: boolean;
    private _performHeal: boolean;
    private _recoverStamina: boolean;
    /**
     *
     */
    constructor(private _ns: NS) {
        this._bladeburner = _ns.bladeburner;
        this._performReduceCityChaos = false;
        this._performHeal = false;
        this._recoverStamina = false;
    }

    public ActionToPerform(type: string): BladeburnerAction {
        const staminaPercentage = Math.round(this.getStaminaPercentage() * 100) / 100;
        const healthPercentage = Math.round(this.getHealthPercentage() * 100) / 100;
        const cityChaos = this._bladeburner.getCityChaos(this._bladeburner.getCity());

        if (staminaPercentage <= 0.45 || this._recoverStamina) {
            if (staminaPercentage === 1) {
                this._recoverStamina = false;
            } else {
                this._recoverStamina = true;
            }

            if (this._recoverStamina) {
                return this.InitBladeBurner("general", "Training");
            }
        }

        if (healthPercentage <= 0.45 || this._performHeal) {
            if (healthPercentage === 1) {
                this._performHeal = false;
            } else {
                this._performHeal = true;
            }

            if (this._performHeal) {
                return this.InitBladeBurner("general", "Hyperbolic Regeneration Chamber");
            }
        }

        if (cityChaos > 8 || this._performReduceCityChaos) {
            if (cityChaos === 0) {
                this._performReduceCityChaos = false;
            } else {
                this._performReduceCityChaos = true;
            }

            if (this._performReduceCityChaos) {
                return this.InitBladeBurner("general", "Diplomacy");
            }
        }

        if (type === "contract") {
            return this.getBestContract();
        } else {
            return this.getBestOperation();
        }
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

    public getBestContract(): BladeburnerAction {
        const contractNames = this._bladeburner.getContractNames();
        const contracts: Array<BladeburnerAction> = [];
        contractNames.forEach((value) => {
            contracts.push(this.InitBladeBurner("Contract", value));
        });

        const ContractsWithActions = contracts.filter(contract => contract.NubmerActionsRemaining !== 0);

        if (ContractsWithActions.length === 0) {
            return this.GenerateContracts();
        }

        return ContractsWithActions.filter(temp => temp.NubmerActionsRemaining !== 0).sort(temp => temp.MaxSuccess)[0];
    }

    public getBestOperation(): BladeburnerAction {
        const contractNames = this._bladeburner.getOperationNames();
        const contracts: Array<BladeburnerAction> = [];
        contractNames.forEach((value) => {
            contracts.push(this.InitBladeBurner("Operation", value));
        });

        const ContractsWithActions = contracts.filter(contract => contract.NubmerActionsRemaining !== 0);

        if (ContractsWithActions.length === 0) {
            return this.GenerateContracts();
        }

        return ContractsWithActions.filter(temp => temp.NubmerActionsRemaining !== 0).sort(temp => temp.MaxSuccess)[0];
    }

    public RunBladeBurnerAction(action: BladeburnerAction): boolean {
        return this._bladeburner.startAction(action.Type, action.Name);
    }

    private InitBladeBurner(type: string, name: string): BladeburnerAction {
        const successChances = this._bladeburner.getActionEstimatedSuccessChance(type, name);
        
        return {
            Type: type,
            Name: name,
            MaxSuccess: successChances[0],
            MinSuccess: successChances[1],
            NubmerActionsRemaining: this._bladeburner.getActionCountRemaining(type, name),
            Duration: this._bladeburner.getActionTime("general", "Training") / (this._bladeburner.getBonusTime() !== 0 ? 5 : 1)
        };
    }

    private GenerateContracts(): BladeburnerAction {
        return this.InitBladeBurner("general", "Incite Violence");
    }
}
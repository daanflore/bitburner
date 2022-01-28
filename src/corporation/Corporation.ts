const sleepTime = 10000;

export async function main(ns: NS): Promise<void> {
    let boolOptimal = false;
    ns.tail();
    const corporation = ns.corporation;

    const corporateInfo = corporation.getCorporation();
    for (const division of corporateInfo.divisions) {
        ns.print("Division " + division.name);

        for (const city of division.cities) {
            ns.print("city " + city);

            for (const materialName of corporationTypeMaterials[division.type]) {
                ns.print("material " + materialName);
                let startMultiplier = 3;
                boolOptimal = false;
                let mpIncrease = 0;

                while (!boolOptimal) {
                    const currentMultiplierBest = await CalcBestPrice(startMultiplier);

                    if (currentMultiplierBest) {
                        if (startMultiplier > 0) {
                            startMultiplier -= 1;
                        } else {
                            boolOptimal = true;
                        }
                    }


                    async function CalcBestPrice(exponent: number): Promise<boolean> {
                        let keepCurrentExponent = true;
                        let hasReachedMax = false;
                        let hasReachedMin = false;

                        while (keepCurrentExponent) {
                            const material = corporation.getMaterial(division.name, city, materialName);
                            debugger;
                            
                            if (hasReachedMax && hasReachedMin) {
                                keepCurrentExponent = false;
                            }
                            else if (material.prod > material.sell) {
                                mpIncrease = mpIncrease - (1 * Math.pow(10, exponent));
                                hasReachedMax = true;

                                if (mpIncrease <= 0) {
                                    corporation.sellMaterial(division.name, city, materialName, "MAX", `MP`);
                                    await ns.sleep(sleepTime);
                                    return true;
                                }
                            } else {
                                mpIncrease = mpIncrease + (1 * Math.pow(10, exponent));
                                hasReachedMin = true;
                            }

                            if (!boolOptimal) {
                                
                                corporation.sellMaterial(division.name, city, materialName, "MAX", `MP+${mpIncrease}`);
                                ns.print("new price  " + `MP+${mpIncrease}`);
                            }

                            await ns.sleep(sleepTime);
                        }

                        return true;
                    }
                }
            }
        }
    }


}


const corporationTypeMaterials: Map = {

    'Agriculture': ["Food", "Plants"],

};

interface Map {
    [key: string]: Array<string>;
}
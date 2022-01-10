import { NS } from '../NetscriptDefinitions';

export async function main(ns: NS): Promise<void> {
    console.log(ns.getPlayer().location);
    await ns.sleep(10000);

    if (ns.getPlayer().location === "Noodle Bar") {
        const element = eval('document.getElementsByClassName("MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root css-6zec3o")[5]');
        const prop = Object.keys(element).filter(key => key.startsWith("__reactProps"))[0];
        while (ns.getPlayer().location === "Noodle Bar") {
            element[prop].onClick();
            await ns.sleep(0);
        }
    }

    //document.getElementsByClassName("MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root css-6zec3o")[5].__reactProps$sf0eybq2ctj.onClick()
}
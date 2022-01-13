import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns : NS) : Promise<void> {
    const element = eval('document.getElementsByClassName("MuiDrawer-root MuiDrawer-docked css-v3syqg")[0].parentElement');
    const prop = Object.keys(element).filter(key => key.startsWith("__reactProps"))[0];
    element[prop].children[0].props.router.toDevMenu();
    //eval('document.getElementsByClassName("MuiDrawer-root MuiDrawer-docked css-v3syqg")[0].parentElement.__reactProps$pthycxf4glo.children[0].props.router.toDevMenu();');
}
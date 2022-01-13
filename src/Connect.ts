import { NS } from '/../NetscriptDefinitions.js';

export async function main(ns: NS): Promise<void> {
    const target = ns.args[0];
    const paths: any = { "home": "" };
    const queue = Object.keys(paths);
    let name;
    let output : string;
    let pathToTarget : any;

    while ((name = queue.shift())) {
        const path = paths[name];
        const scanRes = ns.scan(name);

        for (const newSv of scanRes) {
            if (paths[newSv] === undefined) {
                queue.push(newSv);
                paths[newSv] = `${path},${newSv}`;
                if (newSv == target)
                    pathToTarget = paths[newSv].substr(1).split(",");

            }
        }
    }

    output = "home; ";
    pathToTarget.forEach((server: any) => output += " connect " + server + ";");
    const terminalInput = eval("document").getElementById("terminal-input");
    terminalInput.value = output;
    const handler = Object.keys(terminalInput)[1];
    terminalInput[handler].onChange({ target: terminalInput });
    terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}
const documentConst = eval('document') as Document;

export function CreateStatDisplay(hookName: string, displayText = "", border = true, color = ""): void {
    if (documentConst.getElementById(hookName + '-extra-hook-0') !== null) {
        throw new Error("Hook already found");
    }

    const overviewExtraHook = documentConst.getElementById('overview-extra-hook-0');
    const firstParent = overviewExtraHook?.parentElement?.parentElement;

    if (firstParent === null || firstParent === undefined) {
        throw new Error("Something went wrong");
    }

    const newRow = firstParent.cloneNode(true) as HTMLElement;
    const children = newRow.children;
    const hook0 = children[0].firstElementChild as HTMLElement;
    const hook1 = children[1].firstElementChild as HTMLElement;
    const hook2 = children[2].firstElementChild as HTMLElement;
    hook0.id = hookName + '-extra-hook-0';
    hook0.innerHTML = displayText;
    hook1.id = hookName + '-extra-hook-1';
    hook2.id = hookName + '-extra-hook-2';

    if (!border) {
        const styleParent0 = children[0] as HTMLElement;
        const styleParent1 = children[1] as HTMLElement;
        styleParent0.style.setProperty('border-bottom', '0px');
        styleParent1.style.setProperty('border-bottom', '0px');
    }

    if (color.length != 0) {
        hook0.style.setProperty('color', color);
        hook1.style.setProperty('color', color);
        hook2.style.setProperty('color', color);
    }

    firstParent.parentElement?.insertBefore(newRow, firstParent);
    return;



}

export function UpdateStatDisplay(name: string, value: string): boolean {
    const statDisplay = documentConst.getElementById(name + '-extra-hook-1');
    if (statDisplay == null || statDisplay == undefined)
        return false;

    statDisplay.innerHTML = value;
    return true;
}

export function DeleteStatDisplay(hookName: string): void {
    documentConst.getElementById(hookName + '-extra-hook-0')?.parentElement?.parentElement?.remove();
}
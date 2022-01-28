import _ from 'lodash';
import * as bitburner from "./NetscriptDefinitions.js";

export {};

declare global {
    const _: typeof _;
    interface NS extends bitburner.NS {}
}
import { Supplement } from "./survey";

export interface StateInterface {
    order: Supplement[];
    total: number;
    catalog: Supplement[];
}
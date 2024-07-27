import { createAction, props } from "@ngrx/store";
import { Supplement } from "../models/survey";

export const getCatalog = createAction(
    '[SURVEY] get',
    props<{ supplements: Supplement[] }>());
export const getResults = createAction(
    '[SURVEY] getResult',
);
export const addItem = createAction(
    '[SURVEY] add',
    props<Supplement>()
);
export const removeItem = createAction(
    '[SURVEY] delete',
    props<{ id: number }>()
);
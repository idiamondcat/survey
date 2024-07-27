import { createReducer, on } from "@ngrx/store";
import { StateInterface } from "../models/state";
import { Supplement } from "../models/survey";
import * as actions from "./app.actions";

export const initialState: StateInterface = {
    order: [],
    total: 0,
    catalog: []
}

export const reducers = createReducer(
    initialState,
    on(actions.getCatalog, (state, payload: {supplements: Supplement[]}) => {
        return {...state, catalog: payload.supplements}
    }),
    on(actions.addItem, (state: StateInterface, payload: Supplement) => {
        const newCatalog = [...state.catalog].filter(elem => elem.id !== payload.id);
        return {...state, order: [...state.order, payload], total: state.total + Number(payload.price), catalog: newCatalog };
    }),
    // on(actions.removeItem, (state, id))
)
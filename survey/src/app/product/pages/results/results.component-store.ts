import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Supplement } from "../../../models/survey";
import { Observable } from "rxjs";
import { SurveyService } from "../../services/survey.service";

export interface ResultsComponentState {
    order: Supplement[];
    total: number;
    discount: number;
}

@Injectable()
export class ResultsStore extends ComponentStore<ResultsComponentState> {
    private order$ = this.select(state =>
        state.order ? state.order : null
    );
    private total$ = this.select(state => state.total);
    private discount$ = this.select(state => state.discount);
    vm$ = this.select({
        order: this.order$,
        total: this.total$,
        discount: this.discount$
    });

    constructor(private surveyService: SurveyService) {
        super({
            order: [],
            total: 0,
            discount: 0
        })
    }

    // readonly loadResults = this.effect((trigger$: Observable<void>) => {
    //     return trigger$.pipe(

    //     )
    // })
}
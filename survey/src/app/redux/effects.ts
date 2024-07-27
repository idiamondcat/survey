import { Actions, createEffect, ofType } from "@ngrx/effects";
import { SurveyService } from "../product/services/survey.service";
import { map, switchMap, tap } from "rxjs";
import * as resultActions from "./app.actions";
import { SurveyStore } from "../product/pages/question/question.component-store";


export class SurveyEffects {
    constructor(private surveyService: SurveyService, private actions: Actions, private surveyStore: SurveyStore) {}

    getCatalog = createEffect(() => {
        return this.actions.pipe(
            switchMap(() => this.surveyService.getCatalog()),
            map((res) => resultActions.getCatalog({ supplements: res }))
        )
    });

    // getOrder = createEffect(() => {
    //     return this.actions.pipe(
    //         ofType(resultActions.getResults),
    //         switchMap(() => {
    //             this.surveyStore.dataSubject.pipe(
    //                 tap(data => data)
    //             )
    //         }),
    //     )
    // })
}
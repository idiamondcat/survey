import { Injectable } from "@angular/core";
import { Section, Survey, SurveyCurrentState } from "../../models/survey";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, tap} from "rxjs";
import { SurveyService } from "../../survey.service";
import { Router } from "@angular/router";

export interface SurveyComponentState {
    isLoading: boolean;
    currentSectionIndex: number;
    currentQuestionIndex: number;
    answeredQuestions: {[key: string]: any};
    survey: Survey | null;
}

@Injectable()
export class SurveyStore extends ComponentStore<SurveyComponentState> {
    private currentSection$ = this.select(state =>
        state.survey ? state.survey.sections[state.currentSectionIndex] : null
    );
    private isLoading$ = this.select((state) => state.isLoading);
    private currentQuestion$ = this.select(state =>
        state.survey ? state.survey.sections[state.currentSectionIndex].questions[state.currentQuestionIndex] : null
    );
    private answeredQuestions$: Observable<{[key: string]: any}> = this.select((state) => state.answeredQuestions);
    private survey$: Observable<Survey | null> = this.select((state) => state.survey);
    vm$: Observable<SurveyCurrentState> = this.select({
        isLoading: this.isLoading$,
        currentSection: this.currentSection$,
        currentQuestion: this.currentQuestion$,
        answeredQuestions: this.answeredQuestions$,
        survey: this.survey$
    });

    constructor(private surveyService: SurveyService, private router: Router) {
        super({
            isLoading: false,
            currentSectionIndex: 0,
            currentQuestionIndex: 0,
            answeredQuestions: {},
            survey: null
        })
    }

    readonly loadSurvey = this.effect((trigger$: Observable<void>) => {
        return trigger$.pipe(
          switchMap(() =>
            this.surveyService.getData().pipe(
                tap(survey => {
                    this.patchState({ survey });
                })
            )
          )
        );
      });

    readonly nextQuestion = this.updater((state: SurveyComponentState, answer: {[key: string]: any}) => {
        const { currentSectionIndex, currentQuestionIndex, survey, answeredQuestions } = state;
        if (!survey) {
            return state;
        }
        const currentSection: Section = survey.sections[currentSectionIndex];
        // const isLastQuestion: boolean = currentQuestionIndex + 1 === currentSection.questions.length;
        const newAnsweredQuestions: {[key: string]: any} = {...answeredQuestions, ...answer};
        let newSectionIndex: number = currentSectionIndex;
        let newQuestionIndex: number = currentQuestionIndex + 1;

        if (newQuestionIndex >= currentSection.questions.length) {
            this.patchState({ isLoading: true });
                setTimeout(() => {
                    this.patchState({ isLoading: false });
            }, 5000);
            newQuestionIndex = 0;
            newSectionIndex += 1;
            if (newSectionIndex >= survey.sections.length) {
                this.patchState({ isLoading: false });
                setTimeout(() => {
                    // this.patchState({ isLoading: false });
                    this.router.navigate(['/results']);
                }, 1000)
                // this.surveyService.postData(state.answeredQuestions).subscribe(res => {
                //     console.log(res);
                //     this.patchState({ isLoading: false });
                //     this.router.navigate(['/results']);
                //     // next: () => {
                //     //     console.log(res);
                //     //     this.patchState({ isLoading: false });
                //     //     this.router.navigate(['/results']);
                //     // },
                //     // error: (error) => {
                //     //     console.error('Error posting data:', error);
                //     //     this.patchState({ isLoading: false });
                //     // }
                // });
                return state;
            }
        }
        return {
            ...state,
            answeredQuestions: newAnsweredQuestions,
            currentSectionIndex: newSectionIndex,
            currentQuestionIndex: newQuestionIndex
        };
    })

    readonly prevQuestion = this.updater((state: SurveyComponentState, answer: {[key: string]: any}) => {
        const { currentSectionIndex, currentQuestionIndex, survey, answeredQuestions } = state;
        let newSectionIndex: number = currentSectionIndex;
        let newQuestionIndex: number = currentQuestionIndex - 1;
        const newAnsweredQuestions = { ...answeredQuestions, ...answer };

        if (!survey) {
            return state;
        }

        if (newQuestionIndex < 0) {
            newSectionIndex -= 1;
            if (newSectionIndex < 0) {
                newSectionIndex = 0;
                newQuestionIndex = 0;
            } else {
                newQuestionIndex = survey.sections[newSectionIndex].questions.length - 1;
            }
        }
        console.log(answer, newAnsweredQuestions);
        return {
            ...state,
            answeredQuestions: newAnsweredQuestions,
            currentSectionIndex: newSectionIndex,
            currentQuestionIndex: newQuestionIndex
        };
    })
}
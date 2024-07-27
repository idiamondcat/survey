import { Injectable } from "@angular/core";
import { Field, Question, Section, Survey, SurveyCurrentState } from "../../../models/survey";
import { ComponentStore } from "@ngrx/component-store";
import { map, Observable } from "rxjs";
import { SurveyService } from "../../services/survey.service";
import { Router } from "@angular/router";

export interface SurveyComponentState {
    isLoading: boolean;
    currentSectionIndex: number;
    currentQuestionIndex: number;
    answeredQuestions: Record<string, any>;
    weight: Record<string, number>;
    survey: Survey | null;
    questionStack: { sectionIndex: number; questionIndex: number }[];
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
    private answeredQuestions$: Observable<Record<string, any>> = this.select((state) => state.answeredQuestions);
    private weight$: Observable<Record<string, number>> = this.select((state) => state.weight);
    private survey$: Observable<Survey | null> = this.select((state) => state.survey);
    vm$: Observable<SurveyCurrentState> = this.select({
        isLoading: this.isLoading$,
        currentSection: this.currentSection$,
        currentQuestion: this.currentQuestion$,
        answeredQuestions: this.answeredQuestions$,
        weight: this.weight$,
        survey: this.survey$
    });

    constructor(private surveyService: SurveyService, private router: Router) {
        super({
            isLoading: false,
            currentSectionIndex: 0,
            currentQuestionIndex: 0,
            answeredQuestions: {},
            weight: {},
            survey: null,
            questionStack: []
        })
    }

    readonly loadSurvey = this.effect((trigger$: Observable<void>) => {
        return trigger$.pipe(
            map(() => {
                const survey: Survey | null = this.surveyService.surveyData.value;
                this.patchState({ survey });
            })
        );
      });

      readonly nextQuestion = this.updater((state: SurveyComponentState, answer: Record<string, any>) => {
        const { currentSectionIndex, currentQuestionIndex, survey, answeredQuestions, questionStack, weight } = state;

        if (!survey) return state;

        const currentSection: Section = survey.sections[currentSectionIndex];
        const currentQuestion: Question = currentSection.questions[currentQuestionIndex];
        const newAnsweredQuestions: Record<string, any> = { ...answeredQuestions, ...answer };
        const selectedAnswer: any = Object.values(answer)[0];
        let currAnswerObj: Field | Field[] | undefined | null;
        let prevAnswerObj: Field | Field[] | undefined | null;
        let newWeight: Record<string, number>;
        let nextCardNumber: string | undefined;
        let newSectionIndex: number;
        let newQuestionIndex: number;

        newSectionIndex = currentSectionIndex;
        newQuestionIndex = currentQuestionIndex + 1;
        switch(currentQuestion.type) {
            case 'checkbox':
                let matchElems: Field[] = currentQuestion.answers.filter(el => {
                    return selectedAnswer.indexOf(el.answerId) !== -1;
                });
                prevAnswerObj = currentQuestion.answers.filter(answer => Object.values(answeredQuestions).flat().includes(answer.answerId));
                currAnswerObj = matchElems;
                nextCardNumber = matchElems.every(elem => elem.nextCardNumber === matchElems[0].nextCardNumber) ?
                matchElems[0].nextCardNumber : String(Math.max(...matchElems.map(elem => Number(elem.nextCardNumber))));
            break;
            case 'radio':
                currAnswerObj = currentQuestion.answers.find(answer => answer.answerId ? answer.answerId === selectedAnswer : answer);
                prevAnswerObj = currentQuestion.answers.find(answer => Object.values(answeredQuestions).flat().includes(answer.answerId));
                nextCardNumber = currAnswerObj?.nextCardNumber;
            break;
            default:
                if (!nextCardNumber || currentQuestion) {
                    currAnswerObj = null;
                    prevAnswerObj = null;
                    nextCardNumber = Number(currentQuestion.id + 1).toString();
                }
            break;
        }

        newWeight = this.checkObj(weight, currAnswerObj, prevAnswerObj);

        survey.sections.some((section, i) => {
            const questionIndex = section.questions.findIndex(question => question.id === nextCardNumber);
            if (questionIndex !== -1) {
                if (i !== currentSectionIndex) {
                    this.patchState({ isLoading: true });
                        setTimeout(() => {
                            this.patchState({ isLoading: false });
                    }, 5000);
                }
                newSectionIndex = i;
                newQuestionIndex = questionIndex;
                return true;
            }
            return false;
        });
        if (currentQuestion.lastCard) {
            const weightObj = { weights: newWeight };
            this.patchState({ isLoading: true });
            this.surveyService.postData(weightObj).subscribe({
                next: (res) => {
                    this.patchState({ isLoading: false });
                    console.log(res);
                    // this.dataSubject.next(res.supplements);
                    this.router.navigate(['/results']);
                },
                error: (err) => {
                    console.log(err.message);
                }
            });
            return state;
        }
        return {
            ...state,
            answeredQuestions: newAnsweredQuestions,
            weight: newWeight,
            currentSectionIndex: newSectionIndex,
            currentQuestionIndex: newQuestionIndex,
            questionStack: [...questionStack, { sectionIndex: currentSectionIndex, questionIndex: currentQuestionIndex }]
        };
    })


    readonly prevQuestion = this.updater((state: SurveyComponentState, answer: Record<string, any>) => {
        const { questionStack, answeredQuestions } = state;
        const newAnsweredQuestions = { ...answeredQuestions, ...answer };
        if (questionStack.length === 0) return state;
        const lastQuestion = questionStack.pop();
        return {
        ...state,
        answeredQuestions: newAnsweredQuestions,
        currentSectionIndex: lastQuestion!.sectionIndex,
        currentQuestionIndex: lastQuestion!.questionIndex,
        questionStack
        };
    });


    private checkObj(weightObj: Record<string, number>,
        currAnswerObj: Field | Field[] | undefined | null,
        prevAnswerObj: Field | Field[] | undefined | null
        ): Record<string, number> {
        const newWeightObj = { ...weightObj };

        if (prevAnswerObj) {
            if (Array.isArray(prevAnswerObj)) {
                prevAnswerObj = prevAnswerObj as Field[];
                prevAnswerObj.forEach((prevAnswer: Field) => {
                    let { weight } = prevAnswer;
                    if (weight !== 0) {
                        const newWeight = weight as Record<string, number>;
                        const prevAnswerKeys: string[] = Object.keys(newWeight);
                        prevAnswerKeys.forEach((key: string) => {
                            if (key in newWeightObj) {
                                newWeightObj[key] = newWeightObj[key] - newWeight[key];
                                if (newWeightObj[key] === 0) {
                                    delete newWeightObj[`${key}`];
                                }
                            }
                        })
                    }
                })
            }
        }
        if (currAnswerObj) {
            if (Array.isArray(currAnswerObj)) {
                currAnswerObj.forEach((currAnswer: Field) => {
                    let { weight } = currAnswer;
                    if (weight !== 0) {
                        const newWeight = weight as Record<string, number>;
                        Object.keys(newWeight).forEach((key: string) => {
                            if (key in newWeightObj) {
                                newWeightObj[key] = newWeightObj[key] + newWeight[key];
                            } else {
                                newWeightObj[key] = newWeight[key];
                            }
                        })
                    }
                })
            }
        }
        return newWeightObj;
    }
}
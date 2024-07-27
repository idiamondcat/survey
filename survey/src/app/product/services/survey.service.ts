import { Injectable, signal, WritableSignal } from '@angular/core';
import { Survey, ResponseData, Supplement, Question, Section } from '../../models/survey';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  surveyDataUrl: string = 'assets/mock/mock.json';
  responseDataUrl: string = 'assets/mock/results.json';
  catalogUrl: string = 'assets/mock/catalog.json';
  public isContact: WritableSignal<boolean> = signal<boolean>(false);
  public surveyData: BehaviorSubject<Survey | null>  = new BehaviorSubject<Survey | null>(null);
  public survey$: Observable<any> = this.surveyData.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  public postContact(form: {[key: string]: string | null}): Observable<Survey> {
    const url: string = 'https://get-survey-cards-r7bmzfhfgq-ew.a.run.app/survey_cards';
    return this.http.post<any>(url, form).pipe(
      tap(res => {
        let newSurvey: Survey;
        let groupedQuestions: Section[] = res.reduce((acc: Section[], elem: Question) => {
            let section = acc.find(section => section.title === elem.sectionName);
            if (!section) {
                section = { title: elem.sectionName, questions: [] };
                acc.push(section);
            }
            section.questions.push(elem);
            return acc;
        }, []);
        newSurvey = { sections: groupedQuestions };
        this.isContact.set(true);
        this.surveyData.next(newSurvey);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  // getData(): Observable<Survey> {
  //   // const url = 'https://big-survey-9979357-r7bmzfhfgq-ew.a.run.app/survey_cards';
  //   return this.http.get<any>(this.surveyDataUrl).pipe(
  //     map(res => {
  //       let newSurvey: Survey;
  //       let groupedQuestions: Section[] = res.reduce((acc: Section[], elem: Question) => {
  //           let section = acc.find(section => section.title === elem.sectionName);
  //           if (!section) {
  //               section = { title: elem.sectionName, questions: [] };
  //               acc.push(section);
  //           }
  //           section.questions.push(elem);
  //           return acc;
  //       }, []);
  //       newSurvey = { sections: groupedQuestions };
  //       return newSurvey;
  //     }),
  //     catchError((error) => {
  //       return throwError(() => error);
  //     })
  //   );
  // }

  postData(weights: {weights: Record<string, number>}): Observable<any> {
    const url = 'https://get-survey-result-products-r7bmzfhfgq-ew.a.run.app/recommend-products/';
    return this.http.post<any>(url, weights).pipe(
      map((res) => {
        return res;
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getCatalog(): Observable<Supplement[]> {
    return this.http.get<Supplement[]>(this.catalogUrl).pipe(
      map(res => res),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}

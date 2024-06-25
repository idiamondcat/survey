import { Injectable, WritableSignal, signal } from '@angular/core';
import { Survey, ResponseData } from './models/survey';
import * as mock from '../assets/mock/mock.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  surveyDataUrl: string = 'assets/mock/mock.json';
  responseDataUrl: string = 'assets/mock/results.json';
  constructor(private http: HttpClient, private router: Router,) { }

  getData(): Observable<Survey> {
    return this.http.get<Survey>(this.surveyDataUrl).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  postData(): Observable<ResponseData> {
    const headers: HttpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type'
    });
    return this.http.get<ResponseData>(this.responseDataUrl, { headers }).pipe(
      map((res: ResponseData): ResponseData => {
        return res;
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}

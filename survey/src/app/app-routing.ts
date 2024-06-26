import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./product/pages/question/question.component').then(m => m.QuestionComponent)},
    { path: 'results', loadComponent: () => import('./product/pages/results/results.component').then(m => m.ResultsComponent)},
    // { path: 'error', component:  ErrorComponent },
    // { path: '**', redirectTo: 'error' },
  ];
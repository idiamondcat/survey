import { Routes } from '@angular/router';
import { surveyGuard } from './core/guards/survey.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./product/pages/contact-form/contact-form.component').then(m => m.ContactFormComponent)},
    { path: 'survey', loadComponent: () => import('./product/pages/question/question.component').then(m => m.QuestionComponent), canActivate: [surveyGuard]},
    { path: 'results', loadComponent: () => import('./product/pages/results/results.component').then(m => m.ResultsComponent)},
    // { path: 'error', component:  ErrorComponent },
    // { path: '**', redirectTo: 'error' },
  ];
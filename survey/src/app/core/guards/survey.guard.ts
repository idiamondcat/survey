import { CanActivateFn, Router } from '@angular/router';
import { SurveyService } from '../../product/services/survey.service';
import { inject } from '@angular/core';

export const surveyGuard: CanActivateFn = (route, state) => {
  const surveyService = inject(SurveyService);
  const router = inject(Router);
  if (surveyService.isContact()) {
    return true;
  } else {
    return router.createUrlTree(['/']);
  }
};

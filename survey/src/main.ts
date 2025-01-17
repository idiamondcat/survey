import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing';
import { AppComponent } from './app/app.component';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducers } from './app/redux/app.reducers';

registerLocaleData(localeRu, 'ru');


bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'RUB' },
    provideAnimationsAsync(),
    provideStore(reducers, {}),
    provideStoreDevtools({ maxAge: 25, logOnly: false, autoPause: true })
  ]
});

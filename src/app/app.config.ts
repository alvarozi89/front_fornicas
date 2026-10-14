
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';


import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
    withInterceptors([authInterceptor])
)
  ]
};

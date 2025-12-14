import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideNotifier } from 'angular-notifier';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideNotifier({
      position: {
        horizontal: {
          position: 'right',
          distance: 12,
        },
        vertical: {
          position: 'bottom',
          distance: 12,
          gap: 10,
        },
      },
      theme: 'primeng',
    }),
  ],
};

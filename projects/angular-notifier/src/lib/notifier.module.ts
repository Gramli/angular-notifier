import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { NotifierContainerComponent } from './components/notifier-container.component';
import { NotifierNotificationComponent } from './components/notifier-notification.component';
import { NotifierConfig, NotifierOptions } from './models/notifier-config.model';
import { NotifierConfigToken, NotifierOptionsToken } from './notifier.tokens';
import { NotifierService } from './services/notifier.service';
import { NotifierAnimationService } from './services/notifier-animation.service';
import { NotifierQueueService } from './services/notifier-queue.service';

/**
 * Factory for a notifier configuration with custom options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @param   options - Custom notifier options
 * @returns - Notifier configuration as result
 */
export function notifierCustomConfigFactory(options: NotifierOptions): NotifierConfig {
  return new NotifierConfig(options);
}

/**
 * Factory for a notifier configuration with default options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @returns - Notifier configuration as result
 */
export function notifierDefaultConfigFactory(): NotifierConfig {
  return new NotifierConfig({});
}

/**
 * Provide notifier configuration for standalone applications
 *
 * This function should be used in the application bootstrap providers (main.ts)
 * to configure the notifier globally. Import NotifierModule in components that need it.
 *
 * @example
 * ```typescript
 * import { bootstrapApplication } from '@angular/platform-browser';
 * import { provideNotifier } from 'angular-notifier';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [provideNotifier({ theme: 'material' })]
 * });
 *
 * @Component({
 *   standalone: true,
 *   imports: [NotifierModule],  // Just import, config comes from bootstrap
 * })
 * export class AppComponent {}
 * ```
 * 
 * @param   [options={}] - Custom notifier options
 * @returns - Array of providers for the notifier configuration
 */
export function provideNotifier(options: NotifierOptions = {}): Provider[] {
  return [
    NotifierAnimationService,
    NotifierService,
    NotifierQueueService,
    {
      provide: NotifierOptionsToken,
      useValue: options,
    },
    {
      deps: [NotifierOptionsToken],
      provide: NotifierConfigToken,
      useFactory: notifierCustomConfigFactory,
    },
  ];
}

/**
 * Notifier module
 */
@NgModule({
  declarations: [NotifierContainerComponent, NotifierNotificationComponent],
  exports: [NotifierContainerComponent],
  imports: [CommonModule],
})
export class NotifierModule {
  /**
   * Setup the notifier module with custom providers, in this case with a custom configuration based on the givne options
   *
   * @param   [options={}] - Custom notifier options
   * @returns - Notifier module with custom providers
   */
  public static withConfig(options: NotifierOptions = {}): ModuleWithProviders<NotifierModule> {
    return {
      ngModule: NotifierModule,
      providers: [
        // Provide the services
        NotifierAnimationService,
        NotifierService,
        NotifierQueueService,

        // Provide the options itself upfront (as we need to inject them as dependencies -- see below)
        {
          provide: NotifierOptionsToken,
          useValue: options,
        },

        // Provide a custom notifier configuration, based on the given notifier options
        {
          deps: [NotifierOptionsToken],
          provide: NotifierConfigToken,
          useFactory: notifierCustomConfigFactory,
        },
      ],
    };
  }
}

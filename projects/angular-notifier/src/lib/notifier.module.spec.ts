import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { NotifierConfig, NotifierOptions } from './models/notifier-config.model';
import { NotifierModule, provideNotifier } from './notifier.module';
import { NotifierService } from './services/notifier.service';
import { NotifierAnimationService } from './services/notifier-animation.service';
import { NotifierQueueService } from './services/notifier-queue.service';

/**
 * Notifier Module - Unit Test
 */
describe('Notifier Module', () => {
  it('should instantiate', () => {
    TestBed.configureTestingModule({
      imports: [NotifierModule.withConfig()],
    });
    const service: NotifierService = TestBed.inject(NotifierService);

    expect(service).toBeDefined();
  });

  it('should instantiate with default options', () => {
    TestBed.configureTestingModule({
      imports: [NotifierModule.withConfig()],
    });
    const service: NotifierService = TestBed.inject(NotifierService);

    expect(service.getConfig()).toEqual(new NotifierConfig());
  });

  it('should instantiate with custom options', () => {
    const testNotifierOptions: NotifierOptions = {
      animations: {
        hide: {
          easing: 'ease-in-out',
        },
        overlap: 100,
        shift: {
          speed: 200,
        },
      },
      behaviour: {
        autoHide: 5000,
        stacking: 7,
      },
      position: {
        horizontal: {
          distance: 20,
        },
      },
      theme: 'my-custom-theme',
    };
    const expectedNotifierConfig: NotifierConfig = new NotifierConfig({
      animations: {
        enabled: true,
        hide: {
          easing: 'ease-in-out',
          offset: 50,
          preset: 'fade',
          speed: 300,
        },
        overlap: 100,
        shift: {
          easing: 'ease',
          speed: 200,
        },
        show: {
          easing: 'ease',
          preset: 'slide',
          speed: 300,
        },
      },
      behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 7,
      },
      position: {
        horizontal: {
          distance: 20,
          position: 'left',
        },
        vertical: {
          distance: 12,
          gap: 10,
          position: 'bottom',
        },
      },
      theme: 'my-custom-theme',
    });

    TestBed.configureTestingModule({
      imports: [NotifierModule.withConfig(testNotifierOptions)],
    });
    const service: NotifierService = TestBed.inject(NotifierService);

    expect(service.getConfig()).toEqual(expectedNotifierConfig);
  });
});

/**
 * provideNotifier Function - Unit Test
 */
describe('provideNotifier Function', () => {
  it('should provide all necessary services and default configuration', () => {
    TestBed.configureTestingModule({
      imports: [NotifierModule],
      providers: [provideNotifier()],
    });

    const service = TestBed.inject(NotifierService);
    const animationService = TestBed.inject(NotifierAnimationService);
    const queueService = TestBed.inject(NotifierQueueService);

    expect(service).toBeDefined();
    expect(animationService).toBeDefined();
    expect(queueService).toBeDefined();
    expect(service.getConfig()).toEqual(new NotifierConfig());
  });

  it('should provide services with custom configuration', () => {
    const testNotifierOptions: NotifierOptions = {
      animations: {
        hide: {
          easing: 'ease-in-out',
        },
        overlap: 100,
        shift: {
          speed: 200,
        },
      },
      behaviour: {
        autoHide: 5000,
        stacking: 7,
      },
      position: {
        horizontal: {
          distance: 20,
        },
      },
      theme: 'my-custom-theme',
    };
    const expectedNotifierConfig: NotifierConfig = new NotifierConfig({
      animations: {
        enabled: true,
        hide: {
          easing: 'ease-in-out',
          offset: 50,
          preset: 'fade',
          speed: 300,
        },
        overlap: 100,
        shift: {
          easing: 'ease',
          speed: 200,
        },
        show: {
          easing: 'ease',
          preset: 'slide',
          speed: 300,
        },
      },
      behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 7,
      },
      position: {
        horizontal: {
          distance: 20,
          position: 'left',
        },
        vertical: {
          distance: 12,
          gap: 10,
          position: 'bottom',
        },
      },
      theme: 'my-custom-theme',
    });

    TestBed.configureTestingModule({
      imports: [NotifierModule],
      providers: [provideNotifier(testNotifierOptions)],
    });

    const service = TestBed.inject(NotifierService);
    expect(service.getConfig()).toEqual(expectedNotifierConfig);
  });

  it('should work in standalone component context', () => {
    TestBed.configureTestingModule({
      imports: [NotifierModule],
      providers: [
        provideNotifier({
          theme: 'material',
          behaviour: { autoHide: 3000 },
        }),
      ],
    });

    const service = TestBed.inject(NotifierService);
    expect(service).toBeDefined();
    expect(service.getConfig().theme).toBe('material');
    expect(service.getConfig().behaviour.autoHide).toBe(3000);
  });
});

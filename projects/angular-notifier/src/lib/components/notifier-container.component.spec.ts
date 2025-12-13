import { DebugElement, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { NotifierAction } from '../models/notifier-action.model';
import { NotifierConfig } from '../models/notifier-config.model';
import { NotifierConfigToken } from '../notifier.tokens';
import { NotifierService } from '../services/notifier.service';
import { NotifierQueueService } from '../services/notifier-queue.service';
import { NotifierContainerComponent } from './notifier-container.component';

/**
 * Notifier Container Component - Unit Test
 */
describe('Notifier Container Component', () => {
  let componentFixture: ComponentFixture<NotifierContainerComponent>;
  let componentInstance: NotifierContainerComponent;
  let queueService: MockNotifierQueueService;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should instantiate', () => {
    // Setup test module
    beforeEachWithConfig(new NotifierConfig());

    expect(componentInstance).toBeDefined();
  });

  it('should render', () => {
    // Setup test module
    beforeEachWithConfig(new NotifierConfig());
    componentFixture.detectChanges();
  });

  it('should ignore unknown actions', async () => {
    // Setup test module
    beforeEachWithConfig(new NotifierConfig());
    componentFixture.detectChanges();
    vi.spyOn(queueService, 'continue');

    queueService.push(<any>{
      payload: 'STUFF',
      type: 'WHATEVS',
    });
    componentFixture.detectChanges();
    await vi.advanceTimersByTimeAsync(0);

    expect(queueService.continue).toHaveBeenCalled();
  });

  describe('(show)', () => {
    it('should show the first notification', async () => {
      // Setup test module
      beforeEachWithConfig(new NotifierConfig());
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      queueService.push({
        payload: {
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      expect(listElements.length).toBe(1);

      const mockNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockNotificationComponent, 'show'); // Continue
      componentInstance.onNotificationReady(<any>mockNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      expect(mockNotificationComponent.show).toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalled();
    });

    it('should switch out the old notification with the new one when stacking is disabled', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          behaviour: {
            stacking: false,
          },
        }),
      );
      componentFixture.detectChanges();

      // Create the first notification
      queueService.push({
        payload: {
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      // Create the second notification
      queueService.push({
        payload: {
          message: 'Blubberfish.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'show'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      expect(mockFirstNotificationComponent.hide).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.show).toHaveBeenCalled();
    });

    it('should hide and shift before showing the notification when stacking is enabled', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
          behaviour: {
            stacking: 2,
          },
        }),
      );
      componentFixture.detectChanges();

      // Create the first notification
      queueService.push({
        payload: {
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      // Create the second notification
      queueService.push({
        payload: {
          message: 'Blubberfish.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'shift'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      // Create the third notification
      queueService.push({
        payload: {
          message: 'This. Is. Angular!',
          type: 'INFO',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockThirdNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockThirdNotificationComponent, 'show'); // Continue
      componentInstance.onNotificationReady(<any>mockThirdNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      expect(mockFirstNotificationComponent.hide).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.shift).toHaveBeenCalled();
      expect(mockThirdNotificationComponent.show).toHaveBeenCalled();
    });

    it('should hide and shift before showing the notification, when stacking is enabled (with animations)', async () => {
      // Setup test module
      const testNotifierConfig: NotifierConfig = new NotifierConfig({
        animations: {
          overlap: false,
        },
        behaviour: {
          stacking: 2,
        },
      });
      beforeEachWithConfig(testNotifierConfig);
      componentFixture.detectChanges();

      // Create the first notification
      queueService.push({
        payload: {
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      // Create the second notification
      queueService.push({
        payload: {
          message: 'Blubberfish.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'shift'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      // Create the third notification
      queueService.push({
        payload: {
          message: 'This. Is. Angular!',
          type: 'INFO',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockThirdNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockThirdNotificationComponent, 'show'); // Continue
      componentInstance.onNotificationReady(<any>mockThirdNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      expect(mockFirstNotificationComponent.hide).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.shift).toHaveBeenCalled();
      expect(mockThirdNotificationComponent.show).toHaveBeenCalled();
    });

    it('should hide and shift before showing the notification, when tacking is enabled (with overlapping animations)', async () => {
      // Setup test module
      const testNotifierConfig: NotifierConfig = new NotifierConfig({
        behaviour: {
          stacking: 2,
        },
      });
      beforeEachWithConfig(testNotifierConfig);
      componentFixture.detectChanges();

      // Create the first notification
      queueService.push({
        payload: {
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      // Create the second notification
      queueService.push({
        payload: {
          message: 'Blubberfish.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'shift'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      // Create the third notification
      queueService.push({
        payload: {
          message: 'This. Is. Angular!',
          type: 'INFO',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockThirdNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockThirdNotificationComponent, 'show'); // Continue
      componentInstance.onNotificationReady(<any>mockThirdNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(
        testNotifierConfig.animations.hide.speed +
          testNotifierConfig.animations.shift.speed -
          <number>testNotifierConfig.animations.overlap,
      );

      expect(mockFirstNotificationComponent.hide).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.shift).toHaveBeenCalled();
      expect(mockThirdNotificationComponent.show).toHaveBeenCalled();
    });
  });

  describe('(hide)', () => {
    it('should hide one notification', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      const testNotificationId = 'FAKE_ID';

      // Show notification
      queueService.push({
        payload: {
          id: testNotificationId,
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      // Hide notification
      queueService.push({
        payload: testNotificationId,
        type: 'HIDE',
      });
      componentFixture.detectChanges();

      await vi.advanceTimersByTimeAsync(0);
      componentFixture.detectChanges(); // Run a second change detection (to update the template)

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      expect(listElements.length).toBe(0);
      expect(mockNotificationComponent.hide).toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalled();
    });

    it('should skip if the notification to hide does not exist', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Show first notification
      queueService.push({
        payload: {
          id: 'FAKE_ID',
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockNotificationComponent); // Trigger the ready event manually

      await vi.advanceTimersByTimeAsync(0);

      // Hide notification
      queueService.push({
        payload: 'NOT_EXISTING_ID',
        type: 'HIDE',
      });
      componentFixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);
      componentFixture.detectChanges(); // Run a second change detection (to update the template)

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      expect(listElements.length).toBe(1);
      expect(mockNotificationComponent.hide).not.toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalled();
    });

    it('should shift before hiding the notification if necessary', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Show first notification
      queueService.push({
        payload: {
          message: 'Whut.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'shift'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      // Show second notification
      const testNotificationId = 'FAKE_ID';
      queueService.push({
        payload: {
          id: testNotificationId,
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      // Hide second notification
      queueService.push({
        payload: testNotificationId,
        type: 'HIDE',
      });
      componentFixture.detectChanges();

      await vi.advanceTimersByTimeAsync(0);
      componentFixture.detectChanges(); // Run a second change detection (to update the template)

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      const expectedCallTimes = 3;
      expect(listElements.length).toBe(1);
      expect(mockFirstNotificationComponent.shift).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.hide).toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('should shift before hiding the notification if necessary (with animations)', async () => {
      // Setup test module
      const testNotifierConfig: NotifierConfig = new NotifierConfig({
        animations: {
          overlap: false,
        },
      });
      beforeEachWithConfig(testNotifierConfig);
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Show first notification
      queueService.push({
        payload: {
          message: 'Whut.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'shift'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      // Show second notification
      const testNotificationId = 'FAKE_ID';
      queueService.push({
        payload: {
          id: testNotificationId,
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      // Hide second notification
      queueService.push({
        payload: testNotificationId,
        type: 'HIDE',
      });
      componentFixture.detectChanges();

      await vi.advanceTimersByTimeAsync(testNotifierConfig.animations.hide.speed);
      componentFixture.detectChanges(); // Run a second change detection (to update the template)

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      const expectedCallTimes = 3;
      expect(listElements.length).toBe(1);
      expect(mockFirstNotificationComponent.shift).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.hide).toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('should shift before hiding the notification if necessary (with overlapping animations)', async () => {
      // Setup test module
      const testNotifierConfig: NotifierConfig = new NotifierConfig();
      beforeEachWithConfig(testNotifierConfig);
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Show first notification
      queueService.push({
        payload: {
          message: 'Whut.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'shift'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      // Show second notification
      const testNotificationId = 'FAKE_ID';
      queueService.push({
        payload: {
          id: testNotificationId,
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      // Hide second notification
      queueService.push({
        payload: testNotificationId,
        type: 'HIDE',
      });
      componentFixture.detectChanges();

      await vi.advanceTimersByTimeAsync(testNotifierConfig.animations.hide.speed - <number>testNotifierConfig.animations.overlap);
      componentFixture.detectChanges(); // Run a second change detection (to update the template)

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      const expectedCallTimes = 3;
      expect(listElements.length).toBe(1);
      expect(mockFirstNotificationComponent.shift).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.hide).toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('should hide the notification when the dismiss event gets dispatched', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Show second notification
      const testNotificationId = 'FAKE_ID';
      queueService.push({
        payload: {
          id: testNotificationId,
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockNotificationComponent); // Trigger the ready event manually

      // Hide second notification
      componentInstance.onNotificationDismiss(testNotificationId);
      await vi.advanceTimersByTimeAsync(0);
      componentFixture.detectChanges();

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      const expectedCallTimes = 2;
      expect(listElements.length).toBe(0);
      expect(mockNotificationComponent.hide).toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalledTimes(expectedCallTimes);
    });
  });

  describe('(hide oldest / newest)', () => {
    it('should hide the oldest notification', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Show first notification
      queueService.push({
        payload: {
          id: 'FAKE_ID',
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      // Show first notification
      queueService.push({
        payload: {
          message: 'Whut.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      // Hide second notification
      queueService.push({
        type: 'HIDE_OLDEST',
      });
      componentFixture.detectChanges();

      await vi.advanceTimersByTimeAsync(0);
      componentFixture.detectChanges(); // Run a second change detection (to update the template)

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      const expectedCallTimes = 3;
      expect(listElements.length).toBe(1);
      expect(mockFirstNotificationComponent.hide).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.hide).not.toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('should skip hiding the oldest notification if there are no notifications', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Hide notification
      queueService.push({
        type: 'HIDE_OLDEST',
      });
      componentFixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);

      expect(queueService.continue).toHaveBeenCalled();
    });

    it('should hide the newest notification', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Show first notification
      queueService.push({
        payload: {
          message: 'Whut.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      // Show first notification
      queueService.push({
        payload: {
          id: 'FAKE_ID',
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      // Hide second notification
      queueService.push({
        type: 'HIDE_NEWEST',
      });
      componentFixture.detectChanges();

      await vi.advanceTimersByTimeAsync(0);
      componentFixture.detectChanges(); // Run a second change detection (to update the template)

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      const expectedCallTimes = 3;
      expect(listElements.length).toBe(1);
      expect(mockFirstNotificationComponent.hide).not.toHaveBeenCalled();
      expect(mockSecondNotificationComponent.hide).toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('should skip hiding the newest notification if there are no notifications', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Hide notification
      queueService.push({
        type: 'HIDE_NEWEST',
      });
      componentFixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);

      expect(queueService.continue).toHaveBeenCalled();
    });
  });

  describe('(hide all)', () => {
    it('should hide all notifications', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Show first notification
      queueService.push({
        payload: {
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      // Show first notification
      queueService.push({
        payload: {
          message: 'Whut.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      // Hide second notification
      queueService.push({
        type: 'HIDE_ALL',
      });
      componentFixture.detectChanges();

      await vi.advanceTimersByTimeAsync(0);
      componentFixture.detectChanges(); // Run a second change detection (to update the template)

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      const expectedCallTimes = 3;
      expect(listElements.length).toBe(0);
      expect(mockFirstNotificationComponent.hide).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.hide).toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('should hide all notifications (with animations)', async () => {
      // Setup test module
      const testNotifierConfig: NotifierConfig = new NotifierConfig();
      beforeEachWithConfig(testNotifierConfig);
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Show first notification
      queueService.push({
        payload: {
          message: 'Lorem ipsum dolor sit amet.',
          type: 'SUCCESS',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockFirstNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockFirstNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockFirstNotificationComponent); // Trigger the ready event manually

      // Show first notification
      queueService.push({
        payload: {
          message: 'Whut.',
          type: 'ERROR',
        },
        type: 'SHOW',
      });
      componentFixture.detectChanges();
      const mockSecondNotificationComponent: MockNotifierNotificationComponent = new MockNotifierNotificationComponent();
      vi.spyOn(mockSecondNotificationComponent, 'hide'); // Continue
      componentInstance.onNotificationReady(<any>mockSecondNotificationComponent); // Trigger the ready event manually

      // Hide second notification
      queueService.push({
        type: 'HIDE_ALL',
      });
      componentFixture.detectChanges();

      const numberOfNotifications = 2;
      await vi.advanceTimersByTimeAsync(testNotifierConfig.animations.hide.speed + numberOfNotifications * <number>testNotifierConfig.animations.hide.offset);
      componentFixture.detectChanges(); // Run a second change detection (to update the template)

      const listElements: Array<DebugElement> = componentFixture.debugElement.queryAll(By.css('.notifier__container-list-item'));

      const expectedCallTimes = 3;
      expect(listElements.length).toBe(0);
      expect(mockFirstNotificationComponent.hide).toHaveBeenCalled();
      expect(mockSecondNotificationComponent.hide).toHaveBeenCalled();
      expect(queueService.continue).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('should skip hiding all notification if there are no notifications', async () => {
      // Setup test module
      beforeEachWithConfig(
        new NotifierConfig({
          animations: {
            enabled: false,
          },
        }),
      );
      componentFixture.detectChanges();
      vi.spyOn(queueService, 'continue');

      // Hide notification
      queueService.push({
        type: 'HIDE_ALL',
      });
      componentFixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);

      expect(queueService.continue).toHaveBeenCalled();
    });
  });

  /**
   * Helper for upfront configuration
   */
  function beforeEachWithConfig(testNotifierConfig: NotifierConfig): void {
    TestBed.configureTestingModule({
      declarations: [NotifierContainerComponent],
      providers: [
        {
          provide: NotifierService,
          useValue: {
            getConfig: () => testNotifierConfig,
          },
        },
        {
          // No idea why this is *actually* necessary -- it shouldn't be ...
          provide: NotifierConfigToken,
          useValue: {},
        },
        {
          provide: NotifierQueueService,
          useClass: MockNotifierQueueService,
        },
      ],
      schemas: [
        NO_ERRORS_SCHEMA, // Ignore sub-components (inknown tags in the HTML template)
      ],
    });
    componentFixture = TestBed.createComponent(NotifierContainerComponent);
    componentInstance = componentFixture.componentInstance;

    queueService = TestBed.inject(NotifierQueueService);
  }
});

/**
 * Mock Notifier Queue Service
 */
@Injectable()
class MockNotifierQueueService extends NotifierQueueService {
  /**
   * Push a new action to the queue, and try to run it
   *
   * @param {NotifierAction} action Action object
   *
   * @override
   */
  public push(action: NotifierAction): void {
    this.actionStream.next(action);
  }

  /**
   * Continue with the next action (called when the current action is finished)
   *
   * @override
   */
  public continue(): void {
    // Do nothing
  }
}

/**
 * Random notification height
 */
const randomHeight = 42;

/**
 * Mock Notifier Notification Component
 */
class MockNotifierNotificationComponent {
  // Don't extend to prevent DI null issues

  /**
   * Get notification element height (in px)
   *
   * @returns {number} Notification element height (in px)
   *
   * @override
   */
  public getHeight(): number {
    return randomHeight; // Random ...
  }

  /**
   * Show a notification
   *
   * @override
   */
  public show(): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve(); // Do nothing
    });
  }

  /**
   * Shift a notification
   *
   * @override
   */
  public shift(): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve(); // Do nothing
    });
  }

  /**
   * Hide a notification
   *
   * @override
   */
  public hide(): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve(); // Do nothing
    });
  }
}

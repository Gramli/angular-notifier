import { inject, TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, expect, it, vi } from 'vitest';
import { NotifierTimerService } from './notifier-timer.service';

/**
 * Notifier Timer Service - Unit Test
 */
describe('Notifier Timer Service', () => {
  const fullAnimationTime = 5000;
  const longAnimationTime = 4000;
  const shortAnimationTime = 1000;

  let timerService: NotifierTimerService;
  let mockDate: MockDate;

  // Setup test module
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotifierTimerService],
    });
    vi.useFakeTimers();
  });

  // Cleanup fake timers
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // Inject dependencies
  beforeEach(inject([NotifierTimerService], (notifierTimerService: NotifierTimerService) => {
    timerService = notifierTimerService;
    mockDate = new MockDate();
  }));

  it('should instantiate', () => {
    expect(timerService).toBeDefined();
  });

  it('should start and stop the timer', async () => {
    const timerServiceCallback = vi.fn();
    const promise = timerService.start(fullAnimationTime).then(timerServiceCallback);

    await vi.advanceTimersByTimeAsync(longAnimationTime);

    expect(timerServiceCallback).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(shortAnimationTime);
    await promise;

    expect(timerServiceCallback).toHaveBeenCalled();
  });

  it('should pause and resume the timer', async () => {
    const originalDate = global.Date;
    const mockDate = new MockDate();
    global.Date = <any>function() {
      return mockDate;
    };
    (global.Date as any).now = () => mockDate.getTime();
    
    const timerServiceCallback = vi.fn();
    const promise = timerService.start(fullAnimationTime).then(timerServiceCallback);

    await vi.advanceTimersByTimeAsync(longAnimationTime);
    mockDate.fastForwardTime(longAnimationTime); // Also update the global Date (in addition to the tick)

    timerService.pause();

    await vi.advanceTimersByTimeAsync(shortAnimationTime);
    mockDate.fastForwardTime(shortAnimationTime); // Also update the global Date (in addition to the tick)

    expect(timerServiceCallback).not.toHaveBeenCalled();

    // Resumes the timer, using the same duration as above (a continue doesn't exist yet)
    timerService.continue();
    await vi.advanceTimersByTimeAsync(shortAnimationTime);
    await promise;

    expect(timerServiceCallback).toHaveBeenCalled();
    
    // Restore original Date
    global.Date = originalDate;
  });

  it('should stop the timer', async () => {
    const timerServiceCallback = vi.fn();
    timerService.start(fullAnimationTime).then(timerServiceCallback);

    await vi.advanceTimersByTimeAsync(longAnimationTime);
    timerService.stop();
    await vi.advanceTimersByTimeAsync(shortAnimationTime);

    expect(timerServiceCallback).not.toHaveBeenCalled();
  });
});

/**
 * Mock Date, allows for fast-forwarding the time even in the global Date object
 */
class MockDate extends Date {
  /**
   * Start time (at init)
   */
  private startTime: number;

  /**
   * Elapsed time (since init)
   */
  private elapsedTime: number;

  /**
   * Fast-forward the current time manually
   */
  public fastForwardTime(duration: number): void {
    this.elapsedTime += duration;
  }

  /**
   * Get the current time
   *
   * @override
   */
  public getTime(): number {
    return this.startTime + this.elapsedTime;
  }
}

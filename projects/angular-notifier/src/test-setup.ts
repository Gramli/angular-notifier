import '@angular/compiler';
import 'reflect-metadata';
import '@analogjs/vitest-angular/setup-zone';
import '@analogjs/vitest-angular/setup-snapshots';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';

// First reset any existing environment
getTestBed().resetTestEnvironment();

// Initialize Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } },
);
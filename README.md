<div align="center">

# Angular Notifier

**A fully animated, highly customizable, and easy-to-use notification library for Angular applications**

[![Build & Test](https://img.shields.io/github/actions/workflow/status/Gramli/angular-notifier/ci.yml?style=flat-square&label=Build)](https://github.com/Gramli/angular-notifier/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/gramli-angular-notifier?style=flat-square&logo=npm)](https://www.npmjs.com/package/gramli-angular-notifier)
[![Angular](https://img.shields.io/badge/Angular-21.x-dd0031?style=flat-square&logo=angular)](https://angular.io)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#features) • [Installation](#installation) • [Quick Start](#quick-start) • [Themes](#themes) • [API](#api) • [Customization](#customization)

![Angular Notifier Animated Preview](/docs/angular-notifier-preview.gif)

</div>

## Overview

Angular Notifier is a notification library designed to provide elegant, non-intrusive notifications for your Angular applications. With built-in animations, multiple themes, and extensive customization options, it helps you deliver a polished user experience without the complexity.

**Key highlights:**

- **Highly customizable** - Configure positioning, behavior, animations, and appearance
- **Fully animated** - Smooth slide and fade animations with customizable timing
- **Multiple themes** - Material Design, Bootstrap, and PrimeNG-inspired styles out of the box
- **Type-safe** - Written in TypeScript with full type definitions
- **Lightweight** - Zero dependencies beyond Angular itself
- **Production-ready** - Battle-tested and actively maintained

## Features

- **Rich notification types**: Success, error, warning, info, and custom types
- **Flexible positioning**: Top, bottom, left, right, or center placement
- **Smart behavior**: Auto-hide, stacking, pause on hover, and click handlers
- **Animation presets**: Built-in fade and slide animations with customizable easing
- **Multiple themes**: Material Design, Bootstrap-style, and PrimeNG-inspired themes
- **Responsive design**: Mobile-optimized with responsive breakpoints
- **Custom templates**: Use your own HTML templates for complete control
- **Notification control**: Show, hide, and manage notifications programmatically
- **Accessibility**: Keyboard navigation and ARIA support

## Installation

Install via npm:

```bash
npm install gramli-angular-notifier
```

### Angular Version Compatibility

| Angular Notifier | Angular |
| ---------------- | ------- |
| `21.x`           | `21.x`  |
| `18.x`           | `20.x`  |
| `17.x`           | `19.x`  |
| `16.x`           | `18.x`  |
| `15.x`           | `17.x`  |

> **Note**: This is a maintained fork of [dominique-mueller/angular-notifier](https://github.com/dominique-mueller/angular-notifier), updated to support the latest Angular versions. For older Angular versions, see the [original repository](https://github.com/dominique-mueller/angular-notifier).

## Quick Start

### 1. Import the NotifierModule

Add the `NotifierModule` to your root module:

```typescript
import { NotifierModule } from 'gramli-angular-notifier';

@NgModule({
  imports: [
    NotifierModule,
    // Or with custom configuration
    NotifierModule.withConfig({
      position: {
        horizontal: { position: 'right', distance: 12 },
        vertical: { position: 'top', distance: 12, gap: 10 }
      },
      theme: 'material'
    })
  ]
})
export class AppModule { }
```

### 2. Add the notifier container

Add the `<notifier-container>` component to your app component template:

```typescript
@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <notifier-container></notifier-container>
  `
})
export class AppComponent { }
```

### 3. Import styles

Import the styles in your global styles file (`styles.scss` or `styles.css`):

```scss
// Import all styles (core + all themes + all types)
@use 'gramli-angular-notifier/styles';

// Or import only what you need for better performance
@use 'gramli-angular-notifier/styles/core';
@use 'gramli-angular-notifier/styles/themes/theme-material';
@use 'gramli-angular-notifier/styles/types/type-success';
@use 'gramli-angular-notifier/styles/types/type-error';

// Or use a complete theme bundle (recommended)
@use 'gramli-angular-notifier/styles/themes/theme-material-complete';
```

> **Note**: The deprecated `@import` syntax still works but will show Sass deprecation warnings. We recommend using `@use` to avoid warnings in your build output.

### 4. Use the NotifierService

Inject and use the `NotifierService` in your components:

```typescript
import { NotifierService } from 'gramli-angular-notifier';

@Component({
  selector: 'app-example',
  template: `<button (click)="showNotification()">Show Notification</button>`
})
export class ExampleComponent {
  constructor(private notifier: NotifierService) { }

  showNotification() {
    this.notifier.notify('success', 'You are awesome!');
  }
}
```

## Themes

Angular Notifier comes with three professionally designed themes:

### Material Design Theme

Clean, modern design following Google's Material Design principles:

```typescript
NotifierModule.withConfig({ theme: 'material' })
```

- Subtle shadows and 3px border radius
- Smooth opacity transitions
- Compact and space-efficient

### Bootstrap Theme

Professional styling inspired by Bootstrap 5:

```typescript
NotifierModule.withConfig({ theme: 'bootstrap' })
```

- Alert-style contextual colors
- 6px rounded corners with layered shadows
- Responsive spacing with rem units
- Enhanced hover effects and accessibility focus states

### PrimeNG Theme

Modern, elegant design inspired by PrimeNG components:

```typescript
NotifierModule.withConfig({ theme: 'primeng' })
```

- Rich, vibrant colors with left accent border
- Multi-layered shadows for depth
- Circular close button with rotation animation
- Available in both dark and light variants (`primeng-light`)

## API

### NotifierService Methods

#### `notify(type, message, id?)`

Show a notification with the specified type and message:

```typescript
this.notifier.notify('success', 'Operation completed successfully!');
this.notifier.notify('error', 'Something went wrong', 'error-id-123');
```

#### `show(config)`

Show a notification with detailed configuration:

```typescript
this.notifier.show({
  type: 'warning',
  message: 'Your session will expire soon',
  id: 'session-warning',
  template: this.customTemplate
});
```

#### `hide(id)`

Hide a specific notification by ID:

```typescript
this.notifier.hide('notification-id');
```

#### `hideNewest()`

Hide the most recently shown notification:

```typescript
this.notifier.hideNewest();
```

#### `hideOldest()`

Hide the oldest visible notification:

```typescript
this.notifier.hideOldest();
```

#### `hideAll()`

Hide all visible notifications:

```typescript
this.notifier.hideAll();
```

### Notification Types

- `default` - Default notification style
- `info` - Informational messages
- `success` - Success confirmations
- `warning` - Warning messages
- `error` - Error alerts

## Customization

### Configuration Options

Configure Angular Notifier when importing the module:

```typescript
NotifierModule.withConfig({
  position: {
    horizontal: {
      position: 'right',  // 'left' | 'middle' | 'right'
      distance: 12        // Distance from edge (px)
    },
    vertical: {
      position: 'top',    // 'top' | 'bottom'
      distance: 12,       // Distance from edge (px)
      gap: 10            // Gap between notifications (px)
    }
  },
  
  theme: 'material',    // 'material' | 'bootstrap' | 'primeng' | 'primeng-light'
  
  behaviour: {
    autoHide: 5000,                // Auto-hide after ms (false to disable)
    onClick: 'hide',               // 'hide' | false
    onMouseover: 'pauseAutoHide',  // 'pauseAutoHide' | 'resetAutoHide' | false
    showDismissButton: true,       // Show close button
    stacking: 4                    // Max visible notifications (false for unlimited)
  },
  
  animations: {
    enabled: true,
    show: {
      preset: 'slide',             // 'slide' | 'fade'
      speed: 300,                  // Animation duration (ms)
      easing: 'ease'               // CSS easing function
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50                   // Stagger delay when hiding multiple (ms)
    },
    shift: {
      speed: 300,                  // Duration for shifting notifications
      easing: 'ease'
    },
    overlap: 150                   // Animation overlap for smoother transitions (ms)
  }
})
```

### Custom Templates

Create fully custom notification layouts using Angular templates:

```typescript
@Component({
  selector: 'app-notifications',
  template: `
    <ng-template #customNotification let-notificationData="notification">
      <div class="custom-alert">
        <span class="icon">{{ getIcon(notificationData.type) }}</span>
        <span class="message">{{ notificationData.message }}</span>
      </div>
    </ng-template>
  `
})
export class NotificationsComponent {
  @ViewChild('customNotification', { static: true }) customTemplate: TemplateRef<any>;

  constructor(private notifier: NotifierService) { }

  showCustomNotification() {
    this.notifier.show({
      type: 'success',
      message: 'Custom styled notification!',
      template: this.customTemplate
    });
  }

  getIcon(type: string): string {
    const icons = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
    return icons[type] || '•';
  }
}
```

### Custom Themes

Create your own notification theme by writing custom SCSS:

```scss
// my-custom-theme.scss
.notifier__notification--my-theme {
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &.notifier__notification--success {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .notifier__notification-button {
    opacity: 0.8;
    &:hover { opacity: 1; }
  }
}
```

Then use it in your configuration:

```typescript
NotifierModule.withConfig({ theme: 'my-theme' })
```

## Advanced Usage

### Managing Notification Lifecycle

```typescript
export class AppComponent {
  constructor(private notifier: NotifierService) { }

  showTemporary() {
    // Auto-hide after 3 seconds
    this.notifier.show({
      type: 'info',
      message: 'This will disappear soon',
      id: 'temp-notification'
    });
  }

  showPersistent() {
    // Stays until manually dismissed
    this.notifier.show({
      type: 'warning',
      message: 'Action required!',
      id: 'persistent-warning'
    });
  }

  hidePersistent() {
    this.notifier.hide('persistent-warning');
  }

  clearAll() {
    this.notifier.hideAll();
  }
}
```

### Notification Stacking

Control how notifications stack:

```typescript
// Limit to 3 visible notifications
NotifierModule.withConfig({ behaviour: { stacking: 3 } })

// Unlimited stacking
NotifierModule.withConfig({ behaviour: { stacking: false } })
```

### Click and Hover Behaviors

```typescript
NotifierModule.withConfig({
  behaviour: {
    // Hide notification on click
    onClick: 'hide',
    
    // Pause auto-hide timer on hover
    onMouseover: 'pauseAutoHide',
    
    // Or reset the timer on hover
    // onMouseover: 'resetAutoHide',
  }
})
```

## Examples

### Success notification with custom ID

```typescript
this.notifier.notify('success', 'Profile updated successfully!', 'profile-update');
```

### Error notification that stays visible

```typescript
this.notifier.show({
  type: 'error',
  message: 'Failed to connect to server. Please try again.',
  id: 'connection-error'
});
```

### Warning with custom behavior

```typescript
NotifierModule.withConfig({
  behaviour: {
    autoHide: 10000,      // Show for 10 seconds
    onClick: 'hide',       // Dismiss on click
    onMouseover: 'pauseAutoHide'  // Pause timer when hovering
  }
})
```

### Sequential notifications

```typescript
async showProgress() {
  this.notifier.notify('info', 'Starting process...');
  
  await this.performTask();
  this.notifier.hideAll();
  this.notifier.notify('success', 'Process completed!');
}
```

## Best Practices

> [!TIP]
> **Position notifications wisely** - Top-right or bottom-right positions are less intrusive for most applications.

> [!TIP]
> **Use appropriate types** - Match notification types to your message severity to provide clear visual cues.

> [!TIP]
> **Set reasonable timeouts** - Error messages should have longer auto-hide times (or no auto-hide) compared to success messages.

> [!WARNING]
> **Avoid notification spam** - Limit stacking to prevent overwhelming users. Consider using `hideAll()` before showing new critical notifications.

> [!NOTE]
> **Test on mobile** - Notifications should be readable and dismissible on small screens. The built-in themes include responsive breakpoints.

## Troubleshooting

### Styles not appearing

Ensure you've imported the styles in your `styles.scss`:

```scss
@use 'gramli-angular-notifier/styles';
```

### Notifications not showing

1. Verify `<notifier-container>` is in your app component template
2. Check that `NotifierModule` is imported in your root module
3. Ensure the NotifierService is properly injected

### Animations not working

Check that animations are enabled in your configuration:

```typescript
NotifierModule.withConfig({ animations: { enabled: true } })
```

## Credits

This library is a maintained fork of [angular-notifier](https://github.com/dominique-mueller/angular-notifier) by Dominique Müller. Special thanks to the original author for creating this excellent library.

Originally created by [itsdevdom](https://github.com/itsdevdom). Currently maintained by [Gramli](https://github.com/Gramli).

## License

MIT License - see the [LICENSE](LICENSE) file for details.

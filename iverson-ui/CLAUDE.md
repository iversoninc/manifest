# @iverson/ui — Claude Code Reference

Zero-dependency vanilla CSS + JS component library for internal agency tools.

## Quick Start

Add two lines to any HTML file:
```html
<link rel="stylesheet" href="path/to/iverson.css" />
<script type="module" src="path/to/iverson.js"></script>
```

Or import via npm:
```js
import '@iverson/ui';          // JS + CSS
import '@iverson/ui/css';      // CSS only
```

## Architecture

- **CSS-first**: Components are CSS classes applied to semantic HTML. No framework needed.
- **Minimal JS**: Only used for interactive behaviors (toast, dropdowns, modals, select, datepicker, command palette, drawer, popover, file upload).
- **Dark mode**: Automatic via `prefers-color-scheme` or manual via `data-theme="dark"` on `<html>`.
- **Zero dependencies**: No runtime deps. Vite is dev-only for building.

## Design Tokens

All tokens are CSS custom properties on `:root`. Always use tokens, never hardcode values.

### Colors
- **Neutrals**: `--color-neutral-0` through `--color-neutral-950` (warm-tinted)
- **Accent**: `--color-accent-50` through `--color-accent-900` (green #00FE7F)
- **Semantic**: `--color-success`, `--color-warning`, `--color-error` (each has `-light` and `-dark`)
- **Aliases**: `--color-text`, `--color-text-secondary`, `--color-text-tertiary`, `--color-text-inverse`, `--color-text-accent`, `--color-text-error`
- **Surfaces**: `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-border-hover`

### Typography
- **Font**: `--font-sans` (TWK Continental), `--font-mono` (JetBrains Mono)
- **Sizes**: `--text-xs` (12px), `--text-sm` (13px), `--text-base` (14px), `--text-md` (16px), `--text-lg` (18px), `--text-xl` (20px), `--text-2xl` (24px), `--text-3xl` (30px), `--text-4xl` (40px)
- **Weights**: `--weight-light` (300), `--weight-normal` (400), `--weight-medium` (500)
- **Line heights**: `--leading-none` (1), `--leading-tight` (1.25), `--leading-snug` (1.375), `--leading-normal` (1.5), `--leading-relaxed` (1.625)
- **Letter spacing**: `--tracking-tighter` (-0.04em), `--tracking-tight` (-0.025em), `--tracking-normal` (-0.011em), `--tracking-wide` (0.025em)

### Spacing
`--space-0` (0) through `--space-24` (96px). All multiples of 4px. Key values: `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-6` (24px), `--space-8` (32px).

### Border Radius
`--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-xl` (16px), `--radius-full` (9999px)

### Shadows
`--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl` — layered shadows, each has two layers.

### Motion
- **Easing**: `--ease-default`, `--ease-emphasis` (bounce), `--ease-gentle`, `--ease-exit`
- **Duration**: `--duration-instant` (75ms), `--duration-fast` (150ms), `--duration-normal` (200ms), `--duration-slow` (300ms), `--duration-slower` (500ms)

### Z-Index
`--z-base` (0), `--z-raised` (1), `--z-dropdown` (10), `--z-sticky` (20), `--z-overlay` (30), `--z-modal` (40), `--z-toast` (50)

## Layout Primitives

```html
<!-- Vertical stack with gap -->
<div class="stack">...</div>            <!-- default gap: space-4 -->
<div class="stack stack-sm">...</div>    <!-- gap: space-2 -->
<div class="stack stack-lg">...</div>    <!-- gap: space-6 -->

<!-- Horizontal row -->
<div class="row">...</div>              <!-- gap: space-3, align center -->
<div class="row row-between">...</div>  <!-- space-between -->
<div class="row row-end">...</div>      <!-- flex-end -->
<div class="row row-wrap">...</div>     <!-- wrapping -->

<!-- Centering -->
<div class="center">...</div>

<!-- Push siblings apart -->
<div class="spacer"></div>
```

## Text Primitives

```html
<p class="text-sm text-secondary">Description text</p>
<h2 class="text-2xl font-medium">Heading</h2>
<span class="label">Field Label</span>
<span class="caption">Helper text</span>
<span class="overline">SECTION TITLE</span>
<p class="truncate">Long text that truncates...</p>
```

## Components

### Button
```html
<button class="btn">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-destructive">Delete</button>
<button class="btn btn-link">Link</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-lg">Large</button>
<button class="btn btn-icon-only"><svg>...</svg></button>
<button class="btn" data-loading>Loading</button>
<button class="btn" disabled>Disabled</button>
```

### Input
```html
<input class="input" placeholder="Text input" />
<input class="input input-sm" />
<input class="input input-error" />
<textarea class="input">Textarea</textarea>
<select class="input"><option>Option</option></select>

<!-- With icon -->
<div class="input-group">
  <svg class="input-icon">...</svg>
  <input class="input input-has-icon" />
</div>
```

### Select / Combobox (JS-powered)
```html
<div class="select">
  <button class="select-trigger">
    <span class="select-value select-placeholder">Choose...</span>
    <svg class="select-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg>
  </button>
  <div class="select-dropdown">
    <input class="select-search" placeholder="Search..." />
    <button class="select-option" data-value="1">Option 1</button>
    <button class="select-option" data-value="2">Option 2</button>
  </div>
</div>
```
Multi-select: add `data-multi` to `.select`.

### Date Picker (JS-powered)
```html
<div class="datepicker">
  <button class="datepicker-trigger">
    <svg class="datepicker-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="11" rx="2"/><path d="M2 7h12M5 1v4M11 1v4"/></svg>
    <span class="datepicker-value datepicker-placeholder">Pick a date</span>
  </button>
  <div class="datepicker-dropdown"></div>
</div>
```
Calendar auto-renders on open. Listen: `el.addEventListener('date-change', e => e.detail.date)`.

### Card
```html
<div class="card">
  <div class="card-header"><h3>Title</h3></div>
  <div class="card-content"><p>Content</p></div>
  <div class="card-footer"><button class="btn btn-sm">Action</button></div>
</div>
<div class="card card-interactive">Clickable card</div>
```

### Badge
```html
<span class="badge">Default</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Failed</span>
<span class="badge badge-accent">New</span>
```

### Tag / Chip (removable)
```html
<span class="tag">Default</span>
<span class="tag tag-accent">Design</span>
<span class="tag tag-success">Complete</span>
<span class="tag tag-outline">Filter</span>
<span class="tag">Removable <button class="tag-remove"><svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5"/></svg></button></span>
<div class="tag-group"><!-- wrapping container --></div>
```

### Avatar
```html
<div class="avatar">SI</div>
<div class="avatar avatar-sm">S</div>
<div class="avatar avatar-lg"><img src="photo.jpg" /></div>
<div class="avatar-group"><div class="avatar">A</div><div class="avatar">B</div></div>

<!-- With status -->
<div class="avatar-status avatar-status-online">
  <div class="avatar">SI</div>
  <span class="avatar-status-dot"></span>
</div>
```
Status types: `avatar-status-online`, `avatar-status-offline`, `avatar-status-busy`, `avatar-status-away`.

### Toggle / Switch
```html
<label class="toggle"><input type="checkbox" /><span></span></label>
<label class="toggle toggle-sm"><input type="checkbox" /><span></span></label>
```

### Checkbox
```html
<label class="checkbox"><input type="checkbox" /><span></span> Label</label>
```

### Radio
```html
<label class="radio"><input type="radio" name="group" /><span></span> Option</label>
```

### Alert
```html
<div class="alert">Default alert</div>
<div class="alert alert-success">Success</div>
<div class="alert alert-warning">Warning</div>
<div class="alert alert-error">Error</div>
```

### Table
```html
<table class="table">
  <thead><tr><th>Name</th><th>Email</th></tr></thead>
  <tbody><tr><td>Soren</td><td>soren@iverson.studio</td></tr></tbody>
</table>
<table class="table table-striped table-hover">...</table>
```

### Data Table (enhanced)
```html
<div class="data-table-wrapper">
  <table class="data-table">
    <thead>
      <tr>
        <th class="data-table-checkbox"><input type="checkbox" /></th>
        <th class="data-table-sortable" aria-sort="ascending">Name <span class="data-table-sort-icon">...</span></th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="data-table-checkbox"><input type="checkbox" /></td><td>Soren</td><td>soren@iverson.studio</td></tr>
    </tbody>
  </table>
</div>
```
Bulk toolbar: wrap with `.data-table-toolbar` above the wrapper.

### Tabs (JS-powered)
```html
<div>
  <div class="tabs">
    <button class="tab active" data-tab="panel1">Tab 1</button>
    <button class="tab" data-tab="panel2">Tab 2</button>
  </div>
  <div class="tab-panel active" id="panel1">Panel 1</div>
  <div class="tab-panel" id="panel2">Panel 2</div>
</div>
```
Pill variant: `<div class="tabs tabs-pill">`.

### Dropdown (JS-powered)
```html
<div class="dropdown">
  <button class="btn btn-secondary" data-dropdown>Menu</button>
  <div class="dropdown-menu">
    <button class="dropdown-item">Edit</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item dropdown-item-destructive">Delete</button>
  </div>
</div>
```
Right-align: add `dropdown-end`.

### Modal / Dialog (JS-powered)
```html
<dialog class="modal" id="my-modal">
  <div class="modal-header"><h3>Title</h3><button data-close>X</button></div>
  <div class="modal-body">Content</div>
  <div class="modal-footer"><button class="btn btn-secondary" data-close>Cancel</button><button class="btn">Save</button></div>
</dialog>
<button onclick="document.getElementById('my-modal').showModal()">Open</button>
```
Sizes: `modal-sm` (360px), default (480px), `modal-lg` (640px).

### Drawer / Sheet (JS-powered)
```html
<div class="drawer-backdrop" id="my-drawer">
  <div class="drawer">
    <div class="drawer-header"><h3>Title</h3><button data-drawer-close>X</button></div>
    <div class="drawer-body">Content</div>
    <div class="drawer-footer"><button class="btn" data-drawer-close>Done</button></div>
  </div>
</div>
<button data-drawer="my-drawer">Open Drawer</button>
```
Sizes: `drawer-sm` (320px), default (400px), `drawer-lg` (560px), `drawer-xl` (720px). Left placement: add `drawer-left` to `.drawer-backdrop`.

### Sidebar / Nav
```html
<div class="app-layout">
  <nav class="sidebar">
    <div class="sidebar-header"><img src="logo.svg" /><span>App Name</span></div>
    <div class="sidebar-section">
      <div class="sidebar-label">Section</div>
      <a class="sidebar-item active" href="#">
        <svg class="sidebar-icon">...</svg> Dashboard
        <span class="sidebar-badge">12</span>
      </a>
      <a class="sidebar-item" href="#">Settings</a>
    </div>
    <div class="sidebar-footer">Footer content</div>
  </nav>
  <main class="app-main">Page content</main>
</div>
```
Collapsed: add `sidebar-collapsed`.

### Breadcrumb
```html
<nav class="breadcrumb">
  <a class="breadcrumb-item" href="#">Home</a>
  <span class="breadcrumb-separator"></span>
  <a class="breadcrumb-item" href="#">Projects</a>
  <span class="breadcrumb-separator"></span>
  <span class="breadcrumb-item active">Details</span>
</nav>
```

### Pagination
```html
<nav class="pagination">
  <button class="pagination-item" disabled>&lt;</button>
  <button class="pagination-item active">1</button>
  <button class="pagination-item">2</button>
  <span class="pagination-ellipsis"></span>
  <button class="pagination-item">10</button>
  <button class="pagination-item">&gt;</button>
</nav>
```

### Progress Bar
```html
<div class="progress"><div class="progress-bar" style="width: 60%"></div></div>
<div class="progress progress-accent"><div class="progress-bar" style="width: 40%"></div></div>
<div class="progress progress-sm"><div class="progress-bar" style="width: 80%"></div></div>
<div class="progress progress-indeterminate"><div class="progress-bar"></div></div>
```

### Stepper
```html
<div class="stepper">
  <div class="stepper-step completed"><div class="stepper-indicator">1</div><div class="stepper-label">Details</div></div>
  <div class="stepper-step active"><div class="stepper-indicator">2</div><div class="stepper-label">Review</div></div>
  <div class="stepper-step"><div class="stepper-indicator">3</div><div class="stepper-label">Submit</div></div>
</div>
```

### Accordion (uses native `<details>`)
```html
<div class="accordion">
  <details class="accordion-item" open>
    <summary class="accordion-trigger">Section 1 <svg class="accordion-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg></summary>
    <div class="accordion-content">Content here</div>
  </details>
  <details class="accordion-item">
    <summary class="accordion-trigger">Section 2 <svg class="accordion-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg></summary>
    <div class="accordion-content">Content here</div>
  </details>
</div>
```

### Stat Card
```html
<div class="stat">
  <div class="stat-label">Revenue</div>
  <div class="stat-row">
    <div class="stat-value">$12,400</div>
    <div class="stat-trend stat-trend-up">+12%</div>
  </div>
  <div class="stat-description">vs last month</div>
</div>
<div class="stat-group"><!-- auto-grid of stat cards --></div>
```

### Empty State
```html
<div class="empty-state">
  <svg class="empty-state-icon">...</svg>
  <div class="empty-state-title">No projects yet</div>
  <div class="empty-state-description">Get started by creating your first project.</div>
  <div class="empty-state-actions"><button class="btn">Create Project</button></div>
</div>
```

### Command Palette (JS-powered, Cmd+K)
```html
<div class="command-backdrop">
  <div class="command">
    <div class="command-input-wrapper">
      <svg class="command-input-icon">...</svg>
      <input class="command-input" placeholder="Search..." />
    </div>
    <div class="command-list">
      <div class="command-group-label">Actions</div>
      <button class="command-item"><span class="command-item-label">New Project</span><span class="command-item-shortcut">Ctrl+N</span></button>
    </div>
  </div>
</div>
```

### Popover (JS-powered)
```html
<div class="popover">
  <button class="btn btn-secondary" data-popover>Click me</button>
  <div class="popover-content">
    <div class="popover-title">Title</div>
    <div class="popover-text">Rich content here</div>
  </div>
</div>
```
Placement: `popover-bottom`, `popover-start`, `popover-end`.

### File Upload
```html
<div class="file-upload">
  <input type="file" multiple />
  <svg class="file-upload-icon">...</svg>
  <div class="file-upload-title">Drop files here or click to browse</div>
  <div class="file-upload-description">PNG, JPG up to 10MB</div>
</div>
```
Listen: `el.addEventListener('file-drop', e => e.detail.files)`.

### Timeline / Activity Feed
```html
<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-dot timeline-dot-success"></div>
    <div class="timeline-header"><span class="timeline-title">Project created</span><span class="timeline-time">2h ago</span></div>
    <div class="timeline-body">Description text</div>
  </div>
</div>
```

### Tooltip (CSS-only)
```html
<span data-tooltip="Tooltip text">Hover me</span>
```

### Skeleton
```html
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-heading"></div>
<div class="skeleton skeleton-avatar"></div>
<div class="skeleton skeleton-button"></div>
```

### Spinner
```html
<div class="spinner"></div>
<div class="spinner spinner-sm"></div>
<div class="spinner spinner-lg"></div>
<div class="spinner-overlay"><div class="spinner spinner-lg"></div></div>
```

### Divider
```html
<div class="divider"></div>
```

## JS API

```js
// Toast with action button
iverson.toast('Item deleted', {
  type: 'error',
  duration: 5000,
  action: { label: 'Undo', onClick: () => restoreItem() }
});

// Toast types: 'default', 'success', 'error', 'warning'
// Set duration: 0 for persistent (no auto-dismiss)
```

## Conventions

1. Always use design tokens — never hardcode colors, spacing, or font sizes
2. Use semantic HTML (`<button>`, `<nav>`, `<dialog>`, `<details>`) whenever possible
3. Compose pages with layout primitives: `.stack`, `.row`, `.center`, `.spacer`
4. Dark mode works automatically — no extra work needed if you use token-based colors
5. All interactive components use data attributes for triggers: `data-dropdown`, `data-tab`, `data-drawer`, `data-popover`, `data-close`, `data-drawer-close`
6. The library does NOT depend on any framework — it works with React, Vue, Svelte, plain HTML, anything

# @iverson/ui

Zero-dependency vanilla CSS + JS component library for internal tools.

## Setup

### Path A — Using Claude Code (recommended)

If you use Claude Code, the fastest way to build with this library:

1. Install the package in your project:
   ```bash
   npm install @iverson/ui
   ```

2. Add two lines to your HTML or app entry:
   ```html
   <link rel="stylesheet" href="node_modules/@iverson/ui/dist/iverson.css" />
   <script type="module" src="node_modules/@iverson/ui/dist/iverson.js"></script>
   ```

   Or in a bundler (Vite, Webpack, etc.):
   ```js
   import '@iverson/ui';
   ```

3. Copy the `CLAUDE.md` file from this repo into your project root. This tells Claude Code how to use every component correctly.

4. Ask Claude to build your pages:
   > "Build me a dashboard page with a sidebar, stat cards, and a data table using @iverson/ui"

Claude will generate correct markup using the component library automatically.

---

### Path B — Manual setup

#### 1. Install

```bash
npm install @iverson/ui
```

#### 2. Add to your project

**Plain HTML:**
```html
<link rel="stylesheet" href="node_modules/@iverson/ui/dist/iverson.css" />
<script type="module" src="node_modules/@iverson/ui/dist/iverson.js"></script>
```

**Vite / bundler:**
```js
import '@iverson/ui';
```

#### 3. Start using components

```html
<button class="btn">Click me</button>
<button class="btn btn-secondary">Cancel</button>

<div class="card">
  <div class="card-header"><h3>Project</h3></div>
  <div class="card-content"><p>Details here</p></div>
</div>

<input class="input" placeholder="Search..." />
```

#### 4. Layout your pages

Use the layout primitives to structure pages:

```html
<div class="app-layout">
  <nav class="sidebar">
    <div class="sidebar-header"><span>My App</span></div>
    <a class="sidebar-item active">Dashboard</a>
    <a class="sidebar-item">Settings</a>
  </nav>
  <main class="app-main">
    <div class="stack">
      <h1 class="text-2xl font-medium">Dashboard</h1>
      <div class="stat-group">
        <div class="stat">
          <div class="stat-label">Revenue</div>
          <div class="stat-value">$12,400</div>
        </div>
      </div>
    </div>
  </main>
</div>
```

#### 5. Dark mode

Works automatically with OS preference. To toggle manually:

```js
document.documentElement.setAttribute('data-theme', 'dark');  // dark
document.documentElement.setAttribute('data-theme', 'light'); // light
document.documentElement.removeAttribute('data-theme');        // auto
```

---

## Component Reference

Browse the live kitchen sink for interactive demos of every component:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

For the full API reference, see [CLAUDE.md](./CLAUDE.md) — it documents every component, variant, size, and pattern.

## What's Included

**35 components** covering everything you need for internal tools:

| Category | Components |
|----------|-----------|
| **Actions** | Button, Dropdown, Command Palette |
| **Forms** | Input, Select/Combobox, Checkbox, Radio, Toggle, Date Picker, File Upload |
| **Data** | Table, Data Table, Stat Card, Badge, Tag/Chip, Pagination |
| **Layout** | Sidebar, Breadcrumb, Card, Divider, Tabs, Accordion |
| **Feedback** | Alert, Toast, Progress, Spinner, Skeleton, Empty State, Tooltip |
| **Overlays** | Modal, Drawer, Popover |
| **Identity** | Avatar, Avatar Status |
| **Content** | Timeline |

Plus layout primitives (`.stack`, `.row`, `.center`, `.spacer`) and text utilities.

## Development

```bash
npm install
npm run dev      # Start dev server with hot reload
npm run build    # Build to dist/
npm run preview  # Preview built output
```

## License

MIT

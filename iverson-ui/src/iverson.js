/* ========================================================================
   @iverson/ui — Minimal JS
   Dialog close handlers, toast helper, select, datepicker, command palette,
   drawer, popover, file-upload
   ======================================================================== */

import './iverson.css';

/**
 * Toast notification helper
 * Usage: iverson.toast('Changes saved', { type: 'success', duration: 3000 })
 *        iverson.toast('Deleted', { type: 'error', action: { label: 'Undo', onClick: () => {} } })
 */
const TOAST_CONTAINER_ID = 'iverson-toast-container';

function getOrCreateContainer() {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function toast(message, options = {}) {
  const { type = 'default', duration = 3000, action = null } = options;

  const container = getOrCreateContainer();

  const el = document.createElement('div');
  el.className = `toast toast-${type}`;

  const textSpan = document.createElement('span');
  textSpan.className = 'toast-message';
  textSpan.textContent = message;
  el.appendChild(textSpan);

  // Action button (e.g. "Undo")
  if (action && action.label) {
    const btn = document.createElement('button');
    btn.className = 'toast-action';
    btn.textContent = action.label;
    btn.addEventListener('click', () => {
      if (action.onClick) action.onClick();
      dismiss();
    });
    el.appendChild(btn);
  }

  container.appendChild(el);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    el.classList.add('toast-enter');
  });

  function dismiss() {
    el.classList.remove('toast-enter');
    el.classList.add('toast-exit');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }

  // Auto-dismiss
  if (duration > 0) {
    setTimeout(dismiss, duration);
  }

  return el;
}

/**
 * Tabs handler
 * Switches .active between .tab elements and matching .tab-panel
 * Uses [data-tab] attribute to match tab to panel id
 */
function initTabs() {
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab[data-tab]');
    if (!tab) return;

    const container = tab.closest('.tabs');
    if (!container) return;

    // Deactivate all tabs in this group
    container.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    // Switch panels
    const panelId = tab.getAttribute('data-tab');
    const wrapper = container.parentElement;
    wrapper.querySelectorAll('.tab-panel').forEach((p) => {
      p.classList.toggle('active', p.id === panelId);
    });
  });
}

/**
 * Dropdown menu handler
 * Toggles .open on .dropdown when clicking [data-dropdown] trigger
 */
function initDropdowns() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-dropdown]');

    // Close all open dropdowns first
    document.querySelectorAll('.dropdown.open').forEach((d) => {
      if (!trigger || d !== trigger.closest('.dropdown')) {
        d.classList.remove('open');
      }
    });

    // Toggle the clicked dropdown
    if (trigger) {
      const dropdown = trigger.closest('.dropdown');
      if (dropdown) {
        dropdown.classList.toggle('open');
        e.stopPropagation();
      }
    }
  });

  // Close dropdown when clicking an item
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.dropdown-item');
    if (item) {
      const dropdown = item.closest('.dropdown');
      if (dropdown) dropdown.classList.remove('open');
    }
  });
}

/**
 * Dialog close handlers
 * Closes <dialog> elements when clicking the backdrop or a [data-close] button
 */
function initDialogs() {
  document.addEventListener('click', (e) => {
    // Close button inside dialog
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) {
      const dialog = closeBtn.closest('dialog');
      if (dialog) dialog.close();
    }
  });

  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIALOG' && e.target.open) {
      const rect = e.target.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        e.target.close();
      }
    }
  });
}

/**
 * Select / Combobox handler
 * Toggles .open on .select, handles option selection and search filtering
 */
function initSelects() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.select-trigger');

    // Close all open selects that weren't clicked
    document.querySelectorAll('.select.open').forEach((s) => {
      if (!trigger || s !== trigger.closest('.select')) {
        s.classList.remove('open');
      }
    });

    if (trigger) {
      const select = trigger.closest('.select');
      if (select) {
        select.classList.toggle('open');
        const search = select.querySelector('.select-search');
        if (search && select.classList.contains('open')) {
          setTimeout(() => search.focus(), 50);
        }
        e.stopPropagation();
      }
      return;
    }

    // Option selection
    const option = e.target.closest('.select-option');
    if (option) {
      const select = option.closest('.select');
      if (!select) return;

      const value = option.getAttribute('data-value');
      const label = option.textContent.trim();
      const isMulti = select.hasAttribute('data-multi');

      if (isMulti) {
        option.classList.toggle('selected');
      } else {
        select.querySelectorAll('.select-option').forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const valueEl = select.querySelector('.select-value');
        if (valueEl) {
          valueEl.textContent = label;
          valueEl.classList.remove('select-placeholder');
        }
        select.classList.remove('open');
      }

      select.dispatchEvent(new CustomEvent('select-change', { detail: { value, label } }));
    }
  });

  // Search filtering
  document.addEventListener('input', (e) => {
    if (!e.target.classList.contains('select-search')) return;
    const query = e.target.value.toLowerCase();
    const select = e.target.closest('.select');
    if (!select) return;

    select.querySelectorAll('.select-option').forEach((option) => {
      const text = option.textContent.toLowerCase();
      option.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

/**
 * Date Picker handler
 * Toggles .open on .datepicker, generates calendar, handles selection
 */
function initDatepickers() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.datepicker-trigger');

    // Close all datepickers not being clicked
    document.querySelectorAll('.datepicker.open').forEach((dp) => {
      if (!trigger || dp !== trigger.closest('.datepicker')) {
        dp.classList.remove('open');
      }
    });

    if (trigger) {
      const dp = trigger.closest('.datepicker');
      if (dp) {
        dp.classList.toggle('open');
        if (dp.classList.contains('open') && !dp._rendered) {
          renderCalendar(dp, new Date());
          dp._rendered = true;
        }
        e.stopPropagation();
      }
      return;
    }

    // Day selection
    const day = e.target.closest('.datepicker-day');
    if (day && !day.disabled) {
      const dp = day.closest('.datepicker');
      if (!dp) return;

      dp.querySelectorAll('.datepicker-day').forEach((d) => d.classList.remove('selected'));
      day.classList.add('selected');

      const date = new Date(day.getAttribute('data-date'));
      const valueEl = dp.querySelector('.datepicker-value');
      if (valueEl) {
        valueEl.textContent = date.toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
        valueEl.classList.remove('datepicker-placeholder');
      }

      dp.dispatchEvent(new CustomEvent('date-change', { detail: { date } }));
      dp.classList.remove('open');
      return;
    }

    // Navigation
    const nav = e.target.closest('.datepicker-nav');
    if (nav) {
      const dp = nav.closest('.datepicker');
      if (!dp) return;
      const dir = nav.getAttribute('data-dir');
      const current = new Date(dp._currentMonth || Date.now());
      current.setMonth(current.getMonth() + (dir === 'next' ? 1 : -1));
      renderCalendar(dp, current);
    }
  });
}

function renderCalendar(dp, date) {
  dp._currentMonth = date;
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const dropdown = dp.querySelector('.datepicker-dropdown');
  if (!dropdown) return;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  let html = `
    <div class="datepicker-header">
      <button class="datepicker-nav" data-dir="prev"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 4L6 8l4 4"/></svg></button>
      <span class="datepicker-month">${monthNames[month]} ${year}</span>
      <button class="datepicker-nav" data-dir="next"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l4 4-4 4"/></svg></button>
    </div>
    <div class="datepicker-weekdays">
      ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => `<span class="datepicker-weekday">${d}</span>`).join('')}
    </div>
    <div class="datepicker-days">
  `;

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += `<button class="datepicker-day other-month" data-date="${dateStr}">${d}</button>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    html += `<button class="datepicker-day${isToday ? ' today' : ''}" data-date="${dateStr}">${d}</button>`;
  }

  // Next month days
  const totalCells = firstDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const dateStr = `${year}-${String(month + 2).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += `<button class="datepicker-day other-month" data-date="${dateStr}">${d}</button>`;
  }

  html += '</div>';
  dropdown.innerHTML = html;
}

/**
 * Command Palette handler
 * Cmd+K / Ctrl+K to open, Esc to close, arrow keys to navigate, Enter to select
 */
function initCommandPalette() {
  // Helper: get all visible command items
  function getVisibleItems(backdrop) {
    return Array.from(backdrop.querySelectorAll('.command-item')).filter(
      (item) => item.style.display !== 'none'
    );
  }

  // Helper: set focused item, clear previous
  function setFocused(backdrop, item) {
    backdrop.querySelectorAll('.command-item.focused').forEach((el) =>
      el.classList.remove('focused')
    );
    if (item) {
      item.classList.add('focused');
      item.scrollIntoView({ block: 'nearest' });
    }
  }

  // Helper: focus first visible item
  function focusFirst(backdrop) {
    const items = getVisibleItems(backdrop);
    setFocused(backdrop, items[0] || null);
  }

  document.addEventListener('keydown', (e) => {
    // Cmd+K / Ctrl+K to toggle
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const backdrop = document.querySelector('.command-backdrop');
      if (backdrop) {
        backdrop.classList.toggle('open');
        if (backdrop.classList.contains('open')) {
          const input = backdrop.querySelector('.command-input');
          if (input) setTimeout(() => input.focus(), 50);
          focusFirst(backdrop);
        }
      }
      return;
    }

    // All remaining keys only apply when palette is open
    const backdrop = document.querySelector('.command-backdrop.open');
    if (!backdrop) return;

    // Escape to close
    if (e.key === 'Escape') {
      backdrop.classList.remove('open');
      return;
    }

    // Arrow navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = getVisibleItems(backdrop);
      if (items.length === 0) return;

      const current = backdrop.querySelector('.command-item.focused');
      let index = items.indexOf(current);

      if (e.key === 'ArrowDown') {
        index = index < items.length - 1 ? index + 1 : 0;
      } else {
        index = index > 0 ? index - 1 : items.length - 1;
      }

      setFocused(backdrop, items[index]);
      return;
    }

    // Enter to select
    if (e.key === 'Enter') {
      const focused = backdrop.querySelector('.command-item.focused');
      if (focused) {
        e.preventDefault();
        focused.click();
        backdrop.classList.remove('open');
      }
      return;
    }
  });

  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('command-backdrop')) {
      e.target.classList.remove('open');
    }
  });

  // Mouse hover: transfer focused class
  document.addEventListener('mousemove', (e) => {
    const item = e.target.closest('.command-item');
    if (!item) return;
    const backdrop = item.closest('.command-backdrop');
    if (backdrop) {
      backdrop.querySelectorAll('.command-item.focused').forEach((el) =>
        el.classList.remove('focused')
      );
      item.classList.add('focused');
    }
  });

  // Search filtering + reset focus
  document.addEventListener('input', (e) => {
    if (!e.target.classList.contains('command-input')) return;
    const query = e.target.value.toLowerCase();
    const command = e.target.closest('.command');
    if (!command) return;
    const backdrop = command.closest('.command-backdrop');

    command.querySelectorAll('.command-item').forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });

    command.querySelectorAll('.command-group-label').forEach((label) => {
      const group = [];
      let next = label.nextElementSibling;
      while (next && !next.classList.contains('command-group-label')) {
        if (next.classList.contains('command-item')) group.push(next);
        next = next.nextElementSibling;
      }
      const anyVisible = group.some((item) => item.style.display !== 'none');
      label.style.display = anyVisible ? '' : 'none';
    });

    // Reset focus to first visible item
    if (backdrop) {
      focusFirst(backdrop);
    }
  });
}

/**
 * Drawer handler
 * Opens/closes drawer panels via [data-drawer] triggers
 */
function initDrawers() {
  document.addEventListener('click', (e) => {
    // Open trigger
    const trigger = e.target.closest('[data-drawer]');
    if (trigger) {
      const id = trigger.getAttribute('data-drawer');
      const backdrop = document.getElementById(id);
      if (backdrop) backdrop.classList.add('open');
      return;
    }

    // Close on backdrop click
    if (e.target.classList.contains('drawer-backdrop')) {
      e.target.classList.remove('open');
      return;
    }

    // Close button
    const closeBtn = e.target.closest('[data-drawer-close]');
    if (closeBtn) {
      const backdrop = closeBtn.closest('.drawer-backdrop');
      if (backdrop) backdrop.classList.remove('open');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.drawer-backdrop.open').forEach((d) => d.classList.remove('open'));
    }
  });
}

/**
 * Popover handler
 * Toggles .open on .popover when clicking [data-popover] trigger
 */
function initPopovers() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-popover]');

    // Close all open popovers
    document.querySelectorAll('.popover.open').forEach((p) => {
      if (!trigger || p !== trigger.closest('.popover')) {
        p.classList.remove('open');
      }
    });

    if (trigger) {
      const popover = trigger.closest('.popover');
      if (popover) {
        popover.classList.toggle('open');
        e.stopPropagation();
      }
    }
  });
}

/**
 * File upload handler
 * Drag-and-drop + click-to-browse on .file-upload elements
 */
function initFileUploads() {
  document.addEventListener('click', (e) => {
    const zone = e.target.closest('.file-upload');
    if (zone) {
      const input = zone.querySelector('input[type="file"]');
      if (input) input.click();
    }
  });

  document.querySelectorAll('.file-upload').forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      zone.dispatchEvent(new CustomEvent('file-drop', { detail: { files } }));
    });
  });
}

/**
 * Sidebar mobile toggle handler
 * Toggles .sidebar-mobile-open on .sidebar for mobile overlay behavior
 */
function initSidebar() {
  document.addEventListener('click', (e) => {
    // Toggle button
    const toggle = e.target.closest('.sidebar-toggle');
    if (toggle) {
      const layout = toggle.closest('.app-layout') || document;
      const sidebar = layout.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.toggle('sidebar-mobile-open');
      }
      return;
    }

    // Close on overlay click
    if (e.target.classList.contains('sidebar-overlay')) {
      const layout = e.target.closest('.app-layout') || document;
      const sidebar = layout.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('sidebar-mobile-open');
      }
      return;
    }

    // Close on sidebar-close button
    const closeBtn = e.target.closest('[data-sidebar-close]');
    if (closeBtn) {
      const layout = closeBtn.closest('.app-layout') || document;
      const sidebar = layout.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('sidebar-mobile-open');
      }
    }
  });

  // Close sidebar on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.sidebar.sidebar-mobile-open').forEach((s) =>
        s.classList.remove('sidebar-mobile-open')
      );
    }
  });
}

// Auto-init when DOM is ready
function init() {
  initDialogs();
  initDropdowns();
  initTabs();
  initSelects();
  initDatepickers();
  initCommandPalette();
  initDrawers();
  initPopovers();
  initFileUploads();
  initSidebar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for module usage
export {
  toast,
  initDialogs,
  initDropdowns,
  initTabs,
  initSelects,
  initDatepickers,
  initCommandPalette,
  initDrawers,
  initPopovers,
  initFileUploads,
  initSidebar,
};

// Also attach to window for script-tag usage
window.iverson = {
  toast,
  initDialogs,
  initDropdowns,
  initTabs,
  initSelects,
  initDatepickers,
  initCommandPalette,
  initDrawers,
  initPopovers,
  initFileUploads,
  initSidebar,
};

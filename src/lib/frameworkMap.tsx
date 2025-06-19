import type { JSX } from "react";
import type { ComponentData, ComponentType } from "../types/flow";

type Framework = "tailwind" | "react-native";

type ComponentDefinition = {
  render: (props: ComponentData) => JSX.Element | null;
  code: (props: ComponentData) => string;
};

export const frameworkMap: Record<Framework, Record<ComponentType, ComponentDefinition>> = {
  tailwind: {
    TextInput: {
      render: ({ label, variant }: ComponentData) => (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-900 dark:text-gray-100">{label}</label>
          <input className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-2 py-1" />
        </div>
      ),
      code: ({ label }) => `<input type="text" placeholder="${label}" />`,
    },
    PasswordInput: {
      render: ({ label, variant }: ComponentData) => (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-900 dark:text-gray-100">{label}</label>
          <input type="password" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-2 py-1" />
        </div>
      ),
      code: ({ label }) => `<input type="password" placeholder="${label}" />`,
    },
    Button: {
      render: ({ label, variant }: ComponentData) => (
        <button className={`${variant === 'secondary' ? 'bg-gray-600 dark:bg-gray-400' : 'bg-indigo-600 dark:bg-indigo-400'} text-white dark:text-gray-900 hover:bg-opacity-90 px-4 py-2 rounded transition`}>
          {label}
        </button>
      ),
      code: ({ label, variant }) => `<button class="${variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}">${label}</button>`,
    },
    Link: {
      render: ({ label, variant }: ComponentData) => (
        <a className={`${variant === 'secondary' ? 'text-gray-600 dark:text-gray-400' : 'text-blue-600 dark:text-blue-400'} underline text-sm`} href="#">
          {label}
        </a>
      ),
      code: ({ label }) => `<a href="#">${label}</a>`,
    },
    Text: {
      render: ({ label }: ComponentData) => <p className="text-sm text-gray-900 dark:text-gray-100">{label}</p>,
      code: ({ label }) => `<p>${label}</p>`,
    },
    Checkbox: {
      render: ({ label }: ComponentData) => (
        <label className="flex gap-2 items-center text-sm text-gray-900 dark:text-gray-100">
          <input type="checkbox" className="accent-indigo-600 dark:accent-indigo-400" /> {label}
        </label>
      ),
      code: ({ label }) => `<label><input type="checkbox" /> ${label}</label>`,
    },
    Heading: {
      render: ({ label }: ComponentData) => <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{label}</h2>,
      code: ({ label }) => `<h2>${label}</h2>`,
    },
    Paragraph: {
      render: ({ label }: ComponentData) => <p className="text-base text-gray-700 dark:text-gray-300">{label}</p>,
      code: ({ label }) => `<p>${label}</p>`,
    },
    Card: {
      render: ({ label }: ComponentData) => (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Card content here</p>
        </div>
      ),
      code: ({ label }) => `<div class="card">
  <h3>${label}</h3>
  <p>Card content here</p>
</div>`,
    },
    StatBlock: {
      render: ({ label }: ComponentData) => (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">123</p>
        </div>
      ),
      code: ({ label }) => `<div class="stat-block">
  <p class="stat-label">${label}</p>
  <p class="stat-value">123</p>
</div>`,
    },
    ProgressBar: {
      render: ({ label }: ComponentData) => (
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">70%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-indigo-600 dark:bg-indigo-400 h-2.5 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
      ),
      code: ({ label }) => `<div class="progress-container">
  <div class="progress-labels">
    <span>${label}</span>
    <span>70%</span>
  </div>
  <div class="progress-bar-bg">
    <div class="progress-bar" style="width: 70%"></div>
  </div>
</div>`,
    },
    Toast: {
      render: ({ label }: ComponentData) => (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">
          {label || "Notification message"}
        </div>
      ),
      code: ({ label }) => `<div class="toast">${label || "Notification message"}</div>`,
    },
    Image: {
      render: ({ label }: ComponentData) => (
        <div className="w-full">
          <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          {label && <p className="text-sm text-gray-500 mt-1">{label}</p>}
        </div>
      ),
      code: ({ label }) => `<img src="/placeholder.jpg" alt="${label || 'Image'}" />`,
    },
    Spacer: {
      render: () => <div className="h-4" />,
      code: () => `<div style="height: 16px"></div>`,
    },
    Divider: {
      render: () => <hr className="border-t border-gray-300 dark:border-gray-700 my-2" />,
      code: () => `<hr />`,
    },
    TabBar: {
      render: ({ label }: ComponentData) => (
        <div className="w-full max-w-md mx-auto rounded-2xl shadow bg-white dark:bg-gray-900 flex items-center justify-between px-4 py-2 mt-4">
          <div className="flex flex-col items-center text-purple-600">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" /></svg>
            <span className="text-xs font-medium">Home</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /></svg>
            <span className="text-xs">Wallet</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 11V7a4 4 0 118 0v4" /></svg>
            <span className="text-xs">Analytics</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 01.33 1.82A8 8 0 114.27 6.18" /></svg>
            <span className="text-xs">Settings</span>
          </div>
        </div>
      ),
      code: () => `<nav class="tab-bar">...</nav>`
    },
    TopNav: {
      render: ({ label }: ComponentData) => (
        <div className="w-full flex items-center px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          <span className="text-base font-medium text-gray-800 dark:text-gray-100">{label}</span>
        </div>
      ),
      code: ({ label }) => `<header class="top-nav">${label}</header>`
    },
    DrawerNav: {
      render: ({ label }: ComponentData) => (
        <div className="h-full w-48 bg-gray-100 dark:bg-gray-800 rounded-r-2xl shadow flex flex-col p-4 gap-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</span>
          <a className="text-gray-600 dark:text-gray-300 hover:text-purple-600" href="#">Home</a>
          <a className="text-gray-600 dark:text-gray-300 hover:text-purple-600" href="#">Profile</a>
          <a className="text-gray-600 dark:text-gray-300 hover:text-purple-600" href="#">Settings</a>
        </div>
      ),
      code: ({ label }) => `<aside class="drawer-nav">${label}</aside>`
    },
    LinkToScreen: {
      render: ({ label }: ComponentData) => (
        <a className="text-purple-600 underline hover:text-purple-800 cursor-pointer text-sm font-medium" href="#">{label}</a>
      ),
      code: ({ label }) => `<a href="#">${label}</a>`
    },
    Modal: {
      render: ({ label }: ComponentData) => (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 min-w-[300px] flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{label}</span>
          </div>
        </div>
      ),
      code: ({ label }) => `<div class="modal">${label}</div>`
    },
    Section: {
      render: ({ label, children }: ComponentData) => (
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</h3>
          <div className="flex flex-col gap-4">
            {children?.map((child, i) =>
              frameworkMap.tailwind[child.type]?.render(child)
            )}
          </div>
        </section>
      ),
      code: ({ label }) => `<section><h3>${label}</h3>...</section>`
    },
    Row: {
      render: ({ children }: ComponentData) => (
        <div className="flex flex-row gap-4 items-center w-full">
          {children?.map((child, i) =>
            frameworkMap.tailwind[child.type]?.render(child)
          )}
        </div>
      ),
      code: () => `<div class='row'>...</div>`
    },
    CardGroup: {
      render: ({ children }: ComponentData) => (
        <div className="flex flex-row gap-4 w-full">
          {children?.map((child, i) => (
            <div className="flex-1">
              {frameworkMap.tailwind[child.type]?.render(child)}
            </div>
          ))}
        </div>
      ),
      code: () => `<div class='card-group'>...</div>`
    },
    Column: {
      render: ({ children }: ComponentData) => (
        <div className="flex flex-col gap-4 w-full">
          {children?.map((child, i) =>
            frameworkMap.tailwind[child.type]?.render(child)
          )}
        </div>
      ),
      code: () => `<div class='column'>...</div>`
    },
    BottomNav: {
      render: ({ label }: ComponentData) => (
        <div className="w-full max-w-md mx-auto rounded-2xl shadow bg-white dark:bg-gray-900 flex items-center justify-between px-4 py-2 mt-4">
          <div className="flex flex-col items-center text-purple-600">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 01.33 1.82A8 8 0 114.27 6.18" /></svg>
            <span className="text-xs font-medium">{label || 'BottomNav'}</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /></svg>
            <span className="text-xs">Wallet</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 11V7a4 4 0 118 0v4" /></svg>
            <span className="text-xs">Analytics</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 01.33 1.82A8 8 0 114.27 6.18" /></svg>
            <span className="text-xs">Settings</span>
          </div>
        </div>
      ),
      code: ({ label }) => `<nav class="bottom-nav">${label || 'BottomNav'}</nav>`
    },
  },

  "react-native": {
    TextInput: {
      render: () => null,
      code: ({ label }) => `<TextInput placeholder="${label}" style={styles.input} />`,
    },
    PasswordInput: {
      render: () => null,
      code: ({ label }) => `<TextInput placeholder="${label}" secureTextEntry style={styles.input} />`,
    },
    Button: {
      render: () => null,
      code: ({ label, variant }) => `<Button title="${label}" onPress={() => {}} style={${variant === 'secondary' ? 'styles.secondaryButton' : 'styles.primaryButton'}} />`,
    },
    Link: {
      render: () => null,
      code: ({ label }) => `<Text style={styles.link}>${label}</Text>`,
    },
    Text: {
      render: () => null,
      code: ({ label }) => `<Text style={styles.text}>${label}</Text>`,
    },
    Checkbox: {
      render: () => null,
      code: ({ label }) => `<View style={styles.checkboxRow}>
    <CheckBox value={false} />
    <Text>${label}</Text>
  </View>`,
    },
    Heading: {
      render: () => null,
      code: ({ label }) => `<Text style={styles.heading}>${label}</Text>`,
    },
    Paragraph: {
      render: () => null,
      code: ({ label }) => `<Text style={styles.paragraph}>${label}</Text>`,
    },
    Card: {
      render: () => null,
      code: ({ label }) => `<View style={styles.card}>
    <Text style={styles.cardTitle}>${label}</Text>
    <Text style={styles.cardContent}>Card content here</Text>
  </View>`,
    },
    StatBlock: {
      render: () => null,
      code: ({ label }) => `<View style={styles.statBlock}>
    <Text style={styles.statLabel}>${label}</Text>
    <Text style={styles.statValue}>123</Text>
  </View>`,
    },
    ProgressBar: {
      render: () => null,
      code: ({ label }) => `<View style={styles.progressContainer}>
    <View style={styles.progressLabelRow}>
      <Text style={styles.progressLabel}>${label}</Text>
      <Text style={styles.progressValue}>70%</Text>
    </View>
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: '70%' }]} />
    </View>
  </View>`,
    },
    Toast: {
      render: () => null,
      code: ({ label }) => `<View style={styles.toast}>
    <Text style={styles.toastText}>${label || "Notification message"}</Text>
  </View>`,
    },
    Image: {
      render: () => null,
      code: ({ label }) => `<View>
    <Image source={require('../assets/placeholder.png')} style={styles.image} />
    ${label ? `<Text style={styles.imageCaption}>${label}</Text>` : ''}
  </View>`,
    },
    Spacer: {
      render: () => null,
      code: () => `<View style={{ height: 16 }} />`,
    },
    Divider: {
      render: () => null,
      code: () => `<View style={styles.divider} />`,
    },
    BottomNav: {
      render: () => null,
      code: ({ label }) => `<View style={styles.bottomNav}><Text>${label || 'BottomNav'}</Text></View>`
    },
    TabBar: {
      render: () => null,
      code: ({ label }) => `<View style={styles.tabBar}><Text>${label || 'TabBar'}</Text></View>`
    },
    TopNav: {
      render: () => null,
      code: ({ label }) => `<View style={styles.topNav}><Text>${label || 'TopNav'}</Text></View>`
    },
    DrawerNav: {
      render: () => null,
      code: ({ label }) => `<View style={styles.drawerNav}><Text>${label || 'DrawerNav'}</Text></View>`
    },
    LinkToScreen: {
      render: () => null,
      code: ({ label }) => `<Text style={styles.linkToScreen}>${label || 'LinkToScreen'}</Text>`
    },
    Modal: {
      render: () => null,
      code: ({ label }) => `<View style={styles.modal}><Text>${label || 'Modal'}</Text></View>`
    },
    Section: {
      render: () => null,
      code: ({ label }) => `<View style={styles.section}><Text>${label || 'Section'}</Text></View>`
    },
    Row: {
      render: () => null,
      code: () => `<View style={styles.row}>...</View>`
    },
    CardGroup: {
      render: () => null,
      code: () => `<View style={styles.cardGroup}>...</View>`
    },
    Column: {
      render: () => null,
      code: () => `<View style={styles.column}>...</View>`
    },
  }
};
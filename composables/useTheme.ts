const STORAGE_KEY = 'color-scheme'

export function useTheme() {
  const isDark = useState<boolean>('theme-dark', () => false)

  function applyTheme(dark: boolean) {
    isDark.value = dark
    if (!process.client) return
    const html = document.documentElement
    html.classList.add('theme-transition')
    html.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    window.setTimeout(() => html.classList.remove('theme-transition'), 280)
  }

  function toggle() {
    applyTheme(!isDark.value)
  }

  function init() {
    if (!process.client) return
    const saved = localStorage.getItem(STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved !== null ? saved === 'dark' : prefersDark
    isDark.value = dark
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }

  return { isDark, toggle, init }
}

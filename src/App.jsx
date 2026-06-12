import { useEffect, useMemo, useState } from 'react'
import {
  loadAdminSession,
  loadCustomerSession,
  loginAdmin,
  loginCustomer,
  logoutAdmin,
  logoutCustomer,
  registerCustomer,
} from './api/auth'
import { routes } from './routes.jsx'

function resolveRoute(path, isAdminAuthenticated) {
  const route = routes.find((item) => item.path === path) ?? routes[0]

  if (route.requiresAdmin && !isAdminAuthenticated) {
    return routes.find((item) => item.path === '/admin/login')
  }

  return route
}

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [customerSession, setCustomerSession] = useState(null)
  const [activeRoute, setActiveRoute] = useState(() =>
    resolveRoute(window.location.pathname, false),
  )

  useEffect(() => {
    const handlePopState = () =>
      setActiveRoute(
        resolveRoute(window.location.pathname, isAdminAuthenticated),
      )

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [isAdminAuthenticated])

  useEffect(() => {
    let isActive = true

    async function loadSessions() {
      const [customer, admin] = await Promise.all([
        loadCustomerSession(),
        loadAdminSession(),
      ])

      if (!isActive) return

      setCustomerSession(customer)
      setIsAdminAuthenticated(Boolean(admin))
      setActiveRoute(resolveRoute(window.location.pathname, Boolean(admin)))
    }

    loadSessions()

    return () => {
      isActive = false
    }
  }, [])

  const Page = activeRoute.component
  const isAdminArea = activeRoute.group === 'admin'
  const usesAuthLayout = activeRoute.layout === 'auth'
  const menuRoutes = useMemo(
    () =>
      routes.filter(
        (route) => route.showInMenu && route.group === activeRoute.group,
      ),
    [activeRoute.group],
  )

  function navigateTo(path) {
    const nextRoute = routes.find((route) => route.path === path) ?? routes[0]
    const safePath =
      nextRoute.requiresAdmin && !isAdminAuthenticated ? '/admin/login' : path

    if (safePath === window.location.pathname) return

    window.history.pushState({}, '', safePath)
    setActiveRoute(resolveRoute(safePath, isAdminAuthenticated))
  }

  async function handleAdminLogin(credentials) {
    await loginAdmin(credentials)
    setIsAdminAuthenticated(true)
    window.history.pushState({}, '', '/admin')
    setActiveRoute(resolveRoute('/admin', true))
  }

  function handleAdminLogout() {
    logoutAdmin()
    setIsAdminAuthenticated(false)
    navigateTo('/')
  }

  async function handleCustomerSignup({ name, phone, password }) {
    const user = await registerCustomer({ name, phone, password })
    setCustomerSession(user)
  }

  async function handleCustomerLogin({ phone, password }) {
    const user = await loginCustomer({ phone, password })
    setCustomerSession(user)
  }

  function handleCustomerLogout() {
    logoutCustomer()
    setCustomerSession(null)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_28rem),linear-gradient(135deg,#09090b_0%,#18181b_48%,#09090b_100%)] text-zinc-50">
      <div
        className={`mx-auto flex min-h-screen w-full flex-col ${
          usesAuthLayout ? 'max-w-7xl' : 'max-w-7xl lg:flex-row'
        }`}
      >
        {!usesAuthLayout && (
          <aside className="border-b border-white/10 bg-zinc-950/85 px-5 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center justify-between gap-4 lg:block">
            <a
              href={isAdminArea ? '/admin' : '/inicio'}
              onClick={(event) => {
                event.preventDefault()
                navigateTo(isAdminArea ? '/admin' : '/inicio')
              }}
              className="group block"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-lg border border-amber-400/30 bg-amber-400/10 text-sm font-black text-amber-300 shadow-lg shadow-amber-950/20">
                  DG
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                    Agenda DG
                  </span>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight transition group-hover:text-amber-100">
                    {isAdminArea ? 'Administrador' : 'Barbearia'}
                  </h1>
                </div>
              </div>
            </a>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 lg:mt-6 lg:inline-block">
              {isAdminArea ? 'Acesso admin' : 'Recepcao'}
            </span>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0">
            {menuRoutes.map((route) => {
              const isActive = route.path === activeRoute.path

              return (
                <a
                  key={route.path}
                  href={route.path}
                  onClick={(event) => {
                    event.preventDefault()
                    navigateTo(route.path)
                  }}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-amber-400 text-zinc-950 shadow-lg shadow-amber-950/20'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {route.label}
                </a>
              )
            })}
          </nav>

          {isAdminArea && (
            <div className="mt-6 hidden border-t border-white/10 pt-5 lg:block">
              <button
                type="button"
                onClick={handleAdminLogout}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-left text-sm font-semibold text-zinc-300 transition hover:border-amber-400/60 hover:text-white"
              >
                Sair do admin
              </button>
            </div>
          )}
          </aside>
        )}

        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <Page
            activeRoute={activeRoute}
            customerSession={customerSession}
            isAdminAuthenticated={isAdminAuthenticated}
            navigateTo={navigateTo}
            onAdminLogin={handleAdminLogin}
            onCustomerLogin={handleCustomerLogin}
            onCustomerLogout={handleCustomerLogout}
            onCustomerSignup={handleCustomerSignup}
            routes={menuRoutes}
          />
        </main>
      </div>
    </div>
  )
}

export default App

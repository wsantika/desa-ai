import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const SW_INIT_SCRIPT = `if('serviceWorker' in navigator && window.location.protocol.startsWith('http')){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(e){console.debug('[SW] register note:',e);});});}`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover',
      },
      {
        title: 'Desa Tegal Tugu: Platform Layanan Warga Cerdas (DesaAI)',
      },
      {
        name: 'description',
        content:
          'Portal pelayanan mandiri surat warga, pengaduan fasilitas lingkungan, dan asisten AI Made Tegal Tugu.',
      },
      {
        name: 'theme-color',
        content: '#1d4ed8',
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'Desa Tegal Tugu',
      },
    ],
    links: [
      {
        rel: 'manifest',
        href: '/manifest.webmanifest',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/icons/icon.svg',
      },
      {
        rel: 'apple-touch-icon',
        href: '/icons/apple-touch-icon.png',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-blue-100 selection:text-blue-900">
        <Header />
        <main className="min-h-[calc(100vh-140px)]">
          {children}
        </main>
        <Footer />
        <BottomNav />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <script dangerouslySetInnerHTML={{ __html: SW_INIT_SCRIPT }} />
        <Scripts />
      </body>
    </html>
  )
}

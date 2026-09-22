// Service Worker for Desa Mandara PWA
const CACHE_NAME = 'desa-mandara-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching warning:', err)
      })
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  // Only handle GET requests and exclude server functions / API calls
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  
  if (url.pathname.startsWith('/_server') || url.pathname.startsWith('/api')) {
    return
  }

  // Network-first with cache fallback for navigation, cache-first for static icons
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/') || caches.match(request)
      })
    )
    return
  }

  if (url.pathname.startsWith('/icons/') || url.pathname.endsWith('.svg') || url.pathname.endsWith('.png')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          if (response.status === 200) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
      })
    )
    return
  }
})

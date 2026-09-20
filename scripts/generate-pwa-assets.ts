import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons')

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true })
}

// 1. Vector SVG Icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2F6A4A" />
      <stop offset="100%" stop-color="#1E4833" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60D7CF" />
      <stop offset="100%" stop-color="#4FB8B2" />
    </linearGradient>
  </defs>
  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  
  <!-- Subtle inner border -->
  <rect x="16" y="16" width="480" height="480" rx="96" fill="none" stroke="#60D7CF" stroke-opacity="0.25" stroke-width="6" />

  <!-- Village Crown / Balai Desa Gateway Roof Motif -->
  <g transform="translate(0, 8)">
    <!-- Top ornamental spire -->
    <polygon points="256,90 270,126 242,126" fill="url(#accentGrad)" />
    
    <!-- Upper roof tier -->
    <path d="M190 150 C210 135, 302 135, 322 150 L346 178 C310 166, 202 166, 166 178 Z" fill="#FFFFFF" opacity="0.95" />
    
    <!-- Middle roof tier -->
    <path d="M148 200 C180 182, 332 182, 364 200 L394 236 C340 220, 172 220, 118 236 Z" fill="#FFFFFF" opacity="0.95" />
    
    <!-- Lower main roof tier -->
    <path d="M106 260 C150 238, 362 238, 406 260 L436 304 C360 282, 152 282, 76 304 Z" fill="url(#accentGrad)" />

    <!-- Pillars / Candi Bentar Gates -->
    <rect x="156" y="318" width="36" height="96" rx="6" fill="#FFFFFF" opacity="0.9" />
    <rect x="320" y="318" width="36" height="96" rx="6" fill="#FFFFFF" opacity="0.9" />
    <rect x="224" y="338" width="64" height="76" rx="4" fill="#FFFFFF" opacity="0.4" />
    
    <!-- Base foundation -->
    <rect x="116" y="414" width="280" height="18" rx="9" fill="#FFFFFF" opacity="0.9" />
  </g>
</svg>
`

fs.writeFileSync(path.join(ICONS_DIR, 'icon.svg'), svgIcon, 'utf-8')
console.log('✓ Created public/icons/icon.svg')

// CRC32 helper for PNG generation
function crc32(buf: Buffer): number {
  const table: number[] = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c
  }
  let crc = 0 ^ -1
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff]
  }
  return (crc ^ -1) >>> 0
}

function makeChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeAndData), 0)
  return Buffer.concat([len, typeAndData, crc])
}

// Generates an attractive PNG icon with emerald green background and symbol
function generateAppPng(size: number): Buffer {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)
  ihdrData.writeUInt32BE(size, 4)
  ihdrData.writeUInt8(8, 8) // 8-bit
  ihdrData.writeUInt8(6, 9) // RGBA
  ihdrData.writeUInt8(0, 10)
  ihdrData.writeUInt8(0, 11)
  ihdrData.writeUInt8(0, 12)
  const ihdr = makeChunk('IHDR', ihdrData)

  const raw = Buffer.alloc(size * (size * 4 + 1))
  let offset = 0
  const cornerRadius = size * 0.22
  const center = size / 2

  for (let y = 0; y < size; y++) {
    raw.writeUInt8(0, offset++) // Filter byte 0
    for (let x = 0; x < size; x++) {
      // Check rounded rectangle bounds
      let inside = true
      const clampedX = Math.max(cornerRadius, Math.min(size - cornerRadius, x))
      const clampedY = Math.max(cornerRadius, Math.min(size - cornerRadius, y))
      const dx = x - clampedX
      const dy = y - clampedY
      if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
        inside = false
      }

      if (!inside) {
        raw.writeUInt8(0, offset++)
        raw.writeUInt8(0, offset++)
        raw.writeUInt8(0, offset++)
        raw.writeUInt8(0, offset++)
        continue
      }

      // Inside icon - Emerald gradient #2F6A4A -> #1E4833
      const normY = y / size
      const r = Math.round(47 * (1 - normY * 0.35))
      const g = Math.round(106 * (1 - normY * 0.32))
      const b = Math.round(74 * (1 - normY * 0.31))

      // Central symbol: gateway / roof shape
      const normX = x / size
      const roofPeakY = 0.28
      const roofBaseY = 0.58
      const isRoof =
        normY >= roofPeakY &&
        normY <= roofBaseY &&
        Math.abs(normX - 0.5) <= (normY - roofPeakY) * 0.8
      const isPillarLeft =
        normY >= 0.58 && normY <= 0.82 && normX >= 0.32 && normX <= 0.4
      const isPillarRight =
        normY >= 0.58 && normY <= 0.82 && normX >= 0.6 && normX <= 0.68
      const isBase =
        normY >= 0.82 && normY <= 0.86 && normX >= 0.24 && normX <= 0.76

      if (isRoof || isPillarLeft || isPillarRight || isBase) {
        // Crisp White / Cyan-tinted foreground
        raw.writeUInt8(250, offset++)
        raw.writeUInt8(255, offset++)
        raw.writeUInt8(252, offset++)
        raw.writeUInt8(255, offset++)
      } else {
        // Emerald background
        raw.writeUInt8(r, offset++)
        raw.writeUInt8(g, offset++)
        raw.writeUInt8(b, offset++)
        raw.writeUInt8(255, offset++)
      }
    }
  }

  const idat = makeChunk('IDAT', zlib.deflateSync(raw))
  const iend = makeChunk('IEND', Buffer.alloc(0))
  return Buffer.concat([sig, ihdr, idat, iend])
}

// Generate standard PWA PNG sizes
fs.writeFileSync(path.join(ICONS_DIR, 'icon-192.png'), generateAppPng(192))
console.log('✓ Created public/icons/icon-192.png')

fs.writeFileSync(path.join(ICONS_DIR, 'icon-512.png'), generateAppPng(512))
console.log('✓ Created public/icons/icon-512.png')

fs.writeFileSync(path.join(ICONS_DIR, 'apple-touch-icon.png'), generateAppPng(180))
console.log('✓ Created public/icons/apple-touch-icon.png')

// 2. Web App Manifest
const manifest = {
  name: 'Desa Mandara — Platform Layanan Warga Cerdas',
  short_name: 'Desa Mandara',
  description:
    'Portal pelayanan mandiri surat desa, pengaduan fasilitas lingkungan, dan asisten percakapan cerdas Made Mandara.',
  start_url: '/',
  id: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#F3FAF5',
  theme_color: '#2F6A4A',
  orientation: 'portrait-primary',
  icons: [
    {
      src: '/icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/icons/icon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any maskable',
    },
  ],
  categories: ['government', 'productivity', 'utilities'],
  lang: 'id-ID',
}

fs.writeFileSync(
  path.join(PUBLIC_DIR, 'manifest.webmanifest'),
  JSON.stringify(manifest, null, 2),
  'utf-8'
)
console.log('✓ Created public/manifest.webmanifest')

// 3. Lightweight, reliable Service Worker
const serviceWorker = `// Service Worker for Desa Mandara PWA
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
`

fs.writeFileSync(path.join(PUBLIC_DIR, 'sw.js'), serviceWorker, 'utf-8')
console.log('✓ Created public/sw.js')

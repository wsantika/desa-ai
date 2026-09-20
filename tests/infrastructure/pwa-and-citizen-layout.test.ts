import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

describe('Issue #11: Citizen Platform Layout & PWA Configuration', () => {
  const rootDir = process.cwd()
  const publicDir = path.join(rootDir, 'public')
  const manifestPath = path.join(publicDir, 'manifest.webmanifest')
  const swPath = path.join(publicDir, 'sw.js')
  const iconsDir = path.join(publicDir, 'icons')

  it('validates manifest.webmanifest structure, branding, and standalone display', () => {
    assert.ok(fs.existsSync(manifestPath), 'manifest.webmanifest must exist in public directory')

    const raw = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(raw)

    assert.equal(manifest.name, 'Desa Mandara — Platform Layanan Warga Cerdas')
    assert.equal(manifest.short_name, 'Desa Mandara')
    assert.equal(manifest.display, 'standalone')
    assert.equal(manifest.start_url, '/')
    assert.equal(manifest.theme_color, '#2F6A4A')
    assert.ok(Array.isArray(manifest.icons), 'manifest must have an icons array')
    assert.ok(manifest.icons.length >= 2, 'manifest must have at least 2 icon sizes')

    // Check that each icon referenced actually exists on disk
    for (const icon of manifest.icons) {
      const relPath = icon.src.replace(/^\//, '')
      const fullIconPath = path.join(publicDir, relPath)
      assert.ok(
        fs.existsSync(fullIconPath),
        `Icon file ${icon.src} must exist at ${fullIconPath}`
      )
    }
  })

  it('validates PWA icons byte size and vector SVG integrity', () => {
    const svgPath = path.join(iconsDir, 'icon.svg')
    const png192Path = path.join(iconsDir, 'icon-192.png')
    const png512Path = path.join(iconsDir, 'icon-512.png')
    const appleIconPath = path.join(iconsDir, 'apple-touch-icon.png')

    assert.ok(fs.existsSync(svgPath), 'icon.svg must exist')
    assert.ok(fs.existsSync(png192Path), 'icon-192.png must exist')
    assert.ok(fs.existsSync(png512Path), 'icon-512.png must exist')
    assert.ok(fs.existsSync(appleIconPath), 'apple-touch-icon.png must exist')

    const svgContent = fs.readFileSync(svgPath, 'utf-8')
    assert.ok(svgContent.includes('<svg'), 'icon.svg must contain valid SVG tag')
    assert.ok(svgContent.includes('viewBox="0 0 512 512"'), 'icon.svg must have 512x512 viewBox')

    const png192Stat = fs.statSync(png192Path)
    assert.ok(png192Stat.size > 500, 'icon-192.png must have valid non-empty byte size')

    const png512Stat = fs.statSync(png512Path)
    assert.ok(png512Stat.size > 1000, 'icon-512.png must have valid non-empty byte size')
  })

  it('validates Service Worker caching and event listener setup in public/sw.js', () => {
    assert.ok(fs.existsSync(swPath), 'sw.js must exist')

    const swContent = fs.readFileSync(swPath, 'utf-8')
    assert.ok(swContent.includes('CACHE_NAME'), 'SW must define cache name')
    assert.ok(swContent.includes('desa-mandara-v1'), 'SW must use desa-mandara cache version')
    assert.ok(swContent.includes('addEventListener(\'install\''), 'SW must have install handler')
    assert.ok(swContent.includes('addEventListener(\'activate\''), 'SW must have activate handler')
    assert.ok(swContent.includes('addEventListener(\'fetch\''), 'SW must have fetch handler')
  })

  it('validates citizen platform routes are registered in route tree', () => {
    const routeTreePath = path.join(rootDir, 'src', 'routeTree.gen.ts')
    assert.ok(fs.existsSync(routeTreePath), 'routeTree.gen.ts must exist')

    const content = fs.readFileSync(routeTreePath, 'utf-8')
    assert.ok(content.includes("'/asisten'"), 'asisten route must be registered')
    assert.ok(content.includes("'/layanan'"), 'layanan route must be registered')
    assert.ok(content.includes("'/pengaduan'"), 'pengaduan route must be registered')
  })

  it('validates mobile safe-area insets and bottom navigation layout integration', () => {
    const rootRoutePath = path.join(rootDir, 'src', 'routes', '__root.tsx')
    const rootContent = fs.readFileSync(rootRoutePath, 'utf-8')

    assert.ok(rootContent.includes('<BottomNav />'), '__root.tsx must include BottomNav component')
    assert.ok(rootContent.includes('manifest.webmanifest'), '__root.tsx must link manifest')
    assert.ok(rootContent.includes('viewport-fit=cover'), '__root.tsx must include viewport-fit=cover for mobile notches')

    const bottomNavPath = path.join(rootDir, 'src', 'components', 'BottomNav.tsx')
    const bottomNavContent = fs.readFileSync(bottomNavPath, 'utf-8')
    assert.ok(bottomNavContent.includes('safe-area-inset-bottom'), 'BottomNav must account for safe-area insets')
    assert.ok(bottomNavContent.includes('sm:hidden'), 'BottomNav must be mobile-first and hidden on desktop')
  })
})

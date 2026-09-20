import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { POPULAR_PROMPTS } from '../../src/components/chat/QuickPromptChips.js'

describe('Issue #12: AI Village Assistant Interactive Chat Room', () => {
  const rootDir = process.cwd()

  it('validates popular quick prompt chips structure and coverage', () => {
    assert.ok(Array.isArray(POPULAR_PROMPTS), 'POPULAR_PROMPTS must be an array')
    assert.ok(POPULAR_PROMPTS.length >= 4, 'Must have at least 4 popular prompts')

    const labels = POPULAR_PROMPTS.map((p) => p.label)
    assert.ok(
      labels.some((l) => l.includes('Domisili')),
      'Must contain Domisili prompt'
    )
    assert.ok(
      labels.some((l) => l.includes('Jam Layanan')),
      'Must contain Jam Layanan prompt'
    )
    assert.ok(
      labels.some((l) => l.includes('Bansos') || l.includes('SKTM')),
      'Must contain Bansos/SKTM prompt'
    )
    assert.ok(
      labels.some((l) => l.includes('SKU') || l.includes('Usaha')),
      'Must contain SKU prompt'
    )

    for (const prompt of POPULAR_PROMPTS) {
      assert.ok(prompt.id, 'Prompt must have an id')
      assert.ok(prompt.label, 'Prompt must have a label')
      assert.ok(prompt.query.length > 10, 'Prompt must have a descriptive query string')
      assert.ok(prompt.category, 'Prompt must have a category')
    }
  })

  it('validates TypingIndicator component markup and accessibility', () => {
    const typingIndicatorPath = path.join(
      rootDir,
      'src',
      'components',
      'chat',
      'TypingIndicator.tsx'
    )
    assert.ok(fs.existsSync(typingIndicatorPath), 'TypingIndicator.tsx must exist')

    const content = fs.readFileSync(typingIndicatorPath, 'utf-8')
    assert.ok(content.includes('aria-live="polite"'), 'Must have aria-live for screen readers')
    assert.ok(content.includes('animate-bounce'), 'Must have animated dots for typing state')
    assert.ok(content.includes('Made Mandara'), 'Must reference Made Mandara')
  })

  it('validates MarkdownContent renderer support for lists, bold, and headings', () => {
    const markdownPath = path.join(
      rootDir,
      'src',
      'components',
      'chat',
      'MarkdownContent.tsx'
    )
    assert.ok(fs.existsSync(markdownPath), 'MarkdownContent.tsx must exist')

    const content = fs.readFileSync(markdownPath, 'utf-8')
    assert.ok(content.includes('list-disc'), 'Must support bullet lists')
    assert.ok(content.includes('list-decimal'), 'Must support ordered lists')
    assert.ok(content.includes('strong'), 'Must support bold styling')
    assert.ok(content.includes('chat-markdown'), 'Must have chat-markdown container')
  })

  it('validates local session history persistence in asisten route', () => {
    const asistenRoutePath = path.join(rootDir, 'src', 'routes', 'asisten.tsx')
    assert.ok(fs.existsSync(asistenRoutePath), 'asisten.tsx route must exist')

    const content = fs.readFileSync(asistenRoutePath, 'utf-8')
    assert.ok(
      content.includes('localStorage.getItem'),
      'Must load chat history from localStorage'
    )
    assert.ok(
      content.includes('localStorage.setItem'),
      'Must persist chat history to localStorage'
    )
    assert.ok(
      content.includes('handleResetChat'),
      'Must provide reset/clear conversation capability'
    )
    assert.ok(
      content.includes('handleCopy'),
      'Must provide copy message functionality'
    )
    assert.ok(
      content.includes('<TypingIndicator'),
      'Must render typing indicator when loading'
    )
    assert.ok(
      content.includes('<QuickPromptChips'),
      'Must render quick prompt chips'
    )
  })
})

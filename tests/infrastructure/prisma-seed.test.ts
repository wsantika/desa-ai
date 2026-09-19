import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { banjarsSeedData } from '../../prisma/seed-data/banjars.data.js'
import { knowledgeSeedData } from '../../prisma/seed-data/knowledge.data.js'
import { serviceTypesSeedData } from '../../prisma/seed-data/service-types.data.js'
import { usersSeedData } from '../../prisma/seed-data/users.data.js'

describe('Database Seed Datasets Integrity', () => {
  it('validates master banjars dataset', () => {
    assert.ok(banjarsSeedData.length >= 3, 'Must have at least 3 banjars')
    const ids = new Set<string>()
    for (const b of banjarsSeedData) {
      assert.ok(b.id, 'Banjar must have id')
      assert.ok(b.name.startsWith('Banjar'), 'Banjar name must be valid')
      assert.ok(b.dusun, 'Banjar must belong to dusun')
      assert.ok(b.leaderName, 'Banjar must have leader name')
      assert.ok(!ids.has(b.id), `Duplicate Banjar ID: ${b.id}`)
      ids.add(b.id)
    }
  })

  it('validates service catalog dataset', () => {
    assert.ok(
      serviceTypesSeedData.length >= 4,
      'Must have at least 4 service types',
    )
    const codes = new Set<string>()
    const validCodes = ['DOMISILI', 'SKU', 'SKCK', 'SKTM']

    for (const st of serviceTypesSeedData) {
      assert.ok(validCodes.includes(st.code), `Invalid code: ${st.code}`)
      assert.ok(!codes.has(st.code), `Duplicate service code: ${st.code}`)
      codes.add(st.code)
      assert.ok(st.title, 'Service title must be present')
      assert.ok(
        st.requiredDocs.length > 0,
        'Service must list required documents',
      )
      assert.ok(st.estimatedDays >= 1, 'Estimated days must be >= 1')
      assert.equal(st.isActive, true)
    }
  })

  it('validates demo users and citizen profiles dataset', () => {
    assert.ok(usersSeedData.length >= 3, 'Must have at least 3 demo users')
    const emails = new Set<string>()
    const niks = new Set<string>()
    const banjarIds = new Set(banjarsSeedData.map((b) => b.id))

    const roles = new Set(usersSeedData.map((u) => u.role))
    assert.ok(roles.has('ADMIN'), 'Must have ADMIN user')
    assert.ok(roles.has('VILLAGE_OFFICER'), 'Must have VILLAGE_OFFICER user')
    assert.ok(roles.has('CITIZEN'), 'Must have CITIZEN user')

    for (const u of usersSeedData) {
      assert.ok(!emails.has(u.email), `Duplicate email: ${u.email}`)
      emails.add(u.email)
      assert.ok(u.phone, 'User must have phone number')
      assert.ok(u.passwordHash, 'User must have password hash')

      // Profile validation
      assert.equal(
        u.profile.nik.length,
        16,
        `NIK must be 16 digits: ${u.profile.nik}`,
      )
      assert.ok(!niks.has(u.profile.nik), `Duplicate NIK: ${u.profile.nik}`)
      niks.add(u.profile.nik)
      assert.ok(u.profile.fullName, 'Profile must have full name')
      assert.ok(
        ['L', 'P'].includes(u.profile.gender),
        'Gender must be L or P',
      )
      assert.ok(
        banjarIds.has(u.profile.banjarId),
        `Profile banjarId ${u.profile.banjarId} must exist in banjars dataset`,
      )
    }
  })

  it('validates knowledge base and regulation dataset', () => {
    assert.ok(
      knowledgeSeedData.length >= 3,
      'Must have at least 3 knowledge docs',
    )
    const validCategories = ['REGULASI', 'SOP_LAYANAN', 'FAQ', 'PROFIL_DESA']
    const ids = new Set<string>()

    for (const doc of knowledgeSeedData) {
      assert.ok(!ids.has(doc.id), `Duplicate knowledge doc ID: ${doc.id}`)
      ids.add(doc.id)
      assert.ok(
        validCategories.includes(doc.category),
        `Invalid category: ${doc.category}`,
      )
      assert.ok(doc.title, 'Doc must have title')
      assert.ok(doc.contentText, 'Doc must have contentText')
      assert.ok(doc.chunks.length > 0, 'Doc must have pre-computed chunks')
    }
  })
})

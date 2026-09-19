export interface BanjarSeedItem {
  id: string
  name: string
  dusun: string
  leaderName: string
  leaderPhone: string
}

export const banjarsSeedData: BanjarSeedItem[] = [
  {
    id: 'banjar-kaja',
    name: 'Banjar Kaja',
    dusun: 'Dusun Kangin',
    leaderName: 'I Wayan Koster Wijaya',
    leaderPhone: '081234567891',
  },
  {
    id: 'banjar-kelod',
    name: 'Banjar Kelod',
    dusun: 'Dusun Kawan',
    leaderName: 'I Made Rai Suartana',
    leaderPhone: '081234567892',
  },
  {
    id: 'banjar-tengah',
    name: 'Banjar Tengah',
    dusun: 'Dusun Tengah',
    leaderName: 'I Nyoman Giri Sentana',
    leaderPhone: '081234567893',
  },
  {
    id: 'banjar-kangin',
    name: 'Banjar Kangin',
    dusun: 'Dusun Kangin',
    leaderName: 'I Ketut Sudikerta Putra',
    leaderPhone: '081234567894',
  },
]

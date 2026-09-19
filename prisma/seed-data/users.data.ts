export interface UserSeedItem {
  id: string
  email: string
  phone: string
  passwordHash: string
  role: 'ADMIN' | 'VILLAGE_OFFICER' | 'CITIZEN'
  profile: {
    nik: string
    fullName: string
    gender: 'L' | 'P'
    birthPlace: string
    birthDate: Date
    occupation: string
    address: string
    banjarId: string
  }
}

export const usersSeedData: UserSeedItem[] = [
  {
    id: 'user-admin-01',
    email: 'admin@desa-ai.id',
    phone: '081111111111',
    passwordHash:
      '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xgncxI6WEYm6W6WpZye', // demo password: Password123!
    role: 'ADMIN',
    profile: {
      nik: '5171010101800001',
      fullName: 'I Gusti Ngurah Agung (Admin Sistem Desa)',
      gender: 'L',
      birthPlace: 'Denpasar',
      birthDate: new Date('1980-01-01'),
      occupation: 'Administrator TI & Sekretaris Desa',
      address: 'Jl. Veteran No. 1, Kantor Desa Mandara',
      banjarId: 'banjar-tengah',
    },
  },
  {
    id: 'user-officer-01',
    email: 'petugas@desa-ai.id',
    phone: '082222222222',
    passwordHash:
      '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xgncxI6WEYm6W6WpZye', // demo password: Password123!
    role: 'VILLAGE_OFFICER',
    profile: {
      nik: '5171010202850002',
      fullName: 'Ni Made Sri Wahyuni (Petugas Layanan Terpadu)',
      gender: 'P',
      birthPlace: 'Gianyar',
      birthDate: new Date('1985-02-02'),
      occupation: 'Kepala Seksi Pelayanan Masyarakat',
      address: 'Jl. Hayam Wuruk No. 12, Banjar Kaja',
      banjarId: 'banjar-kaja',
    },
  },
  {
    id: 'user-citizen-01',
    email: 'warga@desa-ai.id',
    phone: '083333333333',
    passwordHash:
      '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xgncxI6WEYm6W6WpZye', // demo password: Password123!
    role: 'CITIZEN',
    profile: {
      nik: '5171010303920003',
      fullName: 'I Wayan Agus Pratama',
      gender: 'L',
      birthPlace: 'Denpasar',
      birthDate: new Date('1992-03-03'),
      occupation: 'Pengrajin Kriya Perak & Wiraswasta',
      address: 'Gang Sandat No. 5, Banjar Kaja',
      banjarId: 'banjar-kaja',
    },
  },
  {
    id: 'user-citizen-02',
    email: 'ketut.dewi@desa-ai.id',
    phone: '084444444444',
    passwordHash:
      '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xgncxI6WEYm6W6WpZye', // demo password: Password123!
    role: 'CITIZEN',
    profile: {
      nik: '5171010404950004',
      fullName: 'Ni Ketut Dewi Lestari',
      gender: 'P',
      birthPlace: 'Badung',
      birthDate: new Date('1995-04-04'),
      occupation: 'Tenaga Pengajar SD Negeri 1',
      address: 'Jl. Melati No. 8, Banjar Kelod',
      banjarId: 'banjar-kelod',
    },
  },
]

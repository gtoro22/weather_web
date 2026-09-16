import type { AppUser } from '@/types'

/** Avatar generado a partir de las iniciales; evita imágenes externas. */
export function initialsAvatar(name: string): string {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
  const palette = ['#1677ff', '#13c2c2', '#722ed1', '#fa8c16', '#52c41a', '#eb2f96']
  const color = palette[name.length % palette.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <rect width="96" height="96" rx="48" fill="${color}"/>
    <text x="48" y="60" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif"
          font-size="36" fill="#ffffff">${initials}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString()
}

const RAW_USERS: Array<Omit<AppUser, 'avatarUrl'>> = [
  {
    id: 'u01',
    name: 'Valeria Ortiz',
    email: 'valeria.ortiz@insight.io',
    role: 'administrador',
    status: 'activo',
    createdAt: daysAgo(412),
  },
  {
    id: 'u02',
    name: 'Mateo Rojas',
    email: 'mateo.rojas@insight.io',
    role: 'analista',
    status: 'activo',
    createdAt: daysAgo(365),
  },
  {
    id: 'u03',
    name: 'Camila Duarte',
    email: 'camila.duarte@insight.io',
    role: 'analista',
    status: 'activo',
    createdAt: daysAgo(298),
  },
  {
    id: 'u04',
    name: 'Joaquín Bravo',
    email: 'joaquin.bravo@insight.io',
    role: 'lector',
    status: 'inactivo',
    createdAt: daysAgo(254),
  },
  {
    id: 'u05',
    name: 'Renata Salas',
    email: 'renata.salas@insight.io',
    role: 'administrador',
    status: 'activo',
    createdAt: daysAgo(221),
  },
  {
    id: 'u06',
    name: 'Andrés Peña',
    email: 'andres.pena@insight.io',
    role: 'lector',
    status: 'pendiente',
    createdAt: daysAgo(180),
  },
  {
    id: 'u07',
    name: 'Lucía Márquez',
    email: 'lucia.marquez@insight.io',
    role: 'analista',
    status: 'activo',
    createdAt: daysAgo(154),
  },
  {
    id: 'u08',
    name: 'Tomás Herrera',
    email: 'tomas.herrera@insight.io',
    role: 'lector',
    status: 'activo',
    createdAt: daysAgo(121),
  },
  {
    id: 'u09',
    name: 'Paula Rivas',
    email: 'paula.rivas@insight.io',
    role: 'analista',
    status: 'inactivo',
    createdAt: daysAgo(96),
  },
  {
    id: 'u10',
    name: 'Diego Fuentes',
    email: 'diego.fuentes@insight.io',
    role: 'lector',
    status: 'pendiente',
    createdAt: daysAgo(64),
  },
  {
    id: 'u11',
    name: 'Sofía Bermúdez',
    email: 'sofia.bermudez@insight.io',
    role: 'analista',
    status: 'activo',
    createdAt: daysAgo(41),
  },
  {
    id: 'u12',
    name: 'Iván Castaño',
    email: 'ivan.castano@insight.io',
    role: 'lector',
    status: 'activo',
    createdAt: daysAgo(17),
  },
]

export const MOCK_USERS: AppUser[] = RAW_USERS.map((user) => ({
  ...user,
  avatarUrl: initialsAvatar(user.name),
}))

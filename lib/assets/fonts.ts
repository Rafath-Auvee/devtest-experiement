import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
})

export const fontAwesomeSolid = localFont({
  src: '../../public/fonts/fa-solid-900.woff2',
  weight: '900',
  style: 'normal',
  display: 'block',
  variable: '--fa-solid',
})

export const fontAwesomeRegular = localFont({
  src: '../../public/fonts/fa-regular-400.woff2',
  weight: '400',
  style: 'normal',
  display: 'block',
  variable: '--fa-regular',
})

export const fontAwesomeBrands = localFont({
  src: '../../public/fonts/fa-brands-400.woff2',
  weight: '400',
  style: 'normal',
  display: 'block',
  variable: '--fa-brands',
})

export const flaticon = localFont({
  src: '../../public/fonts/flaticon/Flaticon.woff2',
  weight: 'normal',
  style: 'normal',
  display: 'block',
  variable: '--font-flaticon',
})

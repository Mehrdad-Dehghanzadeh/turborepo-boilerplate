import { deepFreeze } from '@utils/object'
import { AppHrefs } from '@type/App'

export type HeaderItemType = {
  text: string
  href: string
  roles?: string[]
}

export const appHrefs: AppHrefs = {
  main: {
    href: '/',
    title: 'صفحه اصلی'
  },

  sellers: {
    href: '/sellers',
    title: 'فروشندگان'
  },

  suppliers: {
    href: '/suppliers',
    title: 'تامین کنندگان مالی'
  },

  request: {
    href: '#calculate_requested_amount',
    title: 'درخواست خرید اعتباری'
  },

  'about-us': {
    href: '/about',
    title: 'درباره ما'
  },

  'contact-us': {
    href: '/contact',
    title: 'ارتباط با ما'
  },

  'why-feeleasy': {
    href: '#whyFeeleasy',
    title: 'چرا فیلیزی؟'
  }
}

export default deepFreeze<HeaderItemType[]>([
  {
    text: appHrefs['main'].title,
    href: appHrefs['main'].href
  },

  {
    text: appHrefs['sellers'].title,
    href: appHrefs['sellers'].href,
    roles: ['main', 'suppliers', 'about', 'contact']
  },

  {
    text: appHrefs['suppliers'].title,
    href: appHrefs['suppliers'].href,
    roles: ['main', 'sellers', 'about', 'contact']
  },

  {
    text: appHrefs['request'].title,
    href: appHrefs['request'].href,
    roles: ['main']
  },

  {
    text: appHrefs['about-us'].title,
    href: appHrefs['about-us'].href,
    roles: ['sellers', 'suppliers', 'about', 'contact']
  },

  {
    text: appHrefs['contact-us'].title,
    href: appHrefs['contact-us'].href
  },

  {
    text: appHrefs['why-feeleasy'].title,
    href: appHrefs['why-feeleasy'].href,
    roles: ['main']
  }
])

import { PartyCategory } from '@enums/PartyCategory'

export type NavItem = {
  text: string
  href: string
  icon?: React.ReactNode
  roles?: PartyCategory[]
  permission?: string
}
export type AppHref = {
  href: string
  title: string
}

export type AppHrefs = Record<string, AppHref>

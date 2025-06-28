'use client'
import { appHrefs } from './Nav'
import { useMemo, useState } from 'react'
import { useAppStore } from '@store'
import type { NavItem } from '@type/App'
import DashboardNavDesktop from './DashboardNavDesktop'
import DashboardNavMobile from './DashboardNavMobile'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { BooleanPlus } from '@enums/BooleanPlus'

export default function () {
  const contributions = useAppStore((state) => state.contributions)
  const isAdmin = useAppStore((state) => state.isAdmin)
  const settings = useAppStore((state) => state.settings)
  const [activeItem, setActiveItem] = useState<string>('')
  const pathName = usePathname()
  const user = useAppStore((state) => state.user)

  const partyCategory: any = useMemo(
    () => contributions?.[0]?.partyCategory,
    [contributions]
  )

  const isShowNavItem = (el: NavItem): any => {
    let val = !el?.roles || el.roles.includes(partyCategory)

    let cloneElement = { ...el }

    if (
      el.href === appHrefs['dashboard-my-orders'].href &&
      user?.verified !== BooleanPlus.GRANTED
    ) {
      val = false
    }

    if (
      el.href === appHrefs['dashboard-shop'].href &&
      !isAdmin &&
      settings?.viewAddShopForm
    ) {
      val = true
    }

    if (
      el.href === appHrefs['dashboard-company'].href &&
      !isAdmin &&
      settings?.viewAddLeasingCompanyForm
    ) {
      val = true
    }

    if (
      el.href === appHrefs['dashboard-my-leases'].href &&
      user?.verified !== BooleanPlus.GRANTED
    ) {
      val = false
    }

    return { val, cloneElement }
  }

  useEffect(() => {
    setActiveItem(pathName)
  }, [pathName])

  return (
    <>
      <DashboardNavDesktop isShowNavItem={isShowNavItem} activeItem={activeItem} />
      <DashboardNavMobile isShowNavItem={isShowNavItem} activeItem={activeItem} />
    </>
  )
}

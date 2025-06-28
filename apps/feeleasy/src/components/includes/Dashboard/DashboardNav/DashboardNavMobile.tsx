'use client'
import Container from '@mui/material/Container'
import './DashboardNavMobile.scss'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Link from 'next/link'
import nav from './Nav'
import type { NavItem } from '@type/App'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import { KIconButton } from '@components/kits'

type PropTypes = {
  activeItem: string
  isShowNavItem: (val: any) => any
}
export default function DashboardNavMobile({
  isShowNavItem,
  activeItem
}: Readonly<PropTypes>) {
  const [showNav, setShowNav] = useState<boolean>(false)

  return (
    <>
      <KIconButton
        className="dashboard-nav-mobile-button"
        onClick={() => setShowNav(true)}
      >
        <MenuIcon className="dashboard-nav-mobile-icon" />
      </KIconButton>

      <div
        className={`dashboard-nav-backdrop ${showNav ? 'show-backdrop' : ''}`}
        onClick={() => setShowNav(false)}
      ></div>
      <nav className={`dashboard-nav-mobile ${showNav ? 'show-nav' : 'hide-nav'}`}>
        <Container className="dashboard-nav-mobile__wrapper">
          <div className="dashboard-nav-mobile__top">
            <img
              className="dashboard-nav-mobile__logo"
              src="/images/Feeleasylogo-main.svg"
              alt="فیلیزی "
            />

            <CancelPresentationIcon
              className="dashboard-nav-mobile__close"
              onClick={() => setShowNav(false)}
            />
          </div>
          <Divider />
          <List className="dashboard-nav-mobile-list">
            {nav.map((el: NavItem, index) => {
              const { val, cloneElement } = isShowNavItem(el)
              return (
                val && (
                  <Link href={cloneElement.href} key={`${cloneElement.href}-${index}`}>
                    <ListItemButton
                      className={`dashboard-nav-mobile-list__item ${
                        activeItem === cloneElement.href ? 'active-item' : ''
                      }`}
                    >
                      <ListItemIcon className="dashboard-nav-mobile-list__icon">
                        {cloneElement?.icon}
                      </ListItemIcon>
                      <ListItemText
                        className="dashboard-nav-mobile-list__title"
                        primary={cloneElement.text}
                      />
                    </ListItemButton>
                  </Link>
                )
              )
            })}
          </List>
        </Container>
      </nav>
    </>
  )
}

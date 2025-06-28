'use client'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Link from 'next/link'
import nav from './Nav'
import type { NavItem } from '@type/App'
import './DashboardNavDesktop.scss'

type PropTypes = {
  activeItem: string
  isShowNavItem: (val: any) => any
}

export default function DashboardNavDesktop({
  isShowNavItem,
  activeItem
}: Readonly<PropTypes>) {
  return (
    <nav className="dashboard-nav-desktop">
      <Paper
        className="dashboard-nav-desktop__wrapper"
        elevation={2}
        sx={{ borderRadius: '20px' }}
      >
        <div className="dashboard-nav-desktop__top">
          <img
            className="dashboard-nav-desktop__logo"
            src="/images/Feeleasylogo-main.svg"
            alt="فیلیزی "
          />
        </div>
        <Divider />

        <List className="dashboard-nav-desktop-list">
          {nav.map((el: NavItem, index) => {
            const { val, cloneElement } = isShowNavItem(el)
            return (
              val && (
                <Link href={cloneElement.href} key={`${cloneElement.href}-${index}`}>
                  <ListItemButton
                    className={`dashboard-nav-desktop-list__item ${
                      activeItem === cloneElement.href ? 'active-item' : ''
                    }`}
                  >
                    <ListItemIcon className="dashboard-nav-desktop-list__icon">
                      {cloneElement?.icon}
                    </ListItemIcon>
                    <ListItemText
                      className="dashboard-nav-desktop-list__title"
                      primary={cloneElement.text}
                    />
                  </ListItemButton>
                </Link>
              )
            )
          })}
        </List>
      </Paper>
    </nav>
  )
}

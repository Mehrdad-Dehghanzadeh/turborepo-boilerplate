'use client'
import { KButton, KIconButton } from '@components/kits'
import './header.scss'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Link from 'next/link'
import headerItems, { HeaderItemType } from './HeaderItems'
import { usePathname } from 'next/navigation'
import MenuIcon from '@mui/icons-material/Menu'
import { Box } from '@mui/material'
import { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

type PropsType = {
  logoSrc?: string
  btnColor?: string
  showBtn?: boolean
}
const src = 'images/Feeleasylogo-main.svg'
const color = 'var(--color-primay)'

export default function Header({
  logoSrc = src,
  btnColor = color,
  showBtn = true
}: Readonly<PropsType>) {
  let pathName = usePathname()
  pathName = pathName.substring(1)
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false)

  const isShowitem = (item: HeaderItemType) => {
    const val =
      !item?.roles ||
      (item?.roles.includes('main') && !pathName) ||
      item?.roles.includes(pathName)

    return { val }
  }

  return (
    <>
      <header className="header">
        <img src={logoSrc} alt="header-logo" className="header-logo" />

        <List className="header-list">
          {headerItems.map((item: HeaderItemType, index: number) => {
            const { val } = isShowitem(item)
            return (
              val && (
                <ListItem className="header-list_item" key={index}>
                  <Link href={item.href} className="header-list_link">
                    {item.text}
                  </Link>
                </ListItem>
              )
            )
          })}
        </List>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            marginRight: 'auto',
            position: 'absolute',
            right: '0'
          }}
        >
          {showBtn && (
            <KButton
              className="header-button"
              sx={{
                borderRadius: '50px',
                fontSize: '15px',
                backgroundColor: btnColor,
                color: 'var(--color-white)',
                '&:hover': {
                  backgroundColor: btnColor
                }
              }}
            >
              <Link href="/login"> ورود / ثبت نام</Link>
            </KButton>
          )}

          <KIconButton className="header-menue-icon" onClick={() => setIsShowMenu(true)}>
            <MenuIcon />
          </KIconButton>
        </Box>
      </header>

      <Box className={`menue ${isShowMenu ? 'show-menue' : ''}`}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <img src={logoSrc} alt="menue-logo" className="header-logo" />
          <KIconButton className="menue-icon-close" onClick={() => setIsShowMenu(false)}>
            <ArrowBackIcon />
          </KIconButton>
        </Box>

        <List className="menue-list">
          {headerItems.map((item: HeaderItemType, index: number) => {
            const { val } = isShowitem(item)
            return (
              val && (
                <ListItem className="menue-list_item" key={index}>
                  <Link
                    href={item.href}
                    className="menue-list_link"
                    onClick={() => {
                      return (
                        (item.href === '#whyFeeleasy' ||
                          item.href === '#calculate_requested_amount') &&
                        setIsShowMenu(false)
                      )
                    }}
                  >
                    {item.text}
                  </Link>
                </ListItem>
              )
            )
          })}
        </List>
      </Box>
    </>
  )
}

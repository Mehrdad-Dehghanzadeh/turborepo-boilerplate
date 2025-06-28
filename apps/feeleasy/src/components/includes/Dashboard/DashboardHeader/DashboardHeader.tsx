'use client'
import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LogoutIcon from '@mui/icons-material/Logout'
import { removeToken, loginPagePath } from '@utils/auth'
import { useAppStore } from '@store'
import './DashboardHeader.scss'

export default function DashboardHeader() {
  const router = useRouter()
  const headline = useAppStore((state) => state.headline)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [offsetWidth, setOffsetWidth] = useState<number>(0)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOffsetWidth(event.currentTarget.offsetWidth)
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const logout = () => {
    removeToken()
    router.replace(loginPagePath)
  }

  return (
    <header className="dashboard-header">
      <Container sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <span className="dashboard-header__user-info">
            <span className="d-block">{`${headline.headline1 ?? ''}`}</span>
            <span className="d-block">{`${headline.headline2 ?? ''}`}</span>
          </span>

          <Avatar className="dashboard-header__avatar" onClick={handleClick} />
        </Button>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem
            sx={{
              color: 'var(--color-error-700)',
              fontSize: '0.85rem',
              minWidth: offsetWidth + 'px'
            }}
            onClick={logout}
          >
            <LogoutIcon sx={{ marginRight: '8px' }} fontSize="small" />
            <span className="">خروج</span>
          </MenuItem>
        </Menu>
      </Container>
    </header>
  )
}

'use client'
import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useAppStore } from '@store'
import { KButton } from '@components-kits'
import { usePathname } from 'next/navigation'
import './DashboardProfileValidationDialog.scss'
import { appHrefs } from '@components-includes/Dashboard/DashboardNav/Nav'
import { BooleanPlus } from '@enums/BooleanPlus'

export default function () {
  const pathname = usePathname()
  const userValidtion = useAppStore((state) => state.validation)
  const user = useAppStore((state) => state.user)
  const [open, setOpen] = useState<boolean>(false)
  const paths = [appHrefs['dashboard-lease-requests'].href]

  useEffect(() => {
    if (userValidtion && !userValidtion.valid && paths.includes(pathname)) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [userValidtion, pathname])

  const close = () => {
    setOpen(false)
  }

  return (
    <Dialog className="profile-validation-dialog" open={open} maxWidth="md">
      <DialogContent sx={{ width: '480px' }}>
        <div className="profile-validation-dialog__header">
          {user?.verified === BooleanPlus.GRANTED && !userValidtion?.valid && (
            <strong className="profile-validation-dialog__title">
              پروفایل کامل نشده است.لطفا اطلاعات شخصی خود را از قسمت پروفایل تکمیل کنید
            </strong>
          )}
        </div>

        {user?.verified === BooleanPlus.GRANTED &&
          !!userValidtion?.itemsTranslation?.length && (
            <ul className="profile-validation-dialog__list">
              {userValidtion?.itemsTranslation.map((el) => (
                <li className="profile-validation-dialog__list-item" key={el}>
                  {el}
                </li>
              ))}
            </ul>
          )}
      </DialogContent>

      <DialogActions className="justify-content-center">
        <KButton variant="contained" onClick={close}>
          بستن
        </KButton>
      </DialogActions>
    </Dialog>
  )
}

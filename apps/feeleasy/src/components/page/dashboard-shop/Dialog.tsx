'use client'
import { KButton, KFieldset, KInfo } from '@components-kits'
import { useState, forwardRef, useImperativeHandle } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { deepClone } from '@utils/object'
import { utcToJalali } from '@utils/date'
import { enumsProvider } from '@utils/enums'

type Props = {
  showCallBack?: () => void
  closeCallBack?: () => void
}

export default forwardRef<any, Props>(function (
  { showCallBack, closeCallBack }: Readonly<Props>,
  _ref
) {
  const [open, setOpen] = useState<boolean>(false)
  const [info, setInfo] = useState<any>(null)

  const onClose = () => {
    setOpen(false)
    setInfo(null)
    closeCallBack?.()
  }

  const showDialog = (data: any) => {
    setInfo(deepClone(data))
    showCallBack?.()
    setOpen(true)
  }

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  return (
    <Dialog open={open} maxWidth="sm">
      {info && (
        <DialogContent>
          <KFieldset title="اطلاعات فروشگاه">
            <Grid spacing={2} container>
              <Grid xs={6} item>
                <KInfo title="نام فروشگاه" value={info?.name} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="آدرس وبسایت" value={info?.websiteAddress} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="تلفن همراه" value={info?.contactInfo?.mobilePhoneNumber} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="تلفن ثابت" value={info?.contactInfo?.landlinePhoneNumber} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="آدرس ایمیل" value={info?.contactInfo?.emailAddress} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="استان" value={info?.postalAddress?.state} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="شهر" value={info?.postalAddress?.city} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="آدرس" value={info?.postalAddress?.address} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="کدپستی" value={info?.postalAddress?.postalCode} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="نام حقوقی" value={info?.corporateInfo?.officialName} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="شناسه ملی" value={info?.corporateInfo?.nationalId} />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="شماره ثبت"
                  value={info?.corporateInfo?.registrationNumber}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="تاریخ تاسیس"
                  value={utcToJalali(
                    info?.corporateInfo?.incorporationInfo?.incorporationDate
                  )}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="شماره آگهی"
                  value={info?.corporateInfo?.incorporationInfo?.announcementNumber}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="نوع شرکت"
                  value={
                    enumsProvider('CompanyTypeList', info?.corporateInfo?.companyType)
                      ?.title
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="کد اقتصادی" value={info?.corporateInfo?.businessCode} />
              </Grid>
            </Grid>
          </KFieldset>
        </DialogContent>
      )}
      <Divider />

      <DialogActions>
        <KButton type="button" color="error" onClick={onClose}>
          بستن
        </KButton>
      </DialogActions>
    </Dialog>
  )
})

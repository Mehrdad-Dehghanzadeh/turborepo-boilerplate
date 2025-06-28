'use client'
import { KButton, KFieldset, KInfo, KLoading } from '@components-kits'
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { deepClone } from '@utils/object'
import { utcToJalali } from '@utils/date'
import { enumsProvider } from '@utils/enums'
import { Chip } from '@mui/material'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'

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
  const [loading, setLoading] = useState<boolean>(false)
  const [userVerificationInfo, setUserVerificationInfo] = useState<any>(null)
  const { snackbar } = useSnackbar()

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

  const getUserInfo = () => {
    if (info) {
      setLoading(true)
      const userUuid = info?.uuid
      apis.users
        .getInfo(userUuid)
        .then(({ data }: any) => {
          setUserVerificationInfo(data?.userVerification)
        })
        .catch((err: Error) => snackbar('error', err))
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [open])

  return (
    <Dialog open={open} maxWidth="sm">
      {info && userVerificationInfo && (
        <DialogContent>
          <KFieldset title="اطلاعات کاربر">
            <Grid spacing={2} container>
              <Grid xs={6} item>
                <KInfo title="نام" value={info?.firstName} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="نام خانوادگی" value={info?.lastName} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="کد ملی" value={info?.nationalCard?.nationalCode} />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="نتیجه استعلام کد ملی"
                  value={
                    <Chip
                      size="small"
                      variant="outlined"
                      label={
                        enumsProvider(
                          'States',
                          userVerificationInfo?.identityCardVerified
                        )?.title
                      }
                      color={
                        enumsProvider(
                          'States',
                          userVerificationInfo?.identityCardVerified
                        )?.color
                      }
                    />
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="شماره شبای تایید شده"
                  value={userVerificationInfo?.verifiedIban}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="تاریخ تولد"
                  value={utcToJalali(info?.nationalCard?.dateOfBirth)}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="وضعیت حیات"
                  value={
                    <Chip
                      size="small"
                      variant="outlined"
                      label={
                        enumsProvider('AliveStatus', userVerificationInfo?.alive)?.title
                      }
                      color={
                        enumsProvider('AliveStatus', userVerificationInfo?.alive)?.color
                      }
                    />
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="شماره شناسنامه"
                  value={info?.identityCard?.identityNumber}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="نام پدر" value={info?.identityCard?.fatherName} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="محل تولد" value={info?.identityCard?.birthPlace} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="محل صدور" value={info?.identityCard?.idIssuePlace} />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="شماره تلفن همراه"
                  value={info?.contactInfo?.mobilePhoneNumber}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="وضعیت شماره تلفن همراه"
                  value={
                    <Chip
                      size="small"
                      variant="outlined"
                      label={
                        enumsProvider(
                          'States',
                          userVerificationInfo?.mobilePhoneNumberVerified
                        )?.title
                      }
                      color={
                        enumsProvider(
                          'States',
                          userVerificationInfo?.mobilePhoneNumberVerified
                        )?.color
                      }
                    />
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="مالکیت سیم کارت"
                  value={
                    <Chip
                      size="small"
                      variant="outlined"
                      label={
                        enumsProvider(
                          'States',
                          userVerificationInfo?.simCardOwnershipConfirmed
                        )?.title
                      }
                      color={
                        enumsProvider(
                          'States',
                          userVerificationInfo?.simCardOwnershipConfirmed
                        )?.color
                      }
                    />
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="شماره تلفن"
                  value={info?.contactInfo?.landlinePhoneNumber}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="ایمیل" value={info?.contactInfo?.emailAddress} />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="جنسیت"
                  value={
                    info?.personalInfo?.gender
                      ? enumsProvider('GenderList', info?.personalInfo?.gender)?.title
                      : ''
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="وضعیت تاهل"
                  value={
                    enumsProvider('MaritalStatusList', info?.personalInfo?.maritalStatus)
                      ?.title
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="میزان تحصیلات"
                  value={
                    enumsProvider(
                      'EducationLevelList',
                      info?.personalInfo?.educationLevel
                    )?.title
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="استان" value={info?.postalAddress?.state} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="شهر" value={info?.postalAddress?.city} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="کدپستی" value={info?.postalAddress?.postalCode} />
              </Grid>

              <Grid xs={12} item>
                <KInfo
                  title="آدرس"
                  value={`${info?.postalAddress?.address ?? ''} ${
                    info?.postalAddress?.comment
                      ? `- ${info?.postalAddress?.comment}`
                      : ''
                  } `}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="نتیجه استعلام کد پستی"
                  value={
                    <Chip
                      size="small"
                      variant="outlined"
                      label={
                        enumsProvider('States', userVerificationInfo?.postalAddressValid)
                          ?.title
                      }
                      color={
                        enumsProvider('States', userVerificationInfo?.postalAddressValid)
                          ?.color
                      }
                    />
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="وضعیت احراز هویت"
                  value={
                    <Chip
                      size="small"
                      variant="outlined"
                      label={enumsProvider('Verified', info?.verified)?.title}
                      color={enumsProvider('Verified', info?.verified)?.color}
                    />
                  }
                />
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

'use client'
import { KIconButton, KTabs, KButton, KFieldset, KInfo } from '@components-kits'
import { useState, useContext, useMemo } from 'react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import { CompanyContext } from '@context/CompanyContext'
import TabPostalAddress from './TabPostalAddress'
import TabCorporate from './TabCorporate'
import TabContact from './TabContact'
import { deepClone } from '@utils/object'
import { useAppStore } from '@store'
import { enumsProvider } from '@utils/enums'
import TabAsset from './TabAsset'
import TabLicense from './TabLicense'
import { utcToJalali } from '@utils/date'

type Props = {
  company: any
}

export default function ({ company }: Readonly<Props>) {
  const tabs = [
    'اطلاعات شرکت',
    'اطلاعات پستی',
    'اطلاعات تماس',
    'اطلاعات مجوز فعالیت',
    'اطلاعات مالی'
  ]
  const [open, setOpen] = useState<boolean>(false)
  const [openApprove, setOpenApprove] = useState<boolean>(false)
  const companyContext = useContext(CompanyContext)
  const isAdmin = useAppStore((state) => state.isAdmin)

  const onClose = () => {
    setOpen(false)
    setOpenApprove(false)
    companyContext.setSelectedCompany?.(null)
  }

  const openDialog = () => {
    setOpen(true)
  }

  const openApproveDialog = () => {
    setOpenApprove(true)
  }

  const corporateInfo = useMemo(
    () => (company?.corporateInfo ? deepClone(company?.corporateInfo) : null),
    [company]
  )
  const postalAddress = useMemo(
    () => (company?.postalAddress ? deepClone(company?.postalAddress) : null),
    [company]
  )

  const contactInfo = useMemo(
    () => (company?.contactInfo ? deepClone(company?.contactInfo) : null),
    [company]
  )

  const assetInfo = useMemo(
    () => (company?.assetInfo ? deepClone(company?.assetInfo) : null),
    [company]
  )

  const licenseInfo = useMemo(
    () => (company?.license ? deepClone(company?.license) : null),
    [company]
  )

  return (
    <div className="d-flex justify-content-end px-2">
      {isAdmin ? (
        <KIconButton toolTipTitle="جزئیات" color="info" onClick={openApproveDialog}>
          <InfoRoundedIcon />
        </KIconButton>
      ) : (
        <KIconButton toolTipTitle="ویرایش" color="primary" onClick={openDialog}>
          <EditOutlinedIcon />
        </KIconButton>
      )}

      <Dialog open={open} arial-role="dialog" maxWidth="md">
        <KTabs tabs={tabs}>
          <TabCorporate
            onClose={onClose}
            info={corporateInfo}
            companyUUID={company.uuid}
            approved={company.approved}
          />
          <TabPostalAddress
            onClose={onClose}
            info={postalAddress}
            companyUUID={company.uuid}
            approved={company.approved}
          />
          <TabContact
            onClose={onClose}
            info={contactInfo}
            companyUUID={company.uuid}
            approved={company.approved}
          />
          <TabLicense
            onClose={onClose}
            info={licenseInfo}
            companyUUID={company.uuid}
            approved={company.approved}
          />
          <TabAsset
            onClose={onClose}
            info={assetInfo}
            companyUUID={company.uuid}
            approved={company.approved}
          />
        </KTabs>
      </Dialog>

      <Dialog open={openApprove} arial-role="dialog" maxWidth="md">
        <DialogContent sx={{ width: '680px' }}>
          <DialogContentText
            sx={{ display: 'flex', flexDirection: 'column', gap: '20px 0' }}
          >
            <KFieldset title="اطلاعات شرکت">
              <Grid spacing={2} container>
                <Grid xs={12} md={4} item>
                  <KInfo title="نام" value={company?.name} />
                </Grid>

                <Grid xs={12} md={4} item>
                  <KInfo title="وب سایت " value={company?.websiteAddress} />
                </Grid>

                {company?.corporateInfo && (
                  <>
                    <Grid xs={12} sm={6} md={4} item>
                      <KInfo
                        title="نام رسمی"
                        value={company.corporateInfo?.officialName}
                      />
                    </Grid>

                    <Grid xs={12} sm={6} md={4} item>
                      <KInfo
                        title="شناسه ملی"
                        value={company.corporateInfo?.nationalId}
                      />
                    </Grid>

                    <Grid xs={12} sm={6} md={4} item>
                      <KInfo
                        title="شماره ثبت"
                        value={company.corporateInfo?.registrationNumber}
                      />
                    </Grid>

                    <Grid xs={12} sm={6} md={4} item>
                      <KInfo
                        title="تاریخ تاسیس"
                        value={utcToJalali(
                          company.corporateInfo?.incorporationInfo.incorporationDate
                        )}
                      />
                    </Grid>

                    <Grid xs={12} sm={6} md={4} item>
                      <KInfo
                        title="شماره آگهی تاسیس"
                        value={
                          company.corporateInfo?.incorporationInfo.announcementNumber
                        }
                      />
                    </Grid>

                    <Grid xs={12} sm={6} md={4} item>
                      <KInfo
                        title="نوع"
                        value={
                          enumsProvider(
                            'CompanyTypeList',
                            company?.corporateInfo?.companyType
                          )?.title
                        }
                      />
                    </Grid>

                    <Grid xs={12} sm={6} md={4} item>
                      <KInfo
                        title="کد اقتصادی"
                        value={company?.corporateInfo?.businessCode}
                      />
                    </Grid>

                    <Grid xs={12} md={4} item>
                      <KInfo
                        title="وضعیت"
                        value={
                          <Chip
                            label={enumsProvider('States', company?.approved)?.title}
                            color={enumsProvider('States', company?.approved)?.color}
                            size="small"
                            variant="outlined"
                          />
                        }
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </KFieldset>

            <KFieldset title="اطلاعات پستی">
              <Grid spacing={2} container>
                <Grid xs={12} sm={6} md={4} item>
                  <KInfo title="شهر" value={company?.postalAddress?.city} />
                </Grid>

                <Grid xs={12} sm={6} md={4} item>
                  <KInfo title="کد پستی" value={company?.postalAddress?.postalCode} />
                </Grid>

                <Grid xs={12} sm={6} md={4} item>
                  <KInfo title="استان" value={company?.postalAddress?.state} />
                </Grid>

                <Grid xs={12} sm={12} md={8} item>
                  <KInfo title="آدرس" value={company?.postalAddress?.address} />
                </Grid>
              </Grid>
            </KFieldset>

            <KFieldset title="اطلاعات تماس">
              <Grid spacing={2} container>
                <Grid xs={12} sm={6} md={4} item>
                  <KInfo
                    title="موبایل "
                    value={company?.contactInfo?.mobilePhoneNumber}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={4} item>
                  <KInfo title="تلفن" value={company?.contactInfo?.landlinePhoneNumber} />
                </Grid>

                <Grid xs={12} sm={6} md={4} item>
                  <KInfo title="ایمیل" value={company?.contactInfo?.emailAddress} />
                </Grid>
              </Grid>
            </KFieldset>

            <KFieldset title="اطلاعات مجوز فعالیت">
              <Grid spacing={2} container>
                <Grid xs={12} md={4} item>
                  <KInfo title="شماره مجوز" value={company?.license?.licenseNumber} />
                </Grid>

                <Grid xs={12} md={4} item>
                  <KInfo
                    title="تاریخ شروع"
                    value={utcToJalali(company?.license?.startDate)}
                  />
                </Grid>

                <Grid xs={12} md={4} item>
                  <KInfo
                    title="تاریخ پایان"
                    value={utcToJalali(company?.license?.endDate)}
                  />
                </Grid>
              </Grid>
            </KFieldset>

            <KFieldset title="اطلاعات مالی">
              <Grid spacing={2} container>
                <Grid xs={12} md={4} item>
                  <KInfo
                    title="سرمایه ثبت شده"
                    value={company?.assetInfo?.registeredCapital}
                  />
                </Grid>

                <Grid xs={12} md={4} item>
                  <KInfo
                    title="جمع حقوق مالکانه"
                    value={company?.assetInfo?.totalEquity}
                  />
                </Grid>
              </Grid>
            </KFieldset>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <KButton type="button" color="error" onClick={onClose}>
            بستن
          </KButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

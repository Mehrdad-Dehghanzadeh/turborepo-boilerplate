import Paper from '@mui/material/Paper'
import BusinessIcon from '@mui/icons-material/Business'
import { CompanyItem } from '@models/LeasingCompanies'
import EditDialog from './EditDialog'
import './CompanyItem.scss'
import { KButton } from '@/components/kits'
import { useContext, useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { useAppStore } from '@store'
import { Box, Chip, Divider } from '@mui/material'
import { enumsProvider } from '@/utils/enums'
import { CompanyContext } from '@context/CompanyContext'
import { BooleanPlus } from '@enums/BooleanPlus'

type PropsType = {
  company: CompanyItem
}

export default function ({ company }: Readonly<PropsType>) {
  const [loading, setLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const isAdmin = useAppStore((state) => state.isAdmin)
  const companyContext = useContext(CompanyContext)
  const [returnLoading, setReturnLoading] = useState<boolean>(false)
  const [selectedUuid, setSelectedUuid] = useState<string>('')
  const [approveLoading, setApproveLoading] = useState<boolean>(false)

  const sendForApprove = () => {
    setLoading(true)
    const companyUuid = company?.uuid
    setSelectedUuid(companyUuid)

    const payload = {
      approved: BooleanPlus.REQUESTED
    }

    apis.leasingCompanies
      .approve(companyUuid, payload)
      .then(() => {
        companyContext?.getData?.()
        snackbar('success', 'با موفقیت ارسال شد')
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const returnForUpdate = () => {
    const companyUuid = company?.uuid

    setReturnLoading(true)
    setSelectedUuid(companyUuid)

    const payload = {
      approved: BooleanPlus.RETURNED
    }

    apis.leasingCompanies
      .approve(companyUuid, payload)
      .then(() => {
        companyContext?.getData?.()
        snackbar('success', 'با موفقیت انجام شد')
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => {
        setReturnLoading(false)
        setSelectedUuid('')
      })
  }

  const apporove = () => {
    setApproveLoading(true)
    const companyUuid = company.uuid
    setSelectedUuid(companyUuid)

    const payload = {
      approved: BooleanPlus.GRANTED
    }

    apis.leasingCompanies
      .approve(companyUuid, payload)
      .then(() => {
        companyContext?.getData?.()
        snackbar('success', 'نهاد مالی تایید شد')
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setApproveLoading(false)
      })
  }

  return (
    <Paper component="section" className="company-item">
      <EditDialog company={company} />

      <div className="company-item__top">
        <BusinessIcon className="company-item__icon" />
      </div>

      <div className="company-item__content">
        <ul className="company-item-list">
          <li className="company-item-list__item">
            <i className="company-item-list__title">نام :</i>
            <span className="company-item-list__text">{company?.name}</span>
          </li>

          <li className="company-item-list__item">
            <i className="company-item-list__title">وب سایت :</i>
            <span className="company-item-list__text">{company?.websiteAddress}</span>
          </li>
        </ul>

        {isAdmin ? (
          <Box>
            <Chip
              sx={{ margin: '10px 0' }}
              variant="outlined"
              color={enumsProvider('States', company?.approved)?.color}
              label={enumsProvider('States', company?.approved)?.title}
              size="small"
            />

            <Divider sx={{ margin: '10px 0' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <KButton
                color="success"
                size="small"
                loading={approveLoading && selectedUuid === company.uuid}
                variant="contained"
                onClick={apporove}
                disabled={company?.approved !== BooleanPlus.REQUESTED}
              >
                تایید
              </KButton>

              <KButton
                color="error"
                size="small"
                loading={returnLoading && selectedUuid === company.uuid}
                variant="outlined"
                onClick={returnForUpdate}
                disabled={company?.approved !== BooleanPlus.REQUESTED}
              >
                برگشت جهت ویرایش
              </KButton>
            </Box>
          </Box>
        ) : (
          <KButton
            color="secondary"
            variant="outlined"
            size="small"
            sx={{ margin: '10px 0' }}
            onClick={sendForApprove}
            loading={loading && selectedUuid === company.uuid}
            disabled={
              company?.approved === BooleanPlus.REQUESTED ||
              company?.approved === BooleanPlus.GRANTED
            }
          >
            {company?.approved === BooleanPlus.GRANTED
              ? 'تایید شده'
              : company?.approved === BooleanPlus.REQUESTED
                ? 'در انتظار تایید'
                : company?.approved === BooleanPlus.NA ||
                    company?.approved === BooleanPlus.RETURNED
                  ? 'ارسال برای تایید'
                  : 'نامشخص'}
          </KButton>
        )}
      </div>
    </Paper>
  )
}

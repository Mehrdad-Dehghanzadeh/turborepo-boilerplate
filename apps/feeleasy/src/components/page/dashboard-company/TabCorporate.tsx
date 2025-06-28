import Paper from '@mui/material/Paper'
import { KTextField, KButton, KSelect, KDatePicker } from '@components-kits'
import useValidations from '@hooks/useValidations'
import useSnackbar from '@hooks/useSnackbar'
import { useForm } from 'react-hook-form'
import type { CorporateInfoDto } from '@models/LeasingCompanies'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useState, useContext } from 'react'
import Divider from '@mui/material/Divider'
import { CompanyContext } from '@context/CompanyContext'
import { CompanyTypeList } from '@enums/CompanyType'
import { getToken } from '@utils/auth'
import apis from '@apis'
import { deepClone } from '@utils/object'
import { format } from '@utils/date'
import { BooleanPlus } from '@enums/BooleanPlus'

type Porps = Readonly<{
  onClose: () => void
  info: any
  companyUUID: string
  approved: string
}>

export default function ({ onClose, info, companyUUID, approved }: Porps) {
  const { snackbar } = useSnackbar()
  const uuid = getToken()
  const companyContext = useContext(CompanyContext)
  const [loading, setLoading] = useState<boolean>(false)

  const { handleSubmit, control } = useForm<CorporateInfoDto>({
    defaultValues: {
      officialName: info?.officialName,
      nationalId: info?.nationalId,
      registrationNumber: info?.registrationNumber,
      incorporationInfo: {
        incorporationDate: info?.incorporationInfo?.incorporationDate
          ? new Date(info?.incorporationInfo?.incorporationDate)
          : null,
        announcementNumber: info?.incorporationInfo?.announcementNumber
      },
      companyType: info?.companyType,
      businessCode: info?.businessCode
    }
  })
  const { required, legalNationalCode } = useValidations()

  const createPayload = (data: CorporateInfoDto) => {
    const corporateInfo = deepClone(data)
    corporateInfo.incorporationInfo.incorporationDate = format(
      corporateInfo.incorporationInfo.incorporationDate
    )
    return { corporateInfo }
  }

  const onsubmit = async (data: CorporateInfoDto) => {
    const payload = createPayload(data)
    try {
      setLoading(true)
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات شرکت با موفقیت ثبت شد')
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper component="section" sx={{ paddingX: '16px', paddingBottom: '16px' }}>
      <form id="coprate-form" name="coprate-form" onSubmit={handleSubmit(onsubmit)}>
        <DialogContent sx={{ width: '680px' }}>
          <KTextField
            sx={{ marginBottom: '24px', marginTop: '12px' }}
            control={control}
            label="نام رسمی"
            name="officialName"
            rules={{ required: required() }}
          />

          <KTextField
            sx={{ marginBottom: '24px' }}
            control={control}
            label="شناسه ملی"
            name="nationalId"
            rules={{ required: required(), validate: legalNationalCode }}
            type="number"
            inputMode="numeric"
          />

          <KTextField
            sx={{ marginBottom: '24px' }}
            control={control}
            label="شماره ثبت"
            name="registrationNumber"
            rules={{ required: required() }}
          />

          <KDatePicker
            sx={{ marginBottom: '24px' }}
            control={control}
            label="تاریخ تاسیس"
            name="incorporationInfo.incorporationDate"
            rules={{ required: required() }}
          />

          <KTextField
            sx={{ marginBottom: '24px' }}
            control={control}
            label="شماره آگهی تاسیس"
            name="incorporationInfo.announcementNumber"
            type="number"
            inputMode="numeric"
          />

          <KSelect
            sx={{ marginBottom: '24px' }}
            items={CompanyTypeList}
            control={control}
            name="companyType"
            label="نوع شرکت"
            rules={{ required: required() }}
          />

          <KTextField
            sx={{ marginBottom: '24px' }}
            control={control}
            label="کد اقتصادی"
            name="businessCode"
            type="number"
            inputMode="numeric"
            rules={{ required: required() }}
          />
        </DialogContent>
        <Divider sx={{ marginX: '-10px' }} />

        <DialogActions>
          <KButton type="reset" color="error" onClick={onClose} variant="contained">
            بستن
          </KButton>

          <KButton
            type="submit"
            loading={loading}
            variant="contained"
            color="success"
            disabled={
              approved === BooleanPlus.REQUESTED || approved === BooleanPlus.GRANTED
            }
          >
            ذخیره
          </KButton>
        </DialogActions>
      </form>
    </Paper>
  )
}

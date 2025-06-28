import { KButton, KTextField, KSelect, KDatePicker } from '@components-kits'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import useSnackbar from '@hooks/useSnackbar'
import { CompanyTypeList } from '@enums/CompanyType'
import { CompanyContext } from '@context/CompanyContext'
import { CorporateInfoDto } from '@models/LeasingCompanies'
import { getToken } from '@utils/auth'
import { format } from '@utils/date'
import apis from '@apis'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { deepClone } from '@utils/object'

type PropsType = {
  setStep: any
  onClose: () => void
}

export default function ({ setStep, onClose }: Readonly<PropsType>) {
  const uuid = getToken()
  const companyContext = useContext(CompanyContext)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit, control } = useForm<CorporateInfoDto>({
    defaultValues: {
      officialName: '',
      nationalId: '',
      registrationNumber: '',
      incorporationInfo: {
        incorporationDate: null,
        announcementNumber: ''
      },
      companyType: '',
      businessCode: ''
    }
  })

  const { required, legalNationalCode } = useValidations()

  const createPayload = (data: CorporateInfoDto) => {
    data.incorporationInfo.incorporationDate = format(
      data.incorporationInfo.incorporationDate
    )
    const corporateInfo = deepClone(data)
    return { corporateInfo }
  }

  const onsubmit = async (data: CorporateInfoDto) => {
    const payload = createPayload(data)

    try {
      setLoading(true)
      const companyUUID = companyContext.selectedCompany.uuid
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      companyContext.setLoading?.(true)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات شرکت با موفقیت ثبت شد')
      setStep(2)
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
      companyContext.setLoading?.(false)
    }
  }

  return (
    <form
      id="add-corporate-info-company"
      name="addCorporateInfoCompany"
      onSubmit={handleSubmit(onsubmit)}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>ثبت اطلاعات شرکت</span>
        <CancelOutlinedIcon sx={{ color: 'red' }} onClick={() => onClose()} />
      </DialogTitle>

      <DialogContent>
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

      <DialogActions>
        <KButton type="submit" endIcon={<ArrowCircleLeftIcon />}>
          ادامه
        </KButton>
      </DialogActions>
    </form>
  )
}

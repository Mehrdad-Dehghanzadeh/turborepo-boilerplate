import { KButton, KTextField } from '@components-kits'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import ControlPointIcon from '@mui/icons-material/ArrowCircleLeft'
import useSnackbar from '@hooks/useSnackbar'
import { CompanyContext } from '@context/CompanyContext'
import { ContactInfoDto } from '@models/LeasingCompanies'
import { getToken } from '@utils/auth'
import apis from '@apis'
import { deepClone } from '@utils/object'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

type PropsType = {
  onClose: () => void
  setStep: any
}

export default function ({ setStep, onClose }: Readonly<PropsType>) {
  const uuid = getToken()
  const companyContext = useContext(CompanyContext)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit, control } = useForm<ContactInfoDto>({
    defaultValues: {
      mobilePhoneNumber: '',
      landlinePhoneNumber: '',
      emailAddress: ''
    }
  })

  const { required, mobile, email } = useValidations()

  const createPayload = (data: ContactInfoDto) => {
    const contactInfo = deepClone(data)
    return { contactInfo }
  }

  const onsubmit = async (data: ContactInfoDto) => {
    const payload = createPayload(data)
    try {
      setLoading(true)
      const companyUUID = companyContext.selectedCompany.uuid
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      companyContext.setLoading?.(true)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات تماس با موفقیت ثبت شد')
      setStep(4)
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
      companyContext.setLoading?.(false)
    }
  }

  return (
    <form
      id="add-contact-info-company"
      name="addContactInfoCompany"
      onSubmit={handleSubmit(onsubmit)}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>اطلاعات تماس</span>
        <CancelOutlinedIcon sx={{ color: 'red' }} onClick={() => onClose()} />
      </DialogTitle>

      <DialogContent>
        <KTextField
          sx={{ marginBottom: '24px', marginTop: '12px' }}
          control={control}
          label="موبایل"
          name="mobilePhoneNumber"
          rules={{ required: required(), validate: mobile }}
          type="number"
        />

        <KTextField
          sx={{ marginBottom: '24px' }}
          control={control}
          label="تلفن"
          name="landlinePhoneNumber"
          rules={{ required: required() }}
          type="number"
        />

        <KTextField
          sx={{ marginBottom: '24px' }}
          control={control}
          label="ایمیل"
          name="emailAddress"
          rules={{ required: required(), validate: email }}
        />
      </DialogContent>

      <DialogActions>
        <KButton
          type="submit"
          loading={loading}
          variant="contained"
          color="success"
          endIcon={<ControlPointIcon />}
        >
          افزودن
        </KButton>
      </DialogActions>
    </form>
  )
}

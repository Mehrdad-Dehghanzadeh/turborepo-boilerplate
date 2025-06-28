import Paper from '@mui/material/Paper'
import { KTextField, KButton } from '@components-kits'
import useValidations from '@hooks/useValidations'
import useSnackbar from '@hooks/useSnackbar'
import { useForm } from 'react-hook-form'
import type { ContactInfoDto } from '@models/LeasingCompanies'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useState, useContext } from 'react'
import Divider from '@mui/material/Divider'
import { CompanyContext } from '@context/CompanyContext'
import { getToken } from '@utils/auth'
import apis from '@apis'
import { deepClone } from '@utils/object'
import { BooleanPlus } from '@enums/BooleanPlus'

type Porps = {
  onClose: () => void
  info: any
  companyUUID: string
  approved: string
}

export default function ({ onClose, info, companyUUID, approved }: Readonly<Porps>) {
  const { snackbar } = useSnackbar()
  const uuid = getToken()
  const companyContext = useContext(CompanyContext)
  const [loading, setLoading] = useState<boolean>(false)

  const { handleSubmit, control } = useForm<ContactInfoDto>({
    defaultValues: {
      mobilePhoneNumber: info?.mobilePhoneNumber,
      landlinePhoneNumber: info?.landlinePhoneNumber,
      emailAddress: info?.emailAddress
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
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات تماس با موفقیت ثبت شد')
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper component="section" sx={{ paddingX: '16px', paddingBottom: '16px' }}>
      <form
        id="contact-form"
        name="postal-adderss-form"
        onSubmit={handleSubmit(onsubmit)}
      >
        <DialogContent sx={{ width: '680px' }}>
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
            inputMode="numeric"
          />

          <KTextField
            sx={{ marginBottom: '24px' }}
            control={control}
            label="ایمیل"
            name="emailAddress"
            rules={{ required: required(), validate: email }}
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
            disabled={
              approved === BooleanPlus.REQUESTED || approved === BooleanPlus.GRANTED
            }
            variant="contained"
            color="success"
          >
            ذخیره
          </KButton>
        </DialogActions>
      </form>
    </Paper>
  )
}

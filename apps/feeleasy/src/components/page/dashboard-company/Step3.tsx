import { KButton, KTextField, KFieldset, KInfo } from '@components-kits'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import useSnackbar from '@hooks/useSnackbar'
import { CompanyContext } from '@context/CompanyContext'
import { PostalAddressDto } from '@models/LeasingCompanies'
import { getToken } from '@utils/auth'
import SyncIcon from '@mui/icons-material/Sync'
import apis from '@apis'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

type PropsType = {
  setStep: any
  onClose: () => void
}

enum FormState {
  Inquiry = 'Inquiry',
  Done = 'Done'
}

export default function ({ setStep, onClose }: Readonly<PropsType>) {
  const uuid = getToken()
  const companyContext = useContext(CompanyContext)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const [formState, setFormState] = useState<FormState>(FormState.Inquiry)
  const { handleSubmit, control } = useForm<PostalAddressDto>({
    defaultValues: {
      postalCode: ''
    }
  })

  const { required, postalCode } = useValidations()

  const inquiryPostalCode = async (payload: PostalAddressDto) => {
    try {
      setLoading(true)
      const companyUUID = companyContext.selectedCompany.uuid
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      companyContext.setLoading?.(true)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      companyContext.setSelectedCompany?.(data[0])
      setFormState(FormState.Done)
      if (formState === FormState.Inquiry) {
        snackbar('success', 'استعلام اطلاعات پستی با موفقیت ثبت شد')
      } else {
        snackbar('success', 'استعلام مجدد اطلاعات پستی با موفقیت انجام شد')
      }
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
      companyContext.setLoading?.(false)
    }
  }

  const onsubmit = (payload: PostalAddressDto) => {
    inquiryPostalCode(payload)
  }

  return (
    <form
      id="add-postal-address-company"
      name="addPostalAddressCompany"
      onSubmit={handleSubmit(onsubmit)}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>ثبت آدرس شرکت</span>
        <CancelOutlinedIcon sx={{ color: 'red' }} onClick={() => onClose()} />
      </DialogTitle>

      <DialogContent>
        <KTextField
          sx={{ margin: '16px 0' }}
          control={control}
          label="کدپستی"
          name="postalCode"
          rules={{ required: required(), validate: postalCode }}
          type="number"
        />

        <KFieldset className="mt-8" title="اطلاعات پستی">
          <KInfo
            className="mb-2"
            title="شهر"
            value={companyContext?.selectedCompany?.postalAddress?.city}
          />
          <KInfo
            className="mb-2"
            title="استان"
            value={companyContext?.selectedCompany?.postalAddress?.state}
          />
          <KInfo
            className="mb-2"
            title="آدرس"
            value={companyContext?.selectedCompany?.postalAddress?.address}
          />
        </KFieldset>
      </DialogContent>

      <DialogActions>
        <KButton
          endIcon={<SyncIcon />}
          loading={loading}
          type="submit"
          variant="contained"
          color="success"
        >
          {formState === FormState.Done ? 'استعلام مجدد' : 'استعلام'}
        </KButton>

        {formState === FormState.Done && (
          <KButton endIcon={<ArrowCircleLeftIcon />} onClick={() => setStep(3)}>
            ادامه
          </KButton>
        )}
      </DialogActions>
    </form>
  )
}

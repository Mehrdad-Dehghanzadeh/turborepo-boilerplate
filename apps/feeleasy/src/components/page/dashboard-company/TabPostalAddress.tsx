import Paper from '@mui/material/Paper'
import { KTextField, KButton, KFieldset, KInfo } from '@components-kits'
import useValidations from '@hooks/useValidations'
import useSnackbar from '@hooks/useSnackbar'
import { useForm } from 'react-hook-form'
import type { PostalAddressDto } from '@models/LeasingCompanies'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useState, useContext } from 'react'
import Divider from '@mui/material/Divider'
import { CompanyContext } from '@context/CompanyContext'
import { getToken } from '@utils/auth'
import apis from '@apis'
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

  const { handleSubmit, control } = useForm<PostalAddressDto>({
    defaultValues: {
      postalCode: info?.postalCode
    }
  })
  const { required } = useValidations()

  const onsubmit = async (payload: PostalAddressDto) => {
    try {
      setLoading(true)
      await apis.leasingCompanies.updateLeasingCompany(payload, companyUUID)
      const { data }: { data: any[] } = await apis.leasingCompanies.read(uuid)
      companyContext.setCompanies?.(data)
      snackbar('success', 'اطلاعات پستی با موفقیت ثبت شد')
    } catch (error) {
      snackbar('error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper component="section" sx={{ paddingX: '16px', paddingBottom: '16px' }}>
      <form
        id="postal-adderss-form"
        name="postal-adderss-form"
        onSubmit={handleSubmit(onsubmit)}
      >
        <DialogContent sx={{ width: '680px' }}>
          <KTextField
            sx={{ marginBottom: '24px' }}
            control={control}
            label="کدپستی"
            name="postalCode"
            rules={{ required: required() }}
            type="number"
            inputMode="numeric"
          />

          {info && (
            <KFieldset className="mt-8" title="اطلاعات پستی">
              <KInfo className="mb-2" title="شهر" value={info?.city} />
              <KInfo className="mb-2" title="استان" value={info?.state} />
              <KInfo className="mb-2" title="آدرس" value={info?.address} />
            </KFieldset>
          )}
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
            استعلام و ذخیره
          </KButton>
        </DialogActions>
      </form>
    </Paper>
  )
}

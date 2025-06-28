import apis from '@apis'
import { KButton, KFieldset } from '@components/kits'
import { KFileUpload } from '@components/kits/KFileUpload/KFileUpload'
import useSnackbar from '@hooks/useSnackbar'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Paper } from '@mui/material'

type PropsType = {
  chequeUuid: string
  getGuaranteeCheque: () => void
}

export default function ChequeUploadForm({
  chequeUuid,
  getGuaranteeCheque
}: Readonly<PropsType>) {
  const { handleSubmit, control } = useForm<any>()
  const { snackbar } = useSnackbar()

  const [loading, setLoading] = useState<boolean>(false)

  const handleUploadFile = (data: any) => {
    setLoading(true)

    const formData = new FormData()
    formData.append('file', data.file)

    apis.repaymentCheques
      .postImage(chequeUuid, formData)
      .then(() => {
        snackbar('success', 'با موفقیت آپلود شد')
        getGuaranteeCheque()
      })
      .catch((err: Error) => {
        snackbar('error', 'حجم فایل مورد نظر زیاد است')
      })
      .finally(() => setLoading(false))
  }

  return (
    <Paper component="section" sx={{ padding: '16px', margin: '20px 0' }}>
      <KFieldset title="تصویر چک ضمانت">
        <form onSubmit={handleSubmit(handleUploadFile)} className="my-5">
          <KFileUpload name="file" control={control} isRequired />
          <KButton variant="contained" color="info" type="submit" loading={loading}>
            ثبت تصویر چک
          </KButton>
        </form>
      </KFieldset>
    </Paper>
  )
}

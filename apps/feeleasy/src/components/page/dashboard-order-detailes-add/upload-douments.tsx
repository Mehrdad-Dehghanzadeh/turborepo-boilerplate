import { KButton, KFieldset, KSelect } from '@components/kits'
import { KFileUpload } from '@components/kits/KFileUpload/KFileUpload'
import { useForm } from 'react-hook-form'
import { Grid, Paper } from '@mui/material'
import { VehicleDocumensList } from '@enums/VehicleDocumnetType'
import useValidations from '@hooks/useValidations'
import { VehiclesDocumentsDto } from '@models/Assets'

type PropsType = {
  postOrderDocuments: (arg: VehiclesDocumentsDto) => void
  uploadDocumentLoading: boolean
}

export default function UploadDocuments({
  postOrderDocuments,
  uploadDocumentLoading
}: Readonly<PropsType>) {
  const { handleSubmit, control } = useForm<VehiclesDocumentsDto>()
  const { required } = useValidations()

  return (
    <form className="upload-form mt-5" onSubmit={handleSubmit(postOrderDocuments)}>
      <Paper component="section" sx={{ padding: '16px' }}>
        <KFieldset title="آپلود مدارک" padding="20px">
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            <Grid item xs={12} md={3}>
              <KSelect
                items={VehicleDocumensList}
                name="type"
                control={control}
                label="انتخاب مدرک"
                rules={{ required: required() }}
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <KFileUpload
                name="file"
                control={control}
                isRequired
                color="info"
                className="upload-form-input"
              />
            </Grid>

            <Grid item xs={12}>
              <KButton
                type="submit"
                color="info"
                variant="contained"
                loading={uploadDocumentLoading}
                className="upload-form-btn"
                sx={{
                  marginTop: '5px'
                }}
              >
                بارگذاری
              </KButton>
            </Grid>
          </Grid>
        </KFieldset>
      </Paper>
    </form>
  )
}

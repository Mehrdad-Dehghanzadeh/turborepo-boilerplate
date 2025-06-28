import useValidations from '@hooks/useValidations'
import { KButton, KDatePicker, KFieldset, KTextField } from '@components/kits'
import { Grid } from '@mui/material'
import { useForm } from 'react-hook-form'
import { CollateralsOrDocuments } from '@models/Guarantee'

type PropsType = {
  btnLoading: boolean
  collateral: CollateralsOrDocuments
  onSubmitInquiry: (arg: any) => void
}

export default function ChequeRegisterForm({
  btnLoading,
  collateral,
  onSubmitInquiry
}: Readonly<PropsType>) {
  const { handleSubmit, control } = useForm<any>()
  const { required, minLength, maxLength } = useValidations()

  return (
    <KFieldset title="ثبت چک ضمانت">
      <form onSubmit={handleSubmit(onSubmitInquiry)}>
        <Grid container spacing={3} sx={{ padding: '10px 0' }}>
          <Grid xs={12} md={6} item>
            <KTextField
              name="chequeParameters.identifier"
              control={control}
              label="شناسه چک"
              rules={{
                required: required(),
                minLength: minLength(16),
                maxLength: maxLength(16)
              }}
            />
          </Grid>

          <Grid xs={12} md={6} item>
            <KDatePicker
              name="chequeParameters.dueDate"
              control={control}
              variant="outlined"
              label="تاریخ چک"
              rules={{ required: required() }}
            />
          </Grid>

          <Grid xs={12} md={6} item sx={{ display: 'none' }}>
            <KTextField
              name="secondaryId"
              control={control}
              defaultValue={collateral?.id}
              type="hidden"
            />
          </Grid>

          <Grid xs={12} md={6} item sx={{ display: 'none' }}>
            <KTextField
              name="chequeParameters.amount"
              control={control}
              defaultValue={collateral?.amount}
              type="hidden"
            />
          </Grid>

          <Grid xs={12} item>
            <KButton
              variant="contained"
              color="success"
              type="submit"
              sx={{ display: 'block', marginLeft: 'auto', marginTop: '5px' }}
              loading={btnLoading}
            >
              ذخیره و استعلام
            </KButton>
          </Grid>
        </Grid>
      </form>
    </KFieldset>
  )
}

import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import { KButton, KTextField } from '@components/kits'

type PropsType = {
  handleEditInquiry: (data: any) => void
  loading: boolean
}

export default function ChequeEditForm({
  handleEditInquiry,
  loading
}: Readonly<PropsType>) {
  const { control, handleSubmit } = useForm()
  const { required } = useValidations()

  return (
    <form onSubmit={handleSubmit(handleEditInquiry)} className="d-flex">
      <KTextField
        control={control}
        name="identifier"
        label="شماره سریال"
        sx={{ margin: '0 5px' }}
        rules={{ required: required() }}
      />
      <KButton
        color="success"
        variant="contained"
        sx={{ alignSelf: 'flex-start' }}
        type="submit"
        loading={loading}
      >
        ثبت
      </KButton>
    </form>
  )
}

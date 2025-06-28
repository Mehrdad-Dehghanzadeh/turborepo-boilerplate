import { Installments } from '@models/Repayments'
import { KButton, KTextField } from '@components/kits'
import { Box, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { utcToJalali } from '@utils/date'
import useFilters from '@hooks/useFilters'
import useValidations from '@hooks/useValidations'
import { useContext } from 'react'
import { RepaymentContext } from '@context/RepaymentContext'

type PropsType = {
  handlePostChequeInquiry: any
  btnLoading: boolean
  inquiryResult: any
}

export default function ChequeRegisterForm({
  handlePostChequeInquiry,
  btnLoading
}: Readonly<PropsType>) {
  const { control, handleSubmit, reset } = useForm()
  const { price } = useFilters()
  const { required } = useValidations()
  const { repaymentData } = useContext(RepaymentContext)

  return (
    <form onSubmit={handleSubmit(handlePostChequeInquiry)}>
      <Box className="installment-list">
        {repaymentData?.installments.map((item: Installments, index: number) => (
          <Box className="installment-list_item" key={`${index}-${item.uuid}`}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="var(--color-pink-main)" variant="subtitle1">
                ثبت چک قسط «{item?.order}»
              </Typography>
              <Typography variant="subtitle2">{price(item?.amount)}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                margin: '10px 0'
              }}
            >
              <Typography variant="body2" sx={{ color: 'var(--color-bg-400)' }}>
                {utcToJalali(item?.dueDate)}
              </Typography>
            </Box>

            <Box sx={{ marginTop: '20px' }}>
              <KTextField
                name={`chequeParameters.${index}.identifier`}
                control={control}
                label="شناسه چک"
                rules={{ required: required() }}
              />

              <KTextField
                name={`chequeParameters.${index}.amount`}
                control={control}
                defaultValue={item?.amount}
                type="hidden"
                sx={{ display: 'none' }}
              />

              <KTextField
                name={`chequeParameters.${index}.dueDate`}
                control={control}
                defaultValue={item?.dueDate}
                type="hidden"
                sx={{ display: 'none' }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <KButton
        type="submit"
        loading={btnLoading}
        color="primary"
        variant="contained"
        sx={{
          marginY: '20px',
          width: '150px',
          marginRight: 'auto'
        }}
      >
        ذخیره و استعلام
      </KButton>
    </form>
  )
}

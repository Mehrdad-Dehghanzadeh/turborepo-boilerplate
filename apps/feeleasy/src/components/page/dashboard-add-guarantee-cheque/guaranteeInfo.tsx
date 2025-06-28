import { enumsProvider } from '@utils/enums'
import { Chip, Grid, Paper } from '@mui/material'
import { KFieldset, KInfo } from '@components/kits'
import useFilters from '@hooks/useFilters'
import Guarantee, { CollateralsOrDocuments } from '@models/Guarantee'

type PropsType = {
  guaranteeInfo: Guarantee | null
}

export default function GuaranteeInfo({ guaranteeInfo }: Readonly<PropsType>) {
  const { price } = useFilters()

  return (
    <Paper component="section" sx={{ padding: '16px', margin: '20px 0' }}>
      <KFieldset title="وثایق متقاضی">
        {guaranteeInfo?.applicantCollaterals.map(
          (collateral: CollateralsOrDocuments, index: number) => (
            <Grid container key={`collateral-${index}`}>
              <Grid item xs={12} md={6}>
                <KInfo
                  title="نوع وثیقه"
                  value={enumsProvider('CollateralTypeList', collateral?.type)?.title}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <KInfo title="مقدار" value={price(collateral?.amount)} />
              </Grid>
            </Grid>
          )
        )}

        <KInfo
          title="وضیعت تایید"
          value={
            <Chip
              label={enumsProvider('States', guaranteeInfo?.approved)?.title}
              color={enumsProvider('States', guaranteeInfo?.approved)?.color}
              variant="outlined"
            />
          }
        />
      </KFieldset>
    </Paper>
  )
}

import { Box, Grid, Paper } from '@mui/material'
import { KFieldset, KInfo } from '@components/kits'
import useFilters from '@hooks/useFilters'
import { Cheque } from '@models/Guarantee'
import { utcToJalali } from '@utils/date'
import { enumsProvider } from '@utils/enums'

type PropsType = {
  chequeInfo: Cheque
}

export default function ChequeInfo({ chequeInfo }: Readonly<PropsType>) {
  const { price } = useFilters()

  const appUrl = process.env.NEXT_PUBLIC_API_URL

  return (
    <>
      <Paper component="section" sx={{ padding: '16px', margin: '20px 0' }}>
        <KFieldset title="چک ضمانت">
          <Grid container>
            <Grid item xs={12} md={6}>
              <KInfo title="سریال چک" value={chequeInfo?.serial} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="شناسه چک" value={chequeInfo?.identity} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="دارنده چک" value={chequeInfo?.owner} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="مبلغ" value={price(chequeInfo?.amount)} />
            </Grid>

            {chequeInfo?.dueDate && (
              <Grid xs={12} md={4} lg={6} item>
                <KInfo title="تاریخ" value={utcToJalali(chequeInfo?.dueDate)} />
              </Grid>
            )}

            <Grid xs={12} md={4} lg={6} item>
              <KInfo
                title="بانک"
                value={enumsProvider('BankNamesList', chequeInfo?.bankInfo?.bank)?.title}
              />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="شعبه" value={chequeInfo?.bankInfo?.branchName} />
            </Grid>

            <Grid xs={12} md={4} lg={6} item>
              <KInfo title="کد شعبه" value={chequeInfo?.bankInfo?.branchCode} />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: '20px' }}>
              {chequeInfo?.imagePath && (
                <Box
                  component="img"
                  sx={{
                    width: {
                      xs: '100%',
                      md: '50%'
                    },

                    borderRadius: '15px'
                  }}
                  alt="cheque image"
                  src={`${appUrl}/${chequeInfo?.imagePath}`}
                />
              )}
            </Grid>
          </Grid>
        </KFieldset>
      </Paper>
    </>
  )
}

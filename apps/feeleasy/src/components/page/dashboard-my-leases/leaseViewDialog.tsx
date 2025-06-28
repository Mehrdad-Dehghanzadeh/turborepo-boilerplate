'use client'
import { KButton, KFieldset, KInfo } from '@components-kits'
import { useState, forwardRef, useImperativeHandle } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { deepClone } from '@utils/object'
import { enumsProvider } from '@utils/enums'
import { utcToJalali } from '@utils/date'
import { LeaseDto } from '@models/Lease'
import useFilters from '@hooks/useFilters'

type Props = {
  showCallBack?: () => void
  closeCallBack?: () => void
}

export default forwardRef<any, Props>(function (
  { showCallBack, closeCallBack }: Readonly<Props>,
  _ref
) {
  const [open, setOpen] = useState<boolean>(false)
  const [info, setInfo] = useState<any>(null)

  const { price } = useFilters()

  const onClose = () => {
    setOpen(false)
    setInfo(null)
    closeCallBack?.()
  }

  const showDialog = (data: LeaseDto) => {
    setInfo(deepClone(data))
    showCallBack?.()
    setOpen(true)
  }

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  return (
    <Dialog open={open} maxWidth="md">
      <DialogContent sx={{ width: '680px' }}>
        {info && (
          <Box sx={{ marginTop: '10px' }}>
            <KFieldset title="اطلاعات تسهیلات">
              <Grid spacing={2} container>
                <Grid xs={6} item>
                  <KInfo title="متقاضی" value={info.lessee.name} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo title="تاریخ ایجاد" value={utcToJalali(info.createDate)} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo title="اعتبار اولیه" value={price(info.allocatedCredit)} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo title="اعتبار باقی مانده" value={price(info.availableCredit)} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo title="طرح" value={info.leasingProtocol.name} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo title=" نهاد مالی" value={info.lessor.name} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo
                    title="دوره بازپرداخت"
                    value={`${info.repaymentSchedule.term} ماه`}
                  />
                </Grid>

                <Grid xs={6} item>
                  <KInfo
                    title="تناوب بازپرداخت"
                    value={`${
                      enumsProvider(
                        'FrequencyList',
                        info.repaymentSchedule.paymentFrequency
                      )?.title
                    }`}
                  />
                </Grid>
              </Grid>
            </KFieldset>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions>
        <KButton type="button" color="error" onClick={onClose}>
          بستن
        </KButton>
      </DialogActions>
    </Dialog>
  )
})

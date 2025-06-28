import Grid from '@mui/material/Grid'
import { KButton, KInfo, KSelect } from '@components-kits'
import Paper from '@mui/material/Paper'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import TransactionTable from './transactionTable'
import useFilters from '@hooks/useFilters'
import type { WalletItem, WalletItems } from '@models/Wallet'
import './wallet.scss'

type Props = {
  ownerType: string
  ownerUuid: string | unknown
}

const WalletBalance: React.FC<Props> = ({ ownerType, ownerUuid }) => {
  const [walletInfo, setWalletInfo] = useState<any>()
  const [walletItems, setWalletItems] = useState<WalletItems>([])
  const [showTransactions, setShowTransactions] = useState<boolean>(false)

  const { control, watch, setValue, trigger } = useForm<any>()

  const { snackbar } = useSnackbar()
  const { price } = useFilters()

  const watchWallet = watch('wallet')

  const setData = (data: WalletItems) => {
    if (Array.isArray(data)) {
      setValue('wallet', data?.[0]?.uuid)
      trigger('wallet')
      setWalletItems(data)
    }
  }

  const getWallet = () => {
    apis.wallet
      .read({
        params: {
          ownerType: ownerType,
          ownerUuid: ownerUuid
        }
      })
      .then(({ data }: { data: WalletItems }) => {
        setData(data)
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
  }

  useEffect(() => {
    getWallet()
  }, [])

  useEffect(() => {
    changeWallet()
  }, [watchWallet])

  const changeWallet = () => {
    const walletUUID = control._formValues.wallet
    const walletInfo = walletItems?.find((info: WalletItem) => {
      return info.uuid === walletUUID
    })
    setShowTransactions(false)
    setWalletInfo(walletInfo)
  }

  return (
    <>
      {walletItems?.length > 0 ? (
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} md={8}>
            <form>
              <KSelect
                label="انتخاب کیف"
                name="wallet"
                items={walletItems}
                control={control}
                onChange={(e) => {
                  changeWallet()
                }}
                valueKey="uuid"
                titleKey="title"
              />
            </form>
          </Grid>
        </Grid>
      ) : (
        <p className="empty-message">کیفی برای نمایش وجود ندارد</p>
      )}

      {walletInfo && (
        <Paper className="wallet-info">
          <Grid spacing={2} container sx={{ padding: '10px' }}>
            <Grid xs={6} sm={6} md={6} item>
              <KInfo title="عنوان" value={walletInfo?.title} />
            </Grid>

            <Grid xs={6} sm={6} md={6} item>
              <KInfo title="دارنده" value={walletInfo?.owner?.name} />
            </Grid>

            <Grid xs={6} md={6} item sx={{ display: 'flex', gap: '0 5px' }}>
              <KInfo title="موجودی" value={price(walletInfo?.currentBalance)} />
            </Grid>

            <Grid xs={6} md={6} item>
              <KButton
                color="primary"
                variant="outlined"
                onClick={() => setShowTransactions(true)}
              >
                مشاهده تراکنش ها
              </KButton>
            </Grid>
          </Grid>
        </Paper>
      )}

      {showTransactions && <TransactionTable walletUuid={walletInfo?.uuid} />}
    </>
  )
}

export default WalletBalance

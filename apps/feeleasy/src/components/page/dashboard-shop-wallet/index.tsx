'use client'
import Box from '@mui/material/Box'
import { useAppStore } from '@/store'
import WalletBalance from '@components-shared/wallet/walletBalance'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function () {
  const contribiutions = useAppStore((state) => state.contributions)
  const searchParams = useSearchParams()
  const uuid = searchParams.get('shopUuid')
  const [shopUuid, setShopUuid] = useState<string>(uuid || '')

  useEffect(() => {
    if (uuid) {
      setShopUuid(uuid)
    }
  }, [uuid])

  const ownerType = 'SHOP'
  const ownerUuid = shopUuid || contribiutions?.[0].partyId

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <WalletBalance ownerType={ownerType} ownerUuid={ownerUuid} />
    </Box>
  )
}

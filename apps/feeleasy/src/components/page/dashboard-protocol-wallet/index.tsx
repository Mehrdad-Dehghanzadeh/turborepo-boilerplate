'use client'
import Box from '@mui/material/Box'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import WalletBalance from '@components-shared/wallet/walletBalance'

export default function () {
  const searchParams = useSearchParams()
  const uuid = searchParams.get('protocolUuid')
  const [protocolUuid, setProtocolUuid] = useState<string>(uuid || '')

  useEffect(() => {
    if (uuid) {
      setProtocolUuid(uuid)
    }
  }, [uuid])

  const ownerType = 'LEASING_PROTOCOL'
  const ownerUuid = protocolUuid

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <WalletBalance ownerType={ownerType} ownerUuid={ownerUuid} />
    </Box>
  )
}

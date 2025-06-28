'use client'
import Box from '@mui/material/Box'
import WalletBalance from '@components-shared/wallet/walletBalance'
import { PartyCategory } from '@enums/PartyCategory'
import { useAppStore } from '@store'

export default function FeeleasyWallet() {
  const ownerType = PartyCategory.Admin
  const contribiutions = useAppStore((state) => state.contributions)
  const ownerUuid = contribiutions?.find(
    (item) => item.partyCategory === PartyCategory.Admin
  )?.partyId

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <WalletBalance ownerType={ownerType} ownerUuid={ownerUuid} />
    </Box>
  )
}

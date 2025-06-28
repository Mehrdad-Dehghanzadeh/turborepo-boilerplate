export interface WalletItem {
  currentBalance: NumberString
  owner: {
    name: string
    uuid: NumberString
  }
  title: string
  uuid: NumberString
  walletOwnerType: string
  walletType: string
}

export type WalletItems = WalletItem[] | []

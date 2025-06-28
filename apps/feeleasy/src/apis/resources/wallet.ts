import { type AxiosInstance } from 'axios'

export default ($axios: AxiosInstance) => ({
  read(params: any) {
    return $axios.get('/wallets', { ...params })
  },
  getItem(walletUUID: string) {
    return $axios.get(`/wallets/${walletUUID}`)
  }
})

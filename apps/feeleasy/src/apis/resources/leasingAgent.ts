import { AxiosInstance } from 'axios'

export default ($axios: AxiosInstance) => ({
  read(uuid: string) {
    return $axios.get(`/leasing-agents/${uuid}`)
  },

  getOfferings() {
    return $axios.get('/leasing-agent/offerings')
  }
})

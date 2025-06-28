import { type AxiosInstance } from 'axios'

export default ($axios: AxiosInstance) => ({
  read(params: any) {
    return $axios.get('/entries', { params })
  }
})

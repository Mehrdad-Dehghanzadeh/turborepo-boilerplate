import type { UpdateShopDto } from '@models/Shop'
import { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

export default ($axios: AxiosInstance) => ({
  read(params: any, config: InternalAxiosRequestConfig) {
    return $axios.get('/shops', { params, ...config })
  },

  getInfo(uuid: string, config: InternalAxiosRequestConfig) {
    return $axios.get(`/shops/${uuid}`, config)
  },

  update(uuid: string, payload: UpdateShopDto) {
    return $axios.put(`/shops/${uuid}`, payload)
  },

  create(payload: UpdateShopDto) {
    return $axios.post('/shops', payload)
  },

  approve(shopUuid: NumberString, payload: any) {
    return $axios.patch(`/shops/${shopUuid}`, payload)
  }
})

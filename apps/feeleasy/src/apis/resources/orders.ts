import type { OrderDto, OrderPaymentDto } from '@models/Orders'
import { type AxiosInstance } from 'axios'
import { SettlementDto } from '@models/Settlement'

export default ($axios: AxiosInstance) => ({
  read(params?: any) {
    return $axios.get('/orders', {
      params
    })
  },

  readUserOrders(uuid: string) {
    return $axios.get(`/users/${uuid}/orders`)
  },

  readShopOrders(uuid: string) {
    return $axios.get(`/shops/${uuid}/orders`)
  },

  create(payload: OrderDto) {
    return $axios.post('/orders', payload)
  },

  update(payload: OrderDto, orderUuid: string) {
    return $axios.put(`/orders/${orderUuid}`, payload)
  },

  getItem(uuid: string) {
    return $axios.get(`/orders/${uuid}`)
  },

  approve(orderUuid: string, payload: any) {
    return $axios.patch(`/orders/${orderUuid}`, payload)
  },

  payments(orderUuid: string) {
    return $axios.get(`/orders/${orderUuid}/payments`)
  },

  settlement(payload: SettlementDto, orderUuid: NumberString, paymentUuid: string) {
    return $axios.post(
      `/orders/${orderUuid}/payments/${paymentUuid}/settlements`,
      payload
    )
  },

  creditPayment(payload: OrderPaymentDto, orderUuid: NumberString) {
    return $axios.post(`/orders/${orderUuid}/payments`, payload)
  },

  delivery(orderUuid: NumberString, payload: any) {
    return $axios.patch(`/orders/${orderUuid}`, payload)
  },

  postDocuments(orderUuid: NumberString, type: string, payload: any) {
    return $axios.put(`/orders/${orderUuid}/documents/${type}`, payload)
  },

  readDocuments(orderUuid: NumberString) {
    return $axios.get(`/orders/${orderUuid}/documents`)
  }
})

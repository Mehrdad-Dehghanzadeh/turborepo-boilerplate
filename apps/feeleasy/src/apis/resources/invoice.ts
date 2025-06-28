import { InvoiceDto } from '@models/Invoice'
import { AxiosInstance } from 'axios'

export default ($axios: AxiosInstance) => ({
  get(uuid: string) {
    return $axios.get(`/invoices/${uuid}`)
  },

  post(payload: InvoiceDto) {
    return $axios.post('/invoices', payload)
  },

  getToken(invoiceUuid: string) {
    return $axios.get(`/invoices/${invoiceUuid}/payment-token`)
  }
})

import { type AxiosInstance } from 'axios'
import {
  ChequeInquiryDto as RepaymentChequeInquiryDto,
  OtpIntent,
  ScoringDto,
  AuthenticationDto,
  GuaranteeChequeInquiryDto
} from '@models/Inquiry'
import { InquiryParams } from '@models/Guarantee'

export default ($axios: AxiosInstance) => ({
  postInquiryBatch(payload: AuthenticationDto | ScoringDto | GuaranteeChequeInquiryDto) {
    return $axios.post(`/inquiry-batches`, payload)
  },

  editInquiryBatch(inquiryUuid: string, payload: any) {
    return $axios.put(`/inquiry-batches/${inquiryUuid}`, payload)
  },

  resendInquiryBatch(inquiryUuid: NumberString, payload: any) {
    return $axios.patch(`/inquiry-batches/${inquiryUuid}`, payload)
  },

  getInquiryBatchResult(params: any) {
    return $axios.get('/inquiry-batches', { params })
  },

  confirmInquiryBatchResult(inquiryUuid: NumberString, payload: any) {
    return $axios.patch(`/inquiry-batches/${inquiryUuid}`, payload)
  },

  modifyInquiryBatchResult(inquiryUuid: NumberString, payload: any) {
    return $axios.patch(`/inquiry-batches/${inquiryUuid}`, payload)
  },

  getInquiry(params: InquiryParams) {
    return $axios.get(`/inquiries`, { params })
  },

  postInquiry(payload: GuaranteeChequeInquiryDto) {
    return $axios.post('/inquiries', payload)
  },

  editInquiry(
    uuid: string,
    payload: RepaymentChequeInquiryDto | AuthenticationDto | GuaranteeChequeInquiryDto
  ) {
    return $axios.put(`/inquiries/${uuid}`, payload)
  },

  modifyInquiryResult(inquiryUuid: NumberString, payload: any) {
    return $axios.patch(`/inquiries/${inquiryUuid}`, payload)
  },

  sendOtp(uuid: string, payload: OtpIntent) {
    return $axios.post(`/users/${uuid}/otps`, payload)
  }
})

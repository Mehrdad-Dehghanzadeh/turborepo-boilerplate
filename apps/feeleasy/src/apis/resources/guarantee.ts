import {
  ApproveDto,
  ApproveInquiryDto,
  ReturnForUpdateDto,
  SendForApproveDto
} from '@models/Guarantee'
import { AxiosInstance } from 'axios'

export default ($axios: AxiosInstance) => ({
  read(leaseUuid: string) {
    return $axios.get(`/leases/${leaseUuid}/guarantee`)
  },

  modifyState(
    guaranteeUuid: string,
    payload: ApproveDto | SendForApproveDto | ReturnForUpdateDto
  ) {
    return $axios.patch(`guarantees/${guaranteeUuid}`, payload)
  },

  approveChequeInquiry(uuid: string, collateralUuid: string, payload: ApproveInquiryDto) {
    return $axios.put(`/guarantees/${uuid}/collaterals/${collateralUuid}/cheque`, payload)
  }
})

import { VoucherQueryParams } from '@models/Voucher'
import type {
  UserNationalCardDto,
  ContactInfoDto,
  IdentityCardDto,
  PostalAddressDto,
  PersonalInfoDto,
  SendOtpDto,
  ProfileSetting,
  CheckOtp,
  SetCredentialDto,
  CheckPasswordOtpDto
} from '@models/Users'
import { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

export default ($axios: AxiosInstance) => ({
  sendOtp(payload: SendOtpDto) {
    return $axios.post('/mobile-verifications', payload)
  },

  checkOtp(payload: CheckOtp) {
    return $axios.post('/users', payload)
  },

  checkForgetPasswordOtp(userPhoneNumber: string, payload: CheckPasswordOtpDto) {
    return $axios.patch(`/mobile-verifications/${userPhoneNumber}`, payload)
  },

  setCredential(userUuid: NumberString, payload: SetCredentialDto) {
    return $axios.put(`/users/${userUuid}/credential`, payload)
  },

  read(params: any, config: InternalAxiosRequestConfig) {
    return $axios.get('/users', { params, ...config })
  },

  getInfo(uuid: string) {
    return $axios.get(`/users/${uuid}/`)
  },

  updateNationalCard(uuid: string, payload: UserNationalCardDto) {
    return $axios.put(`/users/${uuid}/nationalCard`, payload)
  },

  updateContactInfo(uuid: string, payload: ContactInfoDto) {
    return $axios.put(`/users/${uuid}/contactInfo`, payload)
  },

  updateIdentityCard(uuid: string, payload: IdentityCardDto) {
    return $axios.put(`/users/${uuid}/identityCard`, payload)
  },

  updatePostalAddress(uuid: string, payload: PostalAddressDto) {
    return $axios.patch(`/users/${uuid}/postal-address`, payload)
  },

  updatePersonalInfo(uuid: string, payload: PersonalInfoDto) {
    return $axios.put(`/users/${uuid}/personalInfo`, payload)
  },

  regulatoryApprove(uuid: string) {
    return $axios.patch(`/users/${uuid}/regulatoryApprove`)
  },

  profileSetting(payload: ProfileSetting, uuid: NumberString) {
    return $axios.put(`/users/${uuid}/uiSettings`, payload)
  },

  getVouchers(uuid: NumberString, params: VoucherQueryParams) {
    return $axios.get(`/users/${uuid}/vouchers`, { params })
  }
})

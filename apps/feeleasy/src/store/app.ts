import { create } from 'zustand'
import apis from '@apis'
import { getToken } from '@utils/auth'
import type {
  HeadLine,
  Contributions,
  ValidationUser,
  ProfileSetting,
  Verification
} from '@models/Users'

type State = {
  user: any
  contributions: Contributions | null
  isAdmin: boolean
  isLeasing: boolean
  headline: HeadLine
  validation: ValidationUser | null
  settings: ProfileSetting | null
  verification: Verification
}

type Actions = {
  setUser: (val: any) => any
  updateUser: () => Promise<any>
  setContributions: (val: any) => any
  setHeadline: (val: any) => any
  setIsAdmin: (val: any) => any
  setIsLeasing: (val: any) => any
  setValidation: (val: any) => any
  setSettings: (val: any) => any
  setVerification: (val: any) => any
  reset: () => void
}

const initialState: State = {
  user: null,
  contributions: null,
  isAdmin: false,
  isLeasing: false,
  validation: null,
  headline: {
    headline1: '',
    headline2: ''
  },
  settings: {
    viewAddShopForm: false,
    viewAddLeasingCompanyForm: false
  },
  verification: {
    mobilePhoneNumberVerified: 'GRANTED',
    simCardOwnershipConfirmed: 'REQUESTED',
    identityCardVerified: 'REQUESTED',
    postalAddressValid: 'REQUESTED',
    verifiedIban: null
  }
}

export const useAppStore = create<State & Actions>((set, get) => ({
  ...initialState,

  setUser: (val: any) => set(() => ({ user: val })),
  setContributions: (val: any) => set(() => ({ contributions: val })),
  setIsAdmin: (val: any) => set(() => ({ isAdmin: val?.role === 'ADMIN' })),
  setIsLeasing: (val: any) =>
    set(() => ({ isLeasing: val?.partyCategory === 'LEASING_COMPANY' })),
  setHeadline: (val: HeadLine) => set(() => ({ headline: val })),
  setValidation: (val: ValidationUser) => set(() => ({ validation: val })),
  setSettings: (val: any) => set(() => ({ settings: val })),
  setVerification: (val: any) => set(() => ({ verification: val })),

  updateUser: () => {
    const uuid = <string>getToken()
    return new Promise((resolve, reject) => {
      apis.users
        .getInfo(uuid)
        .then((res: any) => {
          get().setUser(res?.data?.user)
          get().setHeadline({
            headline1: res?.data?.headline1,
            headline2: res?.data?.headline2
          })
          get().setContributions(res?.data?.contributions)
          get().setIsAdmin(res?.data?.contributions?.[0])
          get().setIsLeasing(res?.data?.contributions?.[0])
          get().setValidation(res?.data?.validation)
          get().setSettings(res?.data?.settings)
          get().setVerification(res?.data?.userVerification)
          resolve(res)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  },

  reset: () => {
    set(initialState)
  }
}))

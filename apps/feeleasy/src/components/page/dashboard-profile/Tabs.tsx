'use client'
import { KTabs } from '@components-kits'
import ContactInfoTab from './ContactInfoTab'
import PostalAddressTab from './PostalAddressTab'
import { useAppStore } from '@store'
import AuthenticationTab from './AuthenticationTab'
import Setting from './Setting'
import IdentityInfoTab from './IdentityInfoTab'
import PersonalInfoTab from './PersonalInfoTab'
import { BooleanPlus } from '@enums/BooleanPlus'
import Scoring from './Scoring'
import { InquiryResultProvider } from '@context/InquiryContext'
import { useEffect, useMemo, useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { Voucher } from '@models/Voucher'
import { VoucherContext } from '@context/VoucherContext'
import { Offerings } from '@models/offering'

export default function () {
  const user = useAppStore((state) => state.user)
  const [loading, setLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const [vouchersResult, setVouchersResult] = useState<Voucher[] | null>(null)
  const [availableVouchers, setAvailableVoucher] = useState<string[] | null>(null)
  const [payableItems, setPayableItems] = useState<Offerings[] | null>(null)
  const [offerings, setOfferings] = useState<Offerings[] | null>(null)
  const [currentCaller, setCurrentCaller] = useState<string | null>(null)

  const getOfferings = () => {
    setLoading(true)

    apis.leasingAgent
      .getOfferings()
      .then(({ data }: { data: Offerings[] }) => {
        setOfferings(data)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const getVouchers = (caller: string) => {
    setLoading(true)

    apis.users
      .getVouchers(user.uuid, { available: true })
      .then(({ data }: { data: Voucher[] }) => {
        setVouchersResult(data)
        setCurrentCaller(caller)
      })
      .then(() => getOfferings())
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const checkVouchers = () => {
    const availableVouchers = vouchersResult?.map((item: Voucher) => item.type)
    setAvailableVoucher(availableVouchers ?? null)

    const payableItems = offerings?.filter(
      (item: Offerings) => !availableVouchers?.includes(item?.code)
    )
    setPayableItems(payableItems ?? null)
  }

  const contextValue = useMemo(
    () => ({
      loading,
      vouchersResult,
      availableVouchers,
      payableItems,
      getVouchers,
      checkVouchers,
      currentCaller
    }),
    [vouchersResult, availableVouchers, payableItems, loading]
  )

  useEffect(() => {
    checkVouchers()
  }, [offerings])

  return (
    user && (
      <section className="profile-tabs">
        <InquiryResultProvider subjectUuid={user?.uuid}>
          <VoucherContext.Provider value={contextValue}>
            <KTabs
              tabs={
                user?.verified !== BooleanPlus.GRANTED
                  ? ['احراز هویت', 'اعتبارسنجی']
                  : [
                      'احراز هویت',
                      'اعتبارسنجی',
                      'اطلاعات شناسایی',
                      'اطلاعات تماس',
                      'اطلاعات پستی',
                      'اطلاعات شخصی',
                      'تنظیمات'
                    ]
              }
              disabledTabs={[`${user?.verified !== BooleanPlus.GRANTED && 'تنظیمات'}`]}
            >
              <AuthenticationTab />
              <Scoring />
              <IdentityInfoTab />
              <ContactInfoTab />
              <PostalAddressTab />
              <PersonalInfoTab />
              <Setting />
            </KTabs>
          </VoucherContext.Provider>
        </InquiryResultProvider>
      </section>
    )
  )
}

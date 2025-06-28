'use client'
import { useEffect, useState, useCallback } from 'react'
import { KTabs, KLoading } from '@components-kits'
import BasicInfoTab from './Tabs/BasicInfoTab'
import ContactInfoTab from './Tabs/ContactInfoTab'
import PostalAddressTab from './Tabs/PostalAddressTab'
import CorporateInfoTab from './Tabs/CorporateInfoTab'
import apis from '@apis'
import { useAppStore } from '@store'
import type { ShopInfo, TShopInfo } from '@models/Shop'
import { PartyCategory } from '@enums/PartyCategory'
import { resourceOwnerConfig } from '@data/apisHeaderConfig'
import { BooleanPlus } from '@enums/BooleanPlus'

export default function () {
  const contributions = useAppStore((state) => state.contributions)
  const [loading, setLoading] = useState<boolean>(false)
  const [shopInfo, setShopInfo] = useState<ShopInfo>(null)
  const [disabled, setDisabled] = useState<boolean>(false)

  const getShopInfo = useCallback(() => {
    return new Promise<TShopInfo>((resolve, reject) => {
      const shopUuid = contributions?.find(
        (el) => el.partyCategory === PartyCategory.Shop
      )?.partyId

      if (shopUuid) {
        apis.shop
          .getInfo(shopUuid, resourceOwnerConfig)
          .then(({ data }: { data: TShopInfo }) => {
            setShopInfo(data)

            if (
              data?.approved === BooleanPlus.REQUESTED ||
              data?.approved === BooleanPlus.GRANTED
            ) {
              setDisabled(true)
            }

            resolve(data)
          })
          .catch((err: Error) => {
            reject(err)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })
  }, [contributions, setShopInfo])

  useEffect(() => {
    getShopInfo()
  }, [contributions])

  return loading ? (
    <KLoading />
  ) : (
    <section className="profile-tabs">
      <KTabs
        tabs={['اطلاعات پایه', 'اطلاعات تماس', 'اطلاعات پستی', 'اطلاعات حقوقی (اختیاری)']}
      >
        <BasicInfoTab shop={shopInfo} getShopInfo={getShopInfo} disabled={disabled} />
        <ContactInfoTab shop={shopInfo} getShopInfo={getShopInfo} disabled={disabled} />
        <PostalAddressTab shop={shopInfo} getShopInfo={getShopInfo} disabled={disabled} />
        <CorporateInfoTab shop={shopInfo} getShopInfo={getShopInfo} disabled={disabled} />
      </KTabs>
    </section>
  )
}

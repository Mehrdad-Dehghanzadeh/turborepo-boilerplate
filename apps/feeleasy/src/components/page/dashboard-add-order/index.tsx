'use client'
import AddOrder from './add-order'
import { ShopProvider } from '@context/ShopContext'

export default function () {
  return (
    <ShopProvider>
      <AddOrder />
    </ShopProvider>
  )
}

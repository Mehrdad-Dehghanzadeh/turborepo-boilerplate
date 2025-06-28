'use client'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  KButton,
  KIconButton,
  KSelect,
  KSelectGrouping,
  KTextField
} from '@components-kits'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import useValidations from '@hooks/useValidations'
import AddIcon from '@mui/icons-material/Add'
import { useEffect, useRef, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import apis from '@apis'
import { useShops } from '@context/ShopContext'
import { useRouter, useSearchParams } from 'next/navigation'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Chip, Paper } from '@mui/material'
import { useAppStore } from '@store'
import useSnackbar from '@hooks/useSnackbar'
import { Order, OrderDto, OrderItemListDto } from '@models/Orders'
import { PartyCategory } from '@enums/PartyCategory'
import { PartyType } from '@enums/PartyType'

export default function AddOrder() {
  const DefaultOrderItem = {
    categoryCode: '',
    productName: '',
    unitPrice: '',
    quantity: '',
    description: ''
  }

  const [orderItemList, setOrderItemList] = useState<OrderItemListDto>(DefaultOrderItem)

  const { required } = useValidations()
  let orderItemInfoRef = useRef<number>(-1)

  const [category, setCategory] = useState<any>([])
  const { shops } = useShops()

  const router = useRouter()
  const back = () => router.back()
  const user = useAppStore((state) => state.user)
  const { snackbar } = useSnackbar()

  const [serialDisabled, setSerialDisabled] = useState<boolean[]>([])
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false)

  const params = useSearchParams()
  const orderUuid = params.get('orderUuid')
  const [order, setOrder] = useState<Order | []>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const { handleSubmit, control, reset } = useForm<OrderDto>({
    defaultValues: {
      providerUuid: '',
      orderItemList: []
    }
  })

  const getCategories = () =>
    apis.productCategoryGroups.read().then(({ data }: any) => setCategory(data))

  const getOrder = () => {
    setLoadingBtn(true)

    apis.orders
      .getItem(orderUuid)
      .then(({ data }: { data: Order }) => {
        setOrder(data)
        setDefaultValues(data)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoadingBtn(false))
  }

  const onSubmit = (data: OrderDto) => {
    setLoadingBtn(true)

    const payload = {
      ...data,
      provider: {
        uuid: data.providerUuid,
        category: PartyCategory.Shop
      },
      customer: {
        uuid: user?.uuid,
        category: PartyType.INDIVIDUAL
      }
    }

    const apiCall = isEdit
      ? apis.orders.update(payload, orderUuid)
      : apis.orders.create(payload)

    const successMsg = isEdit ? 'سفارش با موفقیت بروزرسانی شد' : 'سفارش  با موفقیت ثبت شد'

    apiCall
      .then(({ data }: { data: Order }) => {
        snackbar('success', successMsg)
        router.push(`?orderUuid=${data?.uuid}`)
      })

      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoadingBtn(false))
  }

  const appendOrderItem = () => appendOrderItemInfo(DefaultOrderItem)

  const removeOrderItem = (index: number) => removeOrderItemInfo(index)

  const {
    fields: orderItemFields,
    append: appendOrderItemInfo,
    remove: removeOrderItemInfo
  } = useFieldArray({
    control,
    name: 'orderItemList'
  })

  const handleCategoryChange = (index: number, categoryCode: string) => {
    const isDisabled = categoryCode.split('.')[0] === 'VHCL'
    setSerialDisabled((prevState) => {
      const newState = [...prevState]
      newState[index] = isDisabled
      return newState
    })
  }

  const setDefaultValues = (data: Order) => {
    const serialDisabledState = data.orderItemList.map(
      (item: any) => item.category.code.split('.')[0] === 'VHCL'
    )

    setSerialDisabled(serialDisabledState)
    setIsEdit(true)

    reset({
      providerUuid: data.provider.uuid,
      orderItemList: data.orderItemList.map((item: any) => ({
        productName: item.productName || '',
        serialNumber: item.serialNumber || '',
        description: item.description || '',
        unitPrice: item.unitPrice || 0,
        quantity: item.quantity || 0,
        categoryCode: item.category.code || ''
      }))
    })
  }

  useEffect(() => {
    getCategories()
    appendOrderItem()
  }, [])

  useEffect(() => {
    if (orderUuid) {
      getOrder()
    }
  }, [orderUuid])

  return (
    <>
      <KButton
        startIcon={<ArrowForwardIcon />}
        color="info"
        size="large"
        sx={{ marginBottom: '16px' }}
        onClick={back}
      >
        بازگشت
      </KButton>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper component="section" sx={{ padding: '16px' }}>
          <KSelect
            name="providerUuid"
            titleKey="name"
            valueKey="uuid"
            label="عامل فروش"
            items={shops}
            control={control}
            rules={{ required: required() }}
          />

          <Divider sx={{ margin: '20px 0' }}>
            <Chip label="ثبت مشخصات کالا" size="small" color="info" />
          </Divider>

          {orderItemFields.map((item: any, index: number) => {
            orderItemInfoRef.current++

            return (
              <div key={`{order-item-info-${orderItemInfoRef.current}-index`}>
                <Grid spacing={2} container sx={{ marginTop: '12px' }}>
                  <Grid xs={12} md={4} sx={{ marginBottom: '16px' }} item>
                    <KSelectGrouping
                      items={category}
                      childernKey="categories"
                      titleKey="name"
                      childernTitle="name"
                      valueKey="code"
                      label="گروه کالایی"
                      sx={{ marginBottom: '12px' }}
                      name={`orderItemList[${index}].categoryCode`}
                      control={control}
                      rules={{ required: required() }}
                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                    />
                  </Grid>

                  <Grid xs={12} md={4} sx={{ marginBottom: '16px' }} item>
                    <KTextField
                      control={control}
                      label="نام کالا"
                      name={`orderItemList[${index}].productName`}
                      type="text"
                      rules={{ required: required() }}
                    />
                  </Grid>

                  <Grid xs={12} md={4} sx={{ marginBottom: '16px' }} item>
                    <KTextField
                      control={control}
                      label="تعداد"
                      name={`orderItemList[${index}].quantity`}
                      rules={{ required: required() }}
                      type="number"
                    />
                  </Grid>

                  <Grid xs={12} md={6} sx={{ marginBottom: '16px' }} item>
                    <KTextField
                      control={control}
                      label="قیمت"
                      name={`orderItemList[${index}].unitPrice`}
                      rules={{ required: required() }}
                      filterPrice
                    />
                  </Grid>

                  <Grid xs={12} md={6} sx={{ marginBottom: '16px' }} item>
                    <KTextField
                      control={control}
                      label="شماره سریال"
                      name={`orderItemList[${index}].serialNumber`}
                      disabled={serialDisabled[index]}
                    />
                  </Grid>

                  <Grid xs={12} md={12} item>
                    <KTextField
                      control={control}
                      label="توضیحات"
                      name={`orderItemList[${index}].description`}
                      multiline
                      minRows={5}
                    />
                  </Grid>

                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                    <KIconButton
                      variant="contained"
                      onClick={() => removeOrderItem(index)}
                      sx={{
                        margin: '10px 0px',
                        backgroundColor: 'var(--color-error-600)',
                        color: 'var(--color-white)',

                        '&:hover': {
                          color: 'var(--color-error-600)',
                          backgroundColor: 'var(--color-error-200)'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </KIconButton>
                  </Grid>
                </Grid>

                <Divider sx={{ margin: '20px 0' }} />
              </div>
            )
          })}

          <KButton
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={appendOrderItem}
          >
            اضافه کردن مورد
          </KButton>
        </Paper>

        <Box sx={{ padding: '10px 0' }}>
          <KButton
            variant="contained"
            color="primary"
            sx={{ margin: '10px 0', display: 'block', marginLeft: 'auto' }}
            type="submit"
            loading={loadingBtn}
          >
            ثبت نهایی
          </KButton>
        </Box>
      </form>
    </>
  )
}

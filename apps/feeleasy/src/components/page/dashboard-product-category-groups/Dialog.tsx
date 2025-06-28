'use client'
import { KButton, KIconButton, KTextField } from '@components-kits'
import { useState, useContext, useRef } from 'react'
import DomainAddIcon from '@mui/icons-material/DomainAdd'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import useValidations from '@hooks/useValidations'
import { useFieldArray, useForm } from 'react-hook-form'
import { ProductCategoryContext } from '@context/ProductCategoryContext'
import { ProductCategoryGroups } from '@models/ProductCategoryGroups'
import useSnackbar from '@hooks/useSnackbar'
import apis from '@apis'
import { deepClone } from '@utils/object'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'

export default function () {
  const initialCategory = { name: '', code: '' }

  const [open, setOpen] = useState<boolean>(false)
  const productCategoryContext = useContext(ProductCategoryContext)
  const { required } = useValidations()
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit, control, reset } = useForm<ProductCategoryGroups>({
    defaultValues: {
      code: '',
      name: '',
      categories: [initialCategory]
    }
  })

  const { snackbar } = useSnackbar()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories'
  })

  const onClose = () => {
    setOpen(false)
    reset()
    productCategoryContext.selectedProductCategory?.(null)
  }

  const addCategory = () => append(initialCategory)

  const removeCategory = (index: number) => remove(index)

  const createPayload = (dataForm: ProductCategoryGroups): ProductCategoryGroups => {
    const payload = deepClone(dataForm)
    payload.categories.forEach((el) => {
      el.code = `${payload.code}.${el.code}`
    })

    return payload
  }

  const onsubmit = async (dataForm: ProductCategoryGroups) => {
    const payload = createPayload(dataForm)
    try {
      setLoading(true)
      await apis.productCategoryGroups.create(payload)
      const { data } = await apis.productCategoryGroups.read()
      productCategoryContext?.setProductCategory?.(data)
      onClose()
    } catch (err: any) {
      snackbar('error', err?.message)
    } finally {
      setLoading(false)
    }
  }

  const categoriesGridKey = useRef<number>(-1)

  return (
    <div className="d-flex justify-content-end mb-10">
      <KButton
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<DomainAddIcon />}
      >
        افزودن مجموعه جدید
      </KButton>

      <Dialog open={open}>
        <form
          id="product-category-form"
          name="product-category-form"
          onSubmit={handleSubmit(onsubmit)}
        >
          <DialogContent sx={{ flex: '1 1 100%', width: '480px' }}>
            <KTextField
              sx={{ marginBottom: '24px' }}
              label="کد مجموعه"
              name="code"
              control={control}
              rules={{ required: required() }}
            />

            <KTextField
              sx={{ marginBottom: '24px' }}
              label="عنوان مجموعه"
              name="name"
              control={control}
              rules={{ required: required() }}
            />
            {fields?.map((el, index) => {
              categoriesGridKey.current++

              return (
                <Grid
                  key={`categories-grid-${categoriesGridKey.current}`}
                  spacing={1}
                  sx={{ marginBottom: '12px' }}
                  container
                >
                  <Grid xs={12} sm={6} item>
                    <KTextField
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                      label="نام گروه"
                      name={`categories[${index}].name`}
                      control={control}
                      rules={{ required: required() }}
                    />
                  </Grid>

                  <Grid xs={12} sm={6} item sx={{ display: 'flex', gap: '0 5px' }}>
                    <KTextField
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                      label="کد گروه"
                      name={`categories[${index}].code`}
                      control={control}
                      rules={{ required: required() }}
                    />
                    <KIconButton color="error" onClick={() => removeCategory(index)}>
                      <HighlightOffRoundedIcon />
                    </KIconButton>
                  </Grid>
                </Grid>
              )
            })}
          </DialogContent>
          <Divider />

          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <div>
              <KButton type="button" onClick={addCategory}>
                افزودن گروه دیگر
              </KButton>
            </div>

            <div>
              <KButton type="reset" color="error" onClick={onClose} disabled={loading}>
                بستن
              </KButton>

              <KButton type="submit" loading={loading}>
                ذخیره
              </KButton>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

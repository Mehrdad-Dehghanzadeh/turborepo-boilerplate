'use client'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { ProductCategoryContext } from '@/context/ProductCategoryContext'
import { useContext } from 'react'
import ProductCategoryItem from './ProductCategoryItem'

export default function () {
  const productCategoryContext = useContext(ProductCategoryContext)
  let companyKey = 1

  return (
    <>
      {productCategoryContext.loading ? (
        <Stack spacing={1}>
          <Skeleton variant="rounded" width={280} height={60} />
          <Skeleton variant="rounded" width={280} height={60} />
          <Skeleton variant="rounded" width={280} height={60} />
        </Stack>
      ) : (
        <Grid spacing={2} container>
          {productCategoryContext.productCategory.map((el) => {
            companyKey++

            return (
              <Grid
                xs={12}
                sm={6}
                md={4}
                sx={{ marginBottom: '12px' }}
                key={`company-${companyKey}`}
                item
              >
                <ProductCategoryItem productCategory={el} />
              </Grid>
            )
          })}
        </Grid>
      )}
    </>
  )
}

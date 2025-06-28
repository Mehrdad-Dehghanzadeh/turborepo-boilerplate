'use client'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { CompanyContext } from '@context/CompanyContext'
import { useContext } from 'react'
import CompanyItem from './CompanyItem'

export default function () {
  const companyContext = useContext(CompanyContext)
  let companyKey = 1

  return (
    <>
      {companyContext.loading ? (
        <Stack spacing={1}>
          <Skeleton variant="rounded" width={280} height={60} />
          <Skeleton variant="rounded" width={280} height={60} />
          <Skeleton variant="rounded" width={280} height={60} />
        </Stack>
      ) : (
        <Grid spacing={2} container>
          {companyContext.companies.map((el) => {
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
                <CompanyItem company={el} />
              </Grid>
            )
          })}
        </Grid>
      )}
    </>
  )
}

import { type Resource } from '@type/Apis'
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { DataGrid, type DataGridProps } from '@mui/x-data-grid'
import useSnackbar from '@hooks/useSnackbar'
import apis from '@apis'
import './KDataGridServer.scss'
import { KLoading } from '@components/kits/KLoading/KLoading'

interface Props extends DataGridProps {
  resource: Resource
  method?: string
  refresh?: (calback: () => void) => void
  params?: Record<string, any>
  configAxios?: Record<string, any>
  responseDataField?: string
}

export const KDataGridServer = forwardRef<any, Props>(function (
  {
    resource,
    refresh,
    method = 'read',
    responseDataField = '',
    configAxios = {},
    ...props
  },
  ref
) {
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const [rows, setRows] = useState<Record<string, any>[]>([])

  const createParams = () => {
    const params = { ...props.params }
    return params
  }

  const getData = () => {
    setLoading(true)
    const params = createParams()

    const apiCall = params.uuid
      ? apis[resource][method](params.uuid, configAxios)
      : apis[resource][method](params, configAxios)

    apiCall
      .then(({ data }: { data: any }) => {
        const tempData = responseDataField ? data?.[responseDataField] : data
        const tempValue = Array.isArray(tempData) ? tempData : []
        setRows(tempValue)
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  useImperativeHandle(ref, () => ({
    getData
  }))

  if (loading) return <KLoading />

  return rows.length > 0 ? (
    <div className="k-data-grid-server">
      <DataGrid rows={rows} loading={loading} {...props} disableColumnMenu />
    </div>
  ) : (
    <h4 className="empty-data-grid-server"></h4>
  )
})

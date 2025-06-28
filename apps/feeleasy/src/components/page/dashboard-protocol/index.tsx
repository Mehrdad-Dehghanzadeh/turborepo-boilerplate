'use client'
import { KButton } from '@components-kits'
import ArticleIcon from '@mui/icons-material/Article'
import Table from './Table'
import { useAppStore } from '@store'

export default function () {
  const isAdmin = useAppStore((state) => state.isAdmin)

  return (
    <>
      <div className="d-flex justify-content-end mb-10">
        {!isAdmin && (
          <KButton
            variant="outlined"
            href="/dashboard/protocol-add"
            startIcon={<ArticleIcon />}
          >
            پروتکل جدید
          </KButton>
        )}
      </div>
      <Table />
    </>
  )
}

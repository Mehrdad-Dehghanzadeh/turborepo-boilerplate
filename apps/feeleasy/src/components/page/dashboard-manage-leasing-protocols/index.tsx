'use client'
import { KButton } from '@components-kits'
import ArticleIcon from '@mui/icons-material/Article'
import Table from '@components-page/dashboard-protocol/Table'

export default function () {
  return (
    <>
      <div className="d-flex justify-content-end mb-10">
        <KButton
          variant="outlined"
          href="/dashboard/protocol-add"
          startIcon={<ArticleIcon />}
        >
          پروتکل جدید
        </KButton>
      </div>

      <Table />
    </>
  )
}

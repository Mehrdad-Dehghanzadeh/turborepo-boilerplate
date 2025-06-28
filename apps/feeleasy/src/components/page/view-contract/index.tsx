'use client'
import Contract, { ContractParties } from '@models/Contracts'
import { KButton, KFieldset, KLoading } from '@components/kits'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import generatePDF, { Margin, Options } from 'react-to-pdf'

export default function ViewContract() {
  const router = useRouter()
  const redirect = () => router.back()
  const [loading, setLoading] = useState<boolean>()
  const [markedUpTerm, setMarkedUpTerm] = useState<string>('')
  const [contractParties, setContractParties] = useState<ContractParties[]>([])
  const [contract, setContract] = useState<Contract | null>(null)
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false)
  const params = useSearchParams()
  const contractUuid = params.get('contractUuid')
  const { snackbar } = useSnackbar()
  const contractRef = useRef<HTMLAllCollection>(null)

  const options: Options = {
    filename: 'contract.pdf',
    method: 'save',

    page: {
      margin: Margin.LARGE,
      format: 'a4'
    },

    canvas: {
      qualityRatio: 1
    },

    overrides: {
      pdf: {
        unit: 'mm'
      }
    }
  }

  const readContract = () => {
    setLoading(true)

    apis.contract
      .read(contractUuid)
      .then(({ data }: any) => {
        setContract(data)
        setContractParties(data?.contractParties)
        setMarkedUpTerm(data?.markedUpTerm)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const downloadPdf = async () => {
    setDownloadLoading(true)

    const contractContent = contractRef

    if (contractContent.current) {
      await generatePDF(contractContent, options)
    }

    setDownloadLoading(false)
  }

  useEffect(() => {
    readContract()
  }, [])

  if (loading) return <KLoading />

  return (
    <>
      <KButton
        startIcon={<ArrowForwardIcon />}
        color="info"
        size="large"
        sx={{ marginBottom: '16px' }}
        onClick={redirect}
      >
        بازگشت
      </KButton>
      <Paper component="section" sx={{ paddingX: '16px', paddingY: '16px' }}>
        <KFieldset title="متن قرارداد ">
          <Box
            ref={contractRef}
            dangerouslySetInnerHTML={{ __html: markedUpTerm }}
            sx={{ paddingX: '30px', textAlign: 'justify' }}
            className="contract"
          />
        </KFieldset>

        <KButton
          variant="contained"
          color="info"
          size="small"
          onClick={downloadPdf}
          sx={{ height: '50px', margin: '10px 0' }}
          loading={downloadLoading}
        >
          دانلود نسخه ی پی دی اف قرارداد
        </KButton>
      </Paper>
    </>
  )
}

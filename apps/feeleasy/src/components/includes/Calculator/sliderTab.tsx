import { useRef } from 'react'
import { Button, Box, Typography } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { FrequencyList } from '@enums/Frequency'

type PropsType = {
  selectedItem: string
  setSelectedItem: (arg: string) => void
}

export default function SliderTab({
  selectedItem,
  setSelectedItem
}: Readonly<PropsType>) {
  const sliderRef = useRef<HTMLDivElement | any>(0)
  const isDragging = useRef(false)

  const scrollLeftBtn = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -100, behavior: 'smooth' })
    }
  }

  const scrollRightBtn = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 100, behavior: 'smooth' })
    }
  }

  const startDragging = () => (isDragging.current = true)

  const onDragging = (e: any) => {
    if (!isDragging.current || !sliderRef.current) return
    sliderRef.current.scrollLeft -= e.movementX
  }

  const stopDragging = () => (isDragging.current = false)

  return (
    <Box display="flex" sx={{ width: '100%', marginTop: '10px' }} alignItems="center">
      <Button onClick={scrollRightBtn}>
        <ChevronRight sx={{ color: 'var(--color-primary-200)' }} />
      </Button>

      <Box
        ref={sliderRef}
        sx={{
          display: 'flex',
          gap: '0 5px',
          overflowX: 'auto',
          scrollBehavior: 'auto',
          whiteSpace: 'nowrap',
          width: '100%',
          userSelect: 'none',
          cursor: 'grab',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
        onMouseDown={startDragging}
        onMouseMove={onDragging}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        {FrequencyList.map((item: any, index: number) => (
          <Box
            key={index}
            onClick={() => setSelectedItem(item.value)}
            sx={{
              cursor: 'pointer',
              borderRadius: '20px',
              padding: '0 10px',
              backgroundColor:
                selectedItem === item.value
                  ? 'var(--color-secondary-700)'
                  : 'transparent',
              color:
                selectedItem === item.value
                  ? 'var(--color-primary)'
                  : 'var(--color-primary-100)',
              fontWeight: selectedItem === item.value ? '600' : '400',
              fontSize: '15px',
              textAlign: 'center',
              transition: '0.3s',
              '&:hover': {
                backgroundColor:
                  selectedItem === item.value
                    ? 'var(--color-secondary-700)'
                    : 'var(--color-secondary-600)',
                color: 'var(--color-primary)'
              }
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ padding: '2px 10px', width: 'min-content', textAlign: 'center' }}
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>

      <Button onClick={scrollLeftBtn}>
        <ChevronLeft sx={{ color: 'var(--color-primary-200)' }} />
      </Button>
    </Box>
  )
}

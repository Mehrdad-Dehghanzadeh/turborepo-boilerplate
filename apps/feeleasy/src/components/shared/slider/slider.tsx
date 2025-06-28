import { useEffect, useState } from 'react'
import './slider.scss'
import { Box } from '@mui/material'

type PropsTypes = {
  data: any
}

export default function Slider({ data }: Readonly<PropsTypes>) {
  const [sliderData, setSliderData] = useState<any>(data)
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    const lastIndex = sliderData.length - 1
    if (index < 0) {
      setIndex(lastIndex)
    }
    if (index > lastIndex) {
      setIndex(0)
    }
  }, [index, sliderData])

  useEffect(() => {
    let slider = setInterval(() => {
      setIndex(index + 1)
    }, 3000)
    return () => clearInterval(slider)
  }, [index])

  return (
    <div className="slider-section">
      {sliderData.map((item: any, itemIndex: number) => {
        const { id, src, alt } = item
        let position = 'nextSlide'
        if (itemIndex === index) {
          position = 'activeSlide'
        }
        if (
          itemIndex === index - 1 ||
          (index === 0 && itemIndex === sliderData.length - 1)
        ) {
          position = 'lastSlide'
        }
        return (
          <div key={id} className={`slider-section-img ${position}`}>
            <img src={src} alt={alt} className="slider-img" />
          </div>
        )
      })}

      <Box className="slider-section-footer">
        <img src="/images/smart-phone.svg" />
      </Box>
    </div>
  )
}

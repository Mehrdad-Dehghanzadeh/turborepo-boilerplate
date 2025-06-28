import KSection from '@components/kits/KSection/KSection'
import './TutorialVideo.scss'

type PropsType = {
  src: string
  type: string
  tutorialTitle: string
}

export default function TutorialVideo({ src, type, tutorialTitle }: Readonly<PropsType>) {
  return (
    <KSection
      className="tutorial-video-section"
      sx={{
        backgroundColor: 'var(--color-gray-bg-2)'
      }}
    >
      <img src="/images/back-arrow.svg" className="tutorial-video-section_background" />
      <p className="section-title tutorial-video-section_title">{tutorialTitle}</p>

      <video controls>
        <source src={src} type={type} />
      </video>
    </KSection>
  )
}

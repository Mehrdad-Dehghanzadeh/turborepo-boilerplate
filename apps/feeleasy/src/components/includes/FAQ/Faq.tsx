import KSection from '@components/kits/KSection/KSection'
import KAccardion from '@components/kits/KAccardion/KAccardion'
import './Faq.scss'

type FAQItem = {
  id: string | number
  title: string
  content: string | string[]
}

type PropsType = {
  data: FAQItem[]
  sectionTitle: string
  sectionTitleClass?: string
}

export default function FAQ({
  data,
  sectionTitle,
  sectionTitleClass
}: Readonly<PropsType>) {
  return (
    <KSection className="faq-section" sx={{ backgroundColor: 'var(--color-gray-100)' }}>
      <p className={`section-title faq-section-title ${sectionTitleClass}`}>
        {sectionTitle}
      </p>

      {data.map(({ id, title, content }: any) => (
        <KAccardion key={id} accardionTitle={title} accardionContent={content} />
      ))}
    </KSection>
  )
}

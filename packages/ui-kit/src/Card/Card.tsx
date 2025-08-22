import { type FC } from 'react'
import type { TCardProps } from './TCard'
import './Card.scss'

const Card: FC<TCardProps> = ({ tagName = 'div', className, children, ...props }) => {
  const Tag = {
    div: (
      <div className={`k-card${className ? ' ' + className : ''}`} {...props}>
        {children}
      </div>
    ),

    section: (
      <section className={`k-card${className ? ' ' + className : ''}`} {...props}>
        {children}
      </section>
    ),

    article: (
      <article className={`k-card${className ? ' ' + className : ''}`} {...props}>
        {children}
      </article>
    )
  }

  return <>{Tag[tagName]}</>
}

export default Card

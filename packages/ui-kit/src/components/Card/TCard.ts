import React from 'react'

export type TCardProps = React.HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren<{
    tagName?: 'div' | 'section' | 'article'
  }>

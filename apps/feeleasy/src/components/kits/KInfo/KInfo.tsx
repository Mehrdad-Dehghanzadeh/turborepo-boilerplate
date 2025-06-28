import './KInfo.scss'

type Props = {
  title: string | number | React.ReactNode
  value: string | number | React.ReactNode
  className?: string
}

export function KInfo({ title, value, className = '', ...props }: Readonly<Props>) {
  return (
    <div className={`k-info ${className}`} {...props}>
      <strong className="k-info__title">{title}</strong>
      <div className="k-info__value">{value}</div>
    </div>
  )
}

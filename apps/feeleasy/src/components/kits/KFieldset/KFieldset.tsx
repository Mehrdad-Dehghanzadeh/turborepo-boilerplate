import './KFieldset.scss'

type Props = {
  className?: string
  title: string | React.ReactNode
  children: React.ReactNode
  [key: string]: any
}

export function KFieldset({
  title,
  className = '',
  children,
  ...props
}: Readonly<Props>) {
  return (
    <fieldset className={`k-fieldset ${className}`} {...props}>
      <legend className="k-fieldset__title">{title}</legend>

      <div className="k-fieldset__content">{children}</div>
    </fieldset>
  )
}

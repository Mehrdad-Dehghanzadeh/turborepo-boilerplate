type PropsType = {
  action: string
  token: string
  paymentFormRef: React.RefObject<HTMLFormElement>
}

export default function Payment({ action, token, paymentFormRef }: Readonly<PropsType>) {
  return (
    <form action={action} method="post" ref={paymentFormRef}>
      <input type="hidden" name="token" value={token} />
      <input name="GetMethod" type="hidden" value="" />
    </form>
  )
}

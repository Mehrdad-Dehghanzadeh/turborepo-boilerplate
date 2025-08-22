'use client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextField } from '@repo/ui-kit/TextField'
interface IFormInput {
  firstName: string
}
export default function () {
  const { control, handleSubmit } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)

  return (
    <form
      style={{ width: '50vw', height: '100vh', margin: '45px auto' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField control={control} name="firstName" rules={{ required: true }} />

      <button type="submit">submit</button>
    </form>
  )
}

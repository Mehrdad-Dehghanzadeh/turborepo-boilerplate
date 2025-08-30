'use client'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextField } from '@repo/ui-kit/TextField'
import { requiredRule } from '@repo/utils/validationsRules'
interface IFormInput {
  firstName: string
}
export const H1: React.FC = () => {
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      firstName: ''
    }
  })

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)

  return (
    <div>
      <form
        style={{ width: '50vw', height: '100vh', margin: '45px auto' }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          control={control}
          name="firstName"
          rules={{ required: requiredRule() }}
        />

        <button type="submit">submit</button>
      </form>
    </div>
  )
}

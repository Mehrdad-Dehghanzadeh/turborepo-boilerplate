'use client'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextField } from '@repo/ui-kit/TextField'
import { Modal } from '@repo/ui-kit/Modal'
import { requiredRule } from '@repo/utils/validationsRules'
interface IFormInput {
  firstName: string
}
export const H1: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
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

      <button
        onClick={() => {
          setOpen(true)
        }}
      >
        sss
      </button>

      <Modal open={open} setOpen={setOpen}>
        <section id="sections"></section>
      </Modal>
    </div>
  )
}

import { useId, useMemo } from 'react'

export type TParamets = {
  id: string | undefined
}

export default function ({ id }: TParamets) {
  const _id = useId()

  const selfId = useMemo<string>(() => `${_id}-${id}`, [id])

  return {
    selfId
  }
}

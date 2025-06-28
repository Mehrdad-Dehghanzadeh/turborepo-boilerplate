import type { EnumType, EnumList } from '@type/Enums'
import * as enums from '@enums/index'
type EnumProvider = EnumType | undefined
type Enums = Record<string, any>
const enumsList: Record<string, EnumList> = {}
// const enums: Enums = {}

export function enumsProvider(
  type: string,
  value: string | number | boolean,
  prop: string = 'value'
): EnumProvider {
  const tempValue = <any>enums[type as keyof typeof enums]
  const item = tempValue?.find?.((i: EnumType) => i[prop as keyof typeof i] === value)

  return item
}

export function getEnumList(type: keyof typeof enumsList): EnumType[] {
  return enumsList[type]
}

// export function getEnum(type: keyof Enums): Pick<Enums, keyof Enums> | undefined {
//   return enums?.[type]
// }

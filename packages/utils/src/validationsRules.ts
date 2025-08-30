import { $t } from '@repo/locales'
import { isCardNumber } from './validations/cardNumber'
import { isPersainDate } from './validations/date'
import { isEmail } from './validations/email'
import { isIban } from './validations/iban'
import {
  isRealNationalCode,
  isLegalNationalCode,
  isNationalCode
} from './validations/nationalCode'
import { checkMobile, checkPhone } from './validations/phone'

export function cardNumberRule(val: string | null): boolean | string {
  return !val || isCardNumber(val) || <string>$t('validations.cardNumber')
}

export function persianDateRule(val: string | null): boolean | string {
  return !val || isPersainDate(val) || <string>$t('validations.persainDate')
}

export function emailRule(val: string | null): string | boolean {
  return !val || isEmail(val) || <string>$t('validations.email')
}

export function ibanRule(val: string | null): string | boolean {
  return !val || isIban(val) || <string>$t('validations.iban')
}

export function realNationalCodeRule(val: string | null): string | boolean {
  return !val || isRealNationalCode(val) || <string>$t('validations.realNationalCode')
}

export function legalNationalCodeRule(val: string | null): boolean | string {
  return !val || isLegalNationalCode(val) || <string>$t('validations.legalNationalCode')
}

export function nationalCodeRule(val: string | null): boolean | string {
  return !val || isNationalCode(val) || <string>$t('validations.nationalCode')
}

export function phoneRule(val: string | null): boolean | string {
  return !val || checkPhone(val) || <string>$t('validations.phone')
}

export function mobileRule(val: string | null): boolean | string {
  return !val || checkMobile(val) || <string>$t('validations.mobile')
}

export function emailOrMobileRule(val: string | null): boolean | string {
  return (
    !val || isEmail(val) || checkMobile(val) || <string>$t('validations.emailOrMobile')
  )
}

export function equalRule(equalValue: string | number | null, name: string) {
  return (val: string | number | null): boolean | string =>
    !val || equalValue == val || <string>$t('validations.equal', { name })
}

export function maxLengthRule(value: number) {
  return {
    value,
    message: <string>$t('validations.max_length', { max_value: value })
  }
}

export function minLengthRule(value: number) {
  return { value, message: <string>$t('validations.min_length', { min_length: value }) }
}

export function patternRule(value: RegExp) {
  return { value, message: <string>$t('validations.pattern') }
}

export function requiredRule(value = true) {
  return { value, message: <string>$t('validations.required') }
}

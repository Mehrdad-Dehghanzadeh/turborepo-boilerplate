export function checkStrongPassword(value: any) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/g.test(
    value
  )
}

import { RootState, useRootSelector } from 'store'

export const useRegister = () => {
  const register = useRootSelector(({ register }: RootState) => register)
  return register
}

export const useRegisterSelector = <T>(selector: (register: SenReg) => T) => {
  const data = useRootSelector(({ register }: RootState) => selector(register))
  return data
}

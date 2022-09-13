import { RootState, useRootSelector } from 'store'

export const useRegister = () => {
  const register = useRootSelector((state: RootState) => state.register)
  return register
}

export const useRegisterSelector = <T>(selector: (register: SenReg) => T) => {
  const data = useRootSelector((state: RootState) => selector(state.register))
  return data
}

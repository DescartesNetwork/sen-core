import { RootState, useRootSelector } from 'store'

export const useRegister = () => {
  const register = useRootSelector((state: RootState) => state.page.register)
  return register
}

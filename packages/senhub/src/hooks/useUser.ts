import { RootState, useRootSelector } from 'store'

export const useUser = () => {
  const user = useRootSelector((state: RootState) => state.user)
  return user
}

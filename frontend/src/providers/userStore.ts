import { create } from 'zustand'

const useUser = create((set) => ({
    users: {},
    setUser: (user) => set((state) => ({ users: user })),
    removeUser: () => set({ users: {} }),
  }))
export default useUser
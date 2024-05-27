import { create } from 'zustand'

const useProjects = create((set) => ({
    projects: [],
    addProject: (project) => set((state) => {
          return { products: [ ...state.projects , {...project}] }
      }),
    removeProject : (project) => set((state) => {
        const isProductExist = state.projects.find((p) => p._id === project._id)
        if (isProductExist) {
          return { products: state.projects.filter((p) => p._id !== project._id) }
        }else{
          return { products: state.projects }
        }
      }),
    removeProducts: () => set({ projects: [] }),
  }))
export default useProjects
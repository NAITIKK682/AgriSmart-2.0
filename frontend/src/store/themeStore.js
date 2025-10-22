import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      language: 'en',
      
      toggleTheme: () => {
        set((state) => {
          const newMode = !state.isDarkMode
          if (newMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { isDarkMode: newMode }
        })
      },
      
      setLanguage: (lang) => {
        set({ language: lang })
      },
      
      initTheme: () => {
        set((state) => {
          if (state.isDarkMode) {
            document.documentElement.classList.add('dark')
          }
          return state
        })
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)
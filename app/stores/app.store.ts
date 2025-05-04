export const useAppStore = defineStore('app', {
  state: () => ({
    isDrawerOpen: false,
  }),
  actions: {
    toggleDrawer(value: boolean) {
      this.isDrawerOpen = value
    },
  },
})

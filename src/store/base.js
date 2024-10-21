import { defineStore } from 'pinia'

export const useBase = defineStore("base", {
    state: () => ({
        loading: false,
    }),
    // getters: {
    //     getUserRole: (state) => state.me?.role?.name,
    //     isVerified: (state) => state.me?.status === 'verified'
    // },
    actions: {
        updateLoading() {
            this.loading = !this.loading
        },
    }
})
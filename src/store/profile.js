import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"
// import router from "@/router/index"

export const useProfile = defineStore("profile", {
    state: () => ({
        // me: null,
    }),
    // getters: {
    //     getUserRole: (state) => state.me?.role?.name,
    //     isVerified: (state) => state.me?.status === 'verified'
    // },
    actions: {
        save({ first_name, last_name }) {
            return useRequest('profile', {
                method: 'POST',
                body: { first_name, last_name }
            })
        },
        updatePassword({ current_password, password, password_confirmation }) {
            return useRequest('profile/password', {
                method: 'POST',
                body: { current_password, password, password_confirmation }
            })
        },
        updateAvatar(formData) {
            console.log('avatar', formData)
            return useRequest('profile/avatar', {
                method: 'POST',
                formData
            })
        },
        removeAvatar() {
            return useRequest('profile/avatar', {
                method: 'DELETE',
            })
        }
    },
});

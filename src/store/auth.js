import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"
// import router from "@/router/index"

export const useAuth = defineStore("auth", {
    state: () => ({
        me: null,
    }),
    // getters: {
    //     getUserRole: (state) => state.me?.role?.name,
    //     isVerified: (state) => state.me?.status === 'verified'
    // },
    actions: {
        login({ email, password }) {
            return useRequest('auth/login', {
                method: 'POST',
                body: { email, password }
            })
        },
        logOut() {
            this.me = null
            localStorage.removeItem('token')
        },
        signUp(body) {
            return useRequest('auth/sign-up', {
                method: 'POST',
                body
            })
        },
        resendLink({ email }) {
            return useRequest('auth/resend-verification', {
                method: 'POST',
                body: {
                    email
                }
            })
        },
        resetPassword({ email }) {
            return useRequest('auth/reset-password', {
                method: 'POST',
                body: { email }
            })
        },
        updatePassword(body) {
            return useRequest('auth/update-password', {
                method: 'POST', // PUT
                body
            })
        },
        getMe() {
            return useRequest('auth/me')
                .then((response) => {
                    console.log('get me', response)
                    this.me = response
                    return response
                })
        }
    },
});

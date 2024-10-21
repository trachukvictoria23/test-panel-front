import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"

export const useUsers = defineStore("users", {
    state: () => ({
        users: null,
    }),
    actions: {
        getUsers({ per_page, page, search, status, sort_field, sort_direction }) {
            let query = `page=${page}&per_page=${per_page}&sort_field=${sort_field}&sort_direction=${sort_direction}`
            if (search) query += '&search=' + search
            if (status !== undefined) query += '&is_verified=' + status

            return useRequest(`users?${query}`)
        },
        getUser(id) {
            return useRequest(`users/${id}`)
        },
    }
})
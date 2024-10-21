import { defineStore } from 'pinia'
import { useRequest } from "@/composables/useFetch"

export const useChats = defineStore("chats", {
    state: () => ({
        chat: null,
    }),
    actions: {
        initChat({ to_id }) {
            return useRequest('chats/init', {
                method: 'POST',
                body: { to_id }
            })
        },
        getChats() { // { per_page, page, search, sort_field, sort_direction }
            // let query = `page=${page}&per_page=${per_page}`
            // if (search) query += '&search=' + search

            // return useRequest(`chats?${query}`)
            return useRequest(`chats`)
        },
        getChat(id) {
            return useRequest(`chats/${id}`).then((data) => {
                this.chat = data;
                return data;
            });
        },
        getMessages({ per_page, page }) {
            let query = `page=${page}&per_page=${per_page}`
            // if (search) query += '&search=' + search

            return useRequest(`chats/${this.chat._id}/messages?${query}`)
        },
        sendMessage({ message, file }) {
            // console.log('store sendMessage', message, file)
            const params = {
                method: 'POST',
            }

            if (file) {
                const formData = new FormData();
                formData.append("file", file); // file.fileName for HEIC formatter
                params.formData = formData
            } else {
                // formData.append("message", message);    
                params.body = {
                    message
                }
            }

            return useRequest(`chats/${this.chat._id}/messages`, params)
        }
    }
})
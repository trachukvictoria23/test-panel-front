
import { createFetch } from '@vueuse/core'
import { useToast } from "@/main"
import router from "@/router/index.js";
import { useAuth } from '@/store/auth'

export const useMyFetch = createFetch({
  // baseUrl: process.env.BASE_URL + '/api',
  baseUrl: 'http://localhost:3001' + '/api', // for tests
  options: {
    async beforeFetch({ options }) {
      const token = localStorage.getItem('token') || ''
      if (token) options.headers.Authorization = `Bearer ${token}`
      // options.headers['Content-Type'] = 'application/json'
      // options.headers['Sec-Fetch-Dest'] = 'document'
      // options.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
      // options.headers['Content-Type'] = 'multipart/form-data; boundary=----WebKitFormBoundaryqfkaCIzcfcenB0jq'
      return { options }
    },
    onFetchError(ctx) {
      console.log('onFetchError', ctx, ctx.data)
      ctx.error = {
        message: ctx.data ? ctx.data : 'Server error',
        status: ctx.response?.status
      }
      return ctx
    }
  },
  fetchOptions: {
    mode: 'cors'
  },
})

export const useRequest = async (url, options = { method: 'GET' }) => {
  const { method, body, formData } = options
  const { data, error } = await useMyFetch(url,
    {
      method,
      body: body ? JSON.stringify(body) : formData,
      headers: body ? {
        'Content-Type': 'application/json'
      } : {}
    }
  )
  if (error.value) {
    setError(error.value)
  } else {
    return JSON.parse(data.value)
  }
}

const setError = ({ message, status }) => {
  if (status === 401) {
    const authStore = useAuth()
    authStore.logOut()
    router.push({ name: 'login' })
  }

  setTimeout(() => {
    useToast(status === 404 ? 'Not found' : message, "error")
  }, 250)
  throw new Error(message)
}
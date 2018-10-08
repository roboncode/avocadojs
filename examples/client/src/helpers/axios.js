import axios from 'axios'

const ax = axios.create({
  baseURL: process.env.VUE_APP_SERVICE_URL,
})

const accessToken = localStorage.getItem('app:token')
ax.defaults.headers.common = { Authorization: 'Bearer ' + accessToken }

export default ax
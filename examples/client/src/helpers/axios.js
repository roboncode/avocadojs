import axios from 'axios'

const ax = axios.create({
  baseURL: process.env.VUE_APP_SERVICE_URL
})

// response parse
// ax.interceptors.response.use(
//   response => {
//     return response
//   },
//   error => {
//     debugger
//     console.warn('Error status', error.response)
//     return Promise.reject(error)
//   }
// )

// ax.interceptors.response.use(null, function(error) {
//   debugger
//   console.log('@@@@@@@ Error status', error)
//   return Promise.reject(error)
// })

const accessToken = localStorage.getItem('app:token')
if (accessToken) {
  ax.defaults.headers.common = { Authorization: 'Bearer ' + accessToken }
}

export default ax

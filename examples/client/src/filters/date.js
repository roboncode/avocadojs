import '@/helpers/date'

export default {
  install(Vue) {
    Vue.filter('date', function (value, pattern) {
      if (!value) return ''
      value = value.toString()
      return new Date(value).format(pattern)
    })
  }
}
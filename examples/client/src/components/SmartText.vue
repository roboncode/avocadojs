<template>
  <div>
    <v-runtime-template class="smarttext" :template="template"></v-runtime-template>
  </div>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template'

export default {
  components: {
    VRuntimeTemplate
  },
  props: {
    text: ''
  },
  computed: {
    template() {
      let txt = this.text || ''
      if (txt) {
        txt = txt.replace(/@\w+/gi, function(handle) {
          handle = handle.split('@').join('')
          return `<router-link :to="{ name: 'tweets', params: { handle: '${handle}' }}">@${handle}</router-link>`
        })
        txt = txt.replace(/#\w+/gi, function(hashtag) {
          hashtag = hashtag.split('#').join('')
          return `<router-link :to="{ name: 'hashtag', params: { hashtag: '${hashtag}' }}">#${hashtag}</router-link>`
        })
      }
      return `<div>${txt}</div>`
    }
  }
}
</script>

<style lang="stylus">
.smarttext
  .screenname
    color #1994e0
    font-size 15px

  .screenname:hover
    text-decoration underline
</style>


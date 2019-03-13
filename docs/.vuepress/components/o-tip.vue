<template>
  <div class="tipster">
    <div class="prefix" :class="type">{{prefix}}</div>
    <div class="text">
      <p>
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.tipster
  display flex
  margin 10px 0
  font-size 14px

.prefix
  display flex
  align-items center
  justify-content center
  color white
  padding 8px 20px
  border-top-left-radius 4px
  border-bottom-left-radius 4px
  font-weight bold
  font-size 14px

.text
  flex 1
  display flex
  flex-wrap wrap
  align-items center
  padding 0 12px
  border-top-right-radius 4px
  border-bottom-right-radius 4px
  background rgba(0, 0, 0, 0.05)

  p
    line-height 16px


.tip
  background #03A6ED

.note
  background #f37220  

.thumbs_down
  font-size 18px
  padding 0 12px
  background #D32F2F

.thumbs_up
  font-size 18px
  padding 0 12px
  background #02a6ed

.code
  font-family 'Courier New', Courier, monospace
  font-size 24px
  font-weight bold
  color white
  padding 0 10px
  background black
</style>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'tip'
    }
  },
  computed: {
    prefix() {
      if(this.type === 'code') {
        return '{}'
      } else if(this.type === 'thumbs_down') {
        return '👎'
      } else if(this.type === 'thumbs_up') {
        return "👍"
      }
      return this.type[0].toUpperCase() + this.type.substr(1)
    }
  }
}
</script>



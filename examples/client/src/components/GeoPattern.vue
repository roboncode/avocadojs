<template>
  <div ref="pattern" class="geo-pattern"></div>
</template>

<script>
import GeoPattern from 'geopattern'

export default {
  props: ['value'],
  // computed: {
  //   pattern() {
  //     const pattern = GeoPattern.generate(this.value)
  //     return pattern.toDataUri()
  //   }
  // },
  mounted() {
    const pattern = GeoPattern.generate(this.value)
    this.$refs.pattern.style.backgroundImage = pattern.toDataUrl()
  }
}
</script>

<style lang="stylus" scoped>
.geo-pattern
  display block
  position relative
  height 100%
  width 100%
  background-repeat repeat
</style>


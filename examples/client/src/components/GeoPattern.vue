<template>
  <div class="geopattern">
    <v-img :src="pattern" aspect-ratio="3.75"></v-img>
  </div>
</template>

<script>
import GeoPattern from 'geopattern'

export default {
  props: ['value'],
  computed: {
    pattern() {
      const pattern = GeoPattern.generate(this.value)
      return pattern.toDataUri()
    }
  }
}
</script>

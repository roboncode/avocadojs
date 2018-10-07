<template>
  <div class="home">
    <h1>This is the home page</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Menu from '@/components/Menu.vue'

export default {
  name: 'home',
  components: {
    HelloWorld,
    "AppNav": Menu
  }
}
</script>

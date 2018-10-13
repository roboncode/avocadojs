<template>
  <div class="avatar" v-if="user">
    <v-avatar :size="size">
      <img v-if="user.avatar" :src="user.avatar" :alt="user.firstName">
      <span v-else class="white--text headline">{{initial}}</span>
    </v-avatar>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      default: 36
    },
    user: {
      type: Object,
      default: function() {
        return {
          avatar: '',
          firstName: ''
        }
      }
    }
  },
  computed: {
    initial() {
      return this.user.firstName.substr(0, 1)
    },
    color() {
      return this.user.avatar ? 'transparent' : 'primary'
    }
  }
}
</script>

<style lang="stylus" scoped>
.avatar
  background-color: #1976d2
  border 3px solid white
  border-radius 50% !important
</style>



<template>
  <div class="profile">
    <profile-banner></profile-banner>
    <router-view />
  </div>
</template>

<script>
  import ProfileBanner from "@/components/ProfileBanner"

  export default {
    components: {
      ProfileBanner
    }
  }
</script>

<style lang="stylus" scoped>

</style>
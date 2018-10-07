<template>
  <div id="app">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <admin-menu></admin-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AdminMenu from '@/components/Menu.vue'

export default {
  name: 'app',
  components: {
    AdminMenu
  }
}
</script>

<style lang="stylus">
body
  margin 0
  padding 0

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50

.el-main
  background-color #E9EEF3
  color #333
  line-height 160px

// body > .el-container
//   margin-bottom 40px

// .el-container:nth-child(5) .el-aside, .el-container:nth-child(6) .el-aside
//   line-height 260px

// .el-container:nth-child(7) .el-aside
//   line-height 320px
</style>

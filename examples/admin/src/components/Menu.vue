<template>
  <div>
    <el-menu default-active="2" class="el-menu-vertical-demo">
      <el-menu-item index="2">
        <i class="material-icons">account_circle</i>
        <span>Users</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span>Navigator Three</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span>Navigator Four</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="stylus" scoped>
.el-menu-item .material-icons
  margin-right 5px
</style>


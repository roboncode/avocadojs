<template>
  <div class="not-found bg-purple">
    <!-- https://codepen.io/salehriaz/pen/erJrZM -->
    <div class="stars">
      <div class="central-body">
        <img class="image-404" src="http://salehriaz.com/404Page/img/404.svg" width="300px">
      </div>
      <div class="objects">
        <img class="object_rocket" src="http://salehriaz.com/404Page/img/rocket.svg" width="40px">
        <div class="earth-moon">
          <img class="object_earth" src="http://salehriaz.com/404Page/img/earth.svg" width="100px">
          <img class="object_moon" src="http://salehriaz.com/404Page/img/moon.svg" width="80px">
        </div>
        <!-- <div class="box_astronaut">
          <img class="object_astronaut" src="http://salehriaz.com/404Page/img/astronaut.svg" width="140px">
        </div> -->
      </div>
      <div class="glowing_stars">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
// @import url('https://fonts.googleapis.com/css?family=Dosis:300,400,500')
@keyframes rocket-movement
  100%
    -moz-transform translate(1200px, -600px)

@keyframes rocket-movement
  100%
    -webkit-transform translate(1200px, -600px)

@keyframes rocket-movement
  100%
    transform translate(1200px, -600px)

@keyframes spin-earth
  100%
    -moz-transform rotate(-360deg)
    transition transform 20s

@keyframes spin-earth
  100%
    -webkit-transform rotate(-360deg)
    transition transform 20s

@keyframes spin-earth
  100%
    -webkit-transform rotate(-360deg)
    transform rotate(-360deg)
    transition transform 20s

@keyframes move-astronaut
  100%
    -moz-transform translate(-160px, -160px)

@keyframes move-astronaut
  100%
    -webkit-transform translate(-160px, -160px)

@keyframes move-astronaut
  100%
    -webkit-transform translate(-160px, -160px)
    transform translate(-160px, -160px)

@keyframes rotate-astronaut
  100%
    -moz-transform rotate(-720deg)

@keyframes rotate-astronaut
  100%
    -webkit-transform rotate(-720deg)

@keyframes rotate-astronaut
  100%
    -webkit-transform rotate(-720deg)
    transform rotate(-720deg)

@keyframes glow-star
  40%
    -moz-opacity 0.3

  90%, 100%
    -moz-opacity 1
    -moz-transform scale(1.2)

@keyframes glow-star
  40%
    -webkit-opacity 0.3

  90%, 100%
    -webkit-opacity 1
    -webkit-transform scale(1.2)

@keyframes glow-star
  40%
    -webkit-opacity 0.3
    opacity 0.3

  90%, 100%
    -webkit-opacity 1
    opacity 1
    -webkit-transform scale(1.2)
    transform scale(1.2)
    border-radius 999999px

.spin-earth-on-hover
  transition ease 200s !important
  transform rotate(-3600deg) !important

.not-found
  position fixed
  height 100%
  width 100%
  overflow hidden

.bg-purple
  background url('http://salehriaz.com/404Page/img/bg_purple.png') // salehriaz.com/404Page/img/bg_purple.png);
  background-repeat repeat-x
  background-size cover
  background-position left top
  height 100%
  overflow hidden

.central-body
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  text-align center

.objects img
  z-index 90
  pointer-events none

.object_rocket
  z-index 95
  position absolute
  transform translateX(-50px)
  top 75%
  pointer-events none
  animation rocket-movement 200s linear infinite both running

.object_earth
  position absolute
  top 20%
  left 15%
  z-index 90
  /* animation: spin-earth 100s infinite linear both; */

.object_moon
  position absolute
  top 12%
  left 25%
  /*
      transform: rotate(0deg);
      transition: transform ease-in 99999999999s;
  */

.object_astronaut
  animation rotate-astronaut 200s infinite linear both alternate

.box_astronaut
  z-index 110 !important
  position absolute
  top 60%
  right 20%
  will-change transform
  animation move-astronaut 50s infinite linear both alternate

.image-404
  position relative
  z-index 100
  pointer-events none

.stars
  background url('http://salehriaz.com/404Page/img/overlay_stars.svg') // salehriaz.com/404Page/img/overlay_stars.svg);
  background-repeat repeat
  background-size contain
  background-position left top

.glowing_stars .star
  position absolute
  border-radius 100%
  background-color #fff
  width 3px
  height 3px
  opacity 0.3
  will-change opacity

.glowing_stars .star:nth-child(1)
  top 80%
  left 25%
  animation glow-star 2s infinite ease-in-out alternate 1s

.glowing_stars .star:nth-child(2)
  top 20%
  left 40%
  animation glow-star 2s infinite ease-in-out alternate 3s

.glowing_stars .star:nth-child(3)
  top 25%
  left 25%
  animation glow-star 2s infinite ease-in-out alternate 5s

.glowing_stars .star:nth-child(4)
  top 75%
  left 80%
  animation glow-star 2s infinite ease-in-out alternate 7s

.glowing_stars .star:nth-child(5)
  top 90%
  left 50%
  animation glow-star 2s infinite ease-in-out alternate 9s

@media only screen and (max-width: 600px)
  .box_astronaut
    top 70%

  .central-body
    padding-top 25%
</style>

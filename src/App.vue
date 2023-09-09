<!-- 根组件 -->
<template>
  <div id="app">
    <navigation></navigation>
    <router-view />
    <rightSide></rightSide>
    <music-audio ref="music"></music-audio>
  </div>
</template>

<script>
import navigation from './components/global/navigation.vue'
import rightSide from './components/global/rightSide.vue'
import MusicAudio from './components/music/musicAudio.vue'

export default {
  components: {
    navigation,
    rightSide,
    MusicAudio
  }
}
</script>

<style>

</style>

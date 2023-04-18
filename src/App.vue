<!-- 根组件 -->
<template>
  <div id="app">
    <navigation></navigation>
    <router-view />
    <rightSide></rightSide>
  </div>
</template>

<script>
import navigation from './components/global/navigation.vue'
import rightSide from './components/global/rightSide.vue'

export default {
  components: {
    navigation,
    rightSide
  }
}
</script>

<style>

</style>

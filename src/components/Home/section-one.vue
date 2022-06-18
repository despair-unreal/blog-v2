<!-- 公共组件 -->
<template>
  <div id="section-one">
    <div id="sentence">
      <p id="sentence-Chinese">
        我曾说过这样的话，它或许恰如其分：先前的文明都会变成一堆废墟，最后化为灰烬，但精神将在灰烬的上空恒久地徘徊。
      </p>
      <p id="sentence-German">
        "Ich habe einmal，und vielleicht mit Recht，gesagt : Aus der früheren
        Kultur wird ein Trümmerhaufen und am Schluß ein Aschenhaufen
        werden，aber es werden Geister über der Asche schweben."
      </p>
      <div id="author">
        <p id="author-Chinese">维特根斯坦</p>
        <p id="author-German">Ludwig Josef Johann Wittgenstein</p>
      </div>
    </div>
    <div id="scroll">
      <span id="scroll_line"></span>
      <span>滑动滚轮</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<style scoped>

</style>

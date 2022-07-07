<!-- 公共组件 -->
<template>
  <div id="section-one">
    <div id="sentence">
      <div id="sentence-Chinese">
        <p>
          我曾说过这样的话，它或许恰如其分：先前的文明都会变成一堆废墟，最后化为灰烬，但精神将在灰烬的上空恒久地徘徊。
        </p>
        <span v-for="(item, index) in sentenceChinese" :key="index">{{
          item
        }}</span>
      </div>
      <p id="sentence-German">
        "Ich habe einmal，und vielleicht mit Recht，gesagt : Aus der früheren
        Kultur wird ein Trümmerhaufen und am Schluß ein Aschenhaufen
        werden，aber es werden Geister über der Asche schweben."
      </p>
      <div id="author">
        <div id="author-Chinese">
          <p>维特根斯坦</p>
          <span></span>
          <span v-for="(item, index) in authorChinese" :key="index">{{
            item
          }}</span>
        </div>
        <p id="author-German">Ludwig Josef Johann Wittgenstein</p>
      </div>
    </div>
    <div id="scroll">
        <span id="scroll-line"></span>
        <span>滑动滚轮</span>
      </div>
  </div>
</template>
<script>
export default {
  name: "sectionOne",
  data() {
    return {
      sentenceChinese: [],
      authorChinese: [],
    };
  },
  props: {},
  methods: {
    //分割句子，将句子逐字拆解
    splitSentence: function (obj) {
      let sentence = obj.querySelector("p");
      let sentenceArr = sentence.innerText.replaceAll(" ", "").split("");
      sentence.remove();
      return sentenceArr;
    }
  },
  mounted: function () {
    this.sentenceChinese = this.splitSentence(
      document.querySelector("#sentence-Chinese")
    );
    this.authorChinese = this.splitSentence(
      document.querySelector("#author-Chinese")
    );
  },
};
</script>

<style scoped>
@import "~@/assets/css/Home/section-one.css";
</style>

<!-- 第一屏 -->
<template>
  <div id="section-one">
    <div id="sentence">
      <div id="sentence-Chinese">
        <p>
          我曾说过这样的话，它或许恰如其分：先前的文明都会变成一堆废墟，最后化为灰烬，但精神将在灰烬的上空恒久地徘徊。
        </p>
        <transition-group
          @before-enter="sentenceChineseBeforeEnter"
          @enter="sentenceChineseEnter"
          @after-enter="sentenceChineseAfterEnter"
        >
          <span
            v-for="(item, key, index) in sentenceChinese"
            :key="key"
            :data-index="index"
            >{{ item }}</span
          >
        </transition-group>
      </div>
      <p
        id="sentence-German"
        :style="sentenceGermanShowStyle"
        @transitionend="sentenceGermanAfterEnter"
      >
        "Ich habe einmal，und vielleicht mit Recht，gesagt : Aus der früheren
        Kultur wird ein Trümmerhaufen und am Schluß ein Aschenhaufen
        werden，aber es werden Geister über der Asche schweben."
      </p>
      <div id="author">
        <div
          id="author-Chinese"
          :style="authorChineseShowStyle"
          @transitionend="authorChineseAfterEnter"
        >
          <p>维特根斯坦</p>
          <span></span>
          <span v-for="(item, index) in authorChinese" :key="index">{{
            item
          }}</span>
        </div>
        <p id="author-German" :style="authorGermanShowStyle">
          Ludwig Josef Johann Wittgenstein
        </p>
      </div>
    </div>
    <div id="scroll" :style="scrollShowStyle" @transitionend="scrollAfterEnter">
      <span id="scroll-line"></span>
      <span>滑动滚轮</span>
    </div>
  </div>
</template>
<script>
import Velocity from "velocity-animate";
export default {
  name: "sectionOne",
  data() {
    return {
      sentenceChinese: {},
      authorChinese: [],
      sentenceGermanShow: false,
      authorChineseShow: false,
      authorGermanShow: false,
      scrollShow: false
    };
  },
  props: {},
  computed: {
    sentenceGermanShowStyle: function () {
      return {
        opacity: this.sentenceGermanShow ? 0.2 : 0,
      };
    },
    authorChineseShowStyle: function () {
      return {
        opacity: this.authorChineseShow ? 1 : 0,
      };
    },
    authorGermanShowStyle: function () {
      return {
        opacity: this.authorGermanShow ? 0.2 : 0,
      };
    },
    scrollShowStyle: function () {
      return {
        opacity: this.scrollShow ? 1 : 0,
      };
    },
  },
  methods: {
    //分割句子，将句子逐字拆解
    splitSentence: function (obj) {
      let sentence = obj.querySelector("p");
      let sentenceArr = sentence.innerText.replaceAll(" ", "").split("");
      sentence.remove();
      return { ...sentenceArr };
    },

    //以下为过渡动画
    //中文句子插入前
    sentenceChineseBeforeEnter: function (el) {
      el.style.opacity = 0;
      el.style.textShadow = "#fff 0 0 8px";
    },
    //中文句子插入中
    sentenceChineseEnter: function (el, done) {
      //文字的阴影开始逐字浮现
      //shadowDelayTime：文字的阴影的交错浮现时间差为55
      let shadowDelayTime = 55;
      let shadowDelay = el.dataset.index * shadowDelayTime;
      setTimeout(function () {
        Velocity(el, { opacity: 1 }, { complete: done });
      }, shadowDelay);

      //文字开始逐字浮现
      let textDelay =
        //文字的阴影浮现到句子11/27的地方的时间点，从这时文字开始逐字浮现
        Object.keys(this.sentenceChinese).length * (9 / 27) * shadowDelayTime +
        //文字的交错浮现时间差为36
        el.dataset.index * 36;
      setTimeout(function () {
        Velocity(el, { textShadowBlur: "0px" }, { complete: done });
      }, textDelay);
    },
    //中文句子插入后
    sentenceChineseAfterEnter: function (el) {
      if (Object.keys(this.sentenceChinese).length - 3 == el.dataset.index)
        this.sentenceGermanShow = true;
    },
    //德文句子显示后
    sentenceGermanAfterEnter: function () {
      this.authorChineseShow = true;
      this.authorGermanShow = true;
    },
    //中文作者名显示后
    authorChineseAfterEnter: function () {
      this.scrollShow = true;
    },
    //本页加载完成
    scrollAfterEnter: function () {
      this.$emit("overLoading");
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

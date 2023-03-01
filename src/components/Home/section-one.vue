<!-- 第一屏 -->
<template>
  <div id="section-one">
    <div id="sentence">
      <!-- 中文句子 -->
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
            v-for="item in sentenceChinese"
            :key="item.id"
            :data-index="item.id"
            >{{ item.value }}</span
          >
        </transition-group>
      </div>
      <!-- 德文句子 -->
      <p
        ref="sentenceGerman"
        id="sentence-German"
        @transitionend="transitionend"
      >
        "Ich habe einmal，und vielleicht mit Recht，gesagt : Aus der früheren
        Kultur wird ein Trümmerhaufen und am Schluß ein Aschenhaufen
        werden，aber es werden Geister über der Asche schweben."
      </p>
      <!-- 作者 -->
      <div id="author" ref="author" @transitionend="transitionend">
        <div id="author-Chinese">
          <p>维特根斯坦</p>
          <span></span>
          <span v-for="item in authorChinese" :key="item.id">{{
            item.value
          }}</span>
        </div>
        <p id="author-German">Ludwig Josef Johann Wittgenstein</p>
      </div>
    </div>
    <!-- 滑动滚轮 -->
    <div id="scroll" ref="scroll" @transitionend="transitionend">
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
      sentenceChinese: [],
      authorChinese: [],
      overLoadingFlag: false,
    };
  },
  methods: {
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
        //文字的阴影浮现到句子9/27的地方的时间点，从这时文字开始逐字浮现
        this.sentenceChinese.length * (9 / 27) * shadowDelayTime +
        //文字的交错浮现时间差为36
        el.dataset.index * 36;
      setTimeout(function () {
        Velocity(el, { textShadowBlur: "0px" }, { complete: done });
      }, textDelay);
    },
    sentenceChineseAfterEnter: function (el) {
    //中文句子显示到倒数第三个字后
      if (this.sentenceChinese.length - 3 === Number(el.dataset.index)) {
        this.$refs.sentenceGerman.style.opacity = 0.2;
      }
    },
    transitionend: function (event) {
      switch (event.target.id) {
        //德文句子显示后
        case "sentence-German":
          this.$refs.author.style.opacity = 1;
          break;
        //作者名显示后
        case "author":
          this.$refs.scroll.style.opacity = 1;
          break;
        //滚轮显示后，本页加载完成
        case "scroll":
          this.$emit("overLoading");
          this.overLoadingFlag = true;
          break;
      }
    },
  },
  activated() {
    if (this.overLoadingFlag) this.$emit("overLoading");
  },
  mounted: function () {
    init(this);
  },
};
function init(that) {
  that.sentenceChinese = splitSentence(
    document.querySelector("#sentence-Chinese")
  );
  that.authorChinese = splitSentence(
    document.querySelector("#author-Chinese")
  );
}
function splitSentence(el) {
  //分割句子，将句子逐字拆解
  let sentence = el.querySelector("p");
  let sentenceArr = sentence.innerText.replaceAll(" ", "").split("");
  sentenceArr.forEach((value,index,array) => {
    array[index] = {"id":index,"value":value};
  });
  sentence.remove();
  return sentenceArr;
}
</script>

<style scoped>
@import "~@/assets/css/Home/section-one.css";
</style>

<template>
  <div :class="[{ show: isOpenCatalogue }, 'catalogue', 'card-box']">
    <div class="title">
      <i class="iconfont icon-liebiao"></i>
      <span>目录</span>
    </div>
    <div class="toc" :progress-percentage="scrollPercentage">
      <ol>
        <li>
          <a href="#testa">
            <span class="number">1.&nbsp;</span>
            <span class="content">开始之前class="active"</span>
          </a>
          <ol>
            <li>
              <a href="#testb" class="active">
                <span class="number">1.1&nbsp;</span>
                <span class="content">开始之前</span>
              </a>
            </li>
          </ol>
        </li>
        <li v-for="(item, index) in 4" :key="item">
          <a
            ref="currentTocRef"
            :href="`#test${item}`"
            :class="{ active: currentToc === index }"
          >
            <span class="number">{{ item + 1 }}.&nbsp;</span>
            <span class="content">开始之前</span>
          </a>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentToc: null,
      scrollPercentage: 0,
      isOpenCatalogue: false,
    };
  },
  methods: {
    // 获取当前滚动内容百分比
    getScrollPercentage: function (
      article,
      articleRect,
      articlePosition,
      alreadyScroll
    ) {
      //开始计算百分比
      if (alreadyScroll >= 0) {
        //获取文章内容的可视部分(视口可见的部分)的高度（这里指文章内容底部到视口的部分）
        const notScroll =
          article.scrollHeight <= window.innerHeight - articlePosition
            ? article.scrollHeight
            : window.innerHeight;
        //计算文章需要滚动的总距离（可视部分不需要滚动）
        const needScroll = article.scrollHeight - notScroll;
        //已滚动的距离/总的需要滚动的距离 = 元素滚动百分比
        this.scrollPercentage = Math.floor((alreadyScroll / needScroll) * 100);
      } else this.scrollPercentage = 0;
      //文章内容的底部已经在视口底部的上方了
      if (articleRect.bottom <= window.innerHeight) this.scrollPercentage = 100;
    },
    // 根据滚动内容位置来为a标签设置active样式
    getCurrentToc: function () {
      // 获取并遍历目录所有的a标签
      const currentTocref = this.$refs.currentTocRef;
      currentTocref.forEach((element, index, array) => {
        // 根据a标签指向的id来获取对应的内容dom
        const currentContent = document.querySelector(element.hash);
        const rect = currentContent.getBoundingClientRect();
        const top = Math.floor(rect.top);
        const bottom = Math.floor(rect.bottom);
        // 判断内容是否在视口内
        if (top <= 0 && bottom >= 0) this.currentToc = index;
        //滚动到最后一条目录的内容前面了，目前视口内第一条目录的内容还没滚动到视口的最上方
        //滚动到最后一条目录的内容后面了，目前视口内已经没有最后一条目录的内容
        if (
          (index === 0 && top > 0) ||
          (index === array.length - 1 && bottom <= 0)
        )
          this.currentToc = null;
      });
    },
    // 设置目录上的内容浏览进度以及根据进度为目录标题设置active
    setCurrentTocAndScrollPercentage:function(){
      const article = this.$parent.$refs.article;
      const articleRect = article.getBoundingClientRect();
      //文章内容相对于视口的位置
      const articlePosition = window.scrollY + articleRect.top;
      //等滚动到文章内容的位置再计算步数（百分比）
      //获取滚动位置
      const alreadyScroll = Math.floor(window.scrollY - articlePosition);

      // 获取当前滚动内容百分比
      this.getScrollPercentage(
        article,
        articleRect,
        articlePosition,
        alreadyScroll
      );
      // 根据滚动内容位置来为a标签设置active样式
      this.getCurrentToc();
    }
  },
  created() {
    this.$bus.$on("isOpenCatalogue", (res) => {
      this.isOpenCatalogue = res;
    });
  },
  mounted() {
    window.addEventListener("scroll", this.setCurrentTocAndScrollPercentage);
  },
  beforeDestroy(){
    window.removeEventListener('scroll', this.setCurrentTocAndScrollPercentage);
  }
};
</script>

<style scoped>
@media screen and (max-width: 900px) {
  .catalogue {
    position: fixed;
    opacity: 0;
    right: 45px;
    bottom: 30px;
    backdrop-filter: blur(10px);
    width: 300px;
    transform-origin: right bottom;
    transform: scale(0.7);
  }
  .catalogue.show {
    opacity: 1;
    transform: scale(1);
  }
}
.catalogue {
  margin-top: 0 !important;
  padding: 20px 24px;
}
.catalogue .title {
  font-size: 16.8px;
  padding-bottom: 6px;
}
.catalogue .title i {
  font-weight: bolder;
  font-size: 20px;
  line-height: 20px;
}
.catalogue .title span {
  margin-left: 10px;
}
.catalogue .toc {
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}
.catalogue .toc ol {
  padding-left: 8px;
}
.catalogue .toc > ol {
  padding-left: 0px !important;
}
.catalogue .toc ol li .active {
  border-left-color: #009d92;
  background: #00c4b6;
  color: #fff;
}
.catalogue .toc ol li a {
  display: block;
  padding-left: 6px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease-in-out;
}
.catalogue .toc::before {
  content: attr(progress-percentage);
  position: absolute;
  top: 12px;
  right: 24px;
  color: #a9a9a9;
  font-size: 24px;
  font-style: italic;
}
</style>
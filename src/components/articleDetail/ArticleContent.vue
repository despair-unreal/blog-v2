<!-- 文章内容 -->
<template>
  <article v-progress v-catalog>
    <h1>Lorem, ipsum dolor.</h1>
    <h2>Lorem, ipsum.</h2>
    <p>
      <span>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis quae debitis vero excepturi doloremque labore
        dolorum, expedita blanditiis necessitatibus sequi nostrum illum, officia nisi, aspernatur ipsum eligendi
        veritatis dolore molestiae?
      </span>
      <span>
        Delectus commodi sequi consectetur, dignissimos quae quidem amet consequatur sit itaque facilis illo numquam
        quaerat blanditiis dolores porro corporis veniam modi non dolorem officiis nostrum sed laboriosam voluptatem.
        Eaque, laudantium!
      </span>
      <span>
        Non perspiciatis quia quos praesentium reiciendis itaque laudantium sunt assumenda eius. Deserunt, numquam
        recusandae animi voluptatum rem accusantium error voluptates modi provident, quis cupiditate optio magnam
        aperiam, dolorem facere? Hic.
      </span>
    </p>
    <h2>Lorem ipsum dolor sit.</h2>
    <p>
      <span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit architecto impedit rem maiores exercitationem
        voluptatibus possimus labore. Nemo, a dolore nihil laborum quo ad possimus assumenda, aliquid, pariatur quas
        illum.
      </span>
      <span>
        Perferendis nobis velit nam dolorem consequatur quis consectetur voluptatum illum incidunt accusamus cum minus
        autem, distinctio numquam fugiat quidem suscipit vitae aperiam ea dolore eaque eius modi voluptas praesentium!
        Cum?
      </span>
    </p>
    <h1>Lorem.</h1>
    <p>
      <span>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem laborum amet obcaecati optio aut hic. Omnis
        tempore voluptate consequatur unde culpa debitis nostrum saepe corporis aliquid molestias, rem inventore cumque.
      </span>
    </p>
    <h1>Lorem ipsum dolor sit amet consectetur.</h1>
    <h2>Lorem, ipsum.</h2>
    <h3>Lorem.</h3>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque ab in nobis deleniti fuga autem voluptatum quam qui
      quo molestias. Perspiciatis vero corporis iusto accusamus consectetur ipsum provident ullam laudantium. Neque
      ullam quidem aliquam nemo atque perspiciatis. Corporis deserunt nesciunt illo vitae sunt aspernatur expedita,
      doloremque, dolor quibusdam voluptas quod consequuntur fuga impedit alias eos aut aliquam ex perferendis error.
      Obcaecati iusto dolor dolores sit quisquam eos molestiae delectus, neque doloribus veniam voluptatem eaque facere
      nesciunt at tenetur aspernatur dolorum beatae quia ratione deserunt soluta fugit vel? Facere, corrupti commodi.
      Consequuntur aut maiores, blanditiis totam, molestias libero est fugit consequatur neque ex sapiente quasi dolorem
      incidunt enim laborum modi fugiat repellendus officia rerum perspiciatis alias odio maxime sint. Incidunt, sit?
      Aperiam sint vitae minus itaque quis dolores eum! Eaque praesentium quisquam nesciunt odio veritatis recusandae
      aut quidem animi dolorem sunt modi rem unde ratione porro iusto ipsum ut, ad at!
    </p>
  </article>
</template>

<script>
import { debounce } from '@/utils/util';
let tocDoms, articleObserver;
export default {
  props: ['progress', 'tree', 'activeTitleID'],
  methods: {
    // 监听文章滚动的回调事件
    handleArticleScroll: debounce(
      function (el) {
        this.updateArticleProgress(el);
        this.updateCurrentToc();
      },
      100,
      true
    ),
    // 设置当前阅读文章进度数，百分比
    updateArticleProgress(el) {
      let ratio = 0;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      if (rect.top < 0) {
        // bottom等于视口高度时说明文章内容阅读完毕
        if (rect.bottom > windowHeight) {
          /* // 计算元素经过视口的高度 包含视口的区域
          const progress = windowHeight - rect.top;
          ratio = progress / el.clientHeight; */
          // 计算占比 只计算视口上方的区域，不包含视口的区域
          ratio = -rect.top / (el.clientHeight - windowHeight);
        } else ratio = 1;
      } else ratio = 0;
      const progress = (ratio * 100).toFixed(0);
      this.$emit('update:progress', progress);
    },
    // 设置当前阅读到的标题（h标签）
    updateCurrentToc() {
      const find = Array.from(tocDoms).findLast(el => {
        return el.getBoundingClientRect().top <= 10;
      });
      const activeTitleID = find ? find.id : '';
      this.$emit('update:activeTitleID', activeTitleID);
    }
  },
  directives: {
    // 计算文章进度数，百分比
    progress: {
      // 绑定监听器；监听文章滚动进度、当前阅读的标题
      bind(el, binding, vnode) {
        const that = vnode.context;
        // 监听文章区域是否与视口交叉，有交叉区域再监听
        articleObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              that.handleArticleScroll = that.handleArticleScroll.bind(null, el);
              window.addEventListener('scroll', that.handleArticleScroll);
            } else window.removeEventListener('scroll', that.handleArticleScroll);
          });
        });
        articleObserver.observe(el);
      },
      // 解绑监听
      unbind(el, binding, vnode) {
        const that = vnode.context;
        window.removeEventListener('scroll', that.handleArticleScroll);
        articleObserver.unobserve(el);
      }
    },
    // 提取h标签生成目录树
    catalog: {
      bind(el, binding, vnode) {
        const that = vnode.context;
        // 获取所有的h1~h6的标签
        const hEl = el.querySelectorAll('h1,h2,h3,h4,h5,h6');
        tocDoms = hEl;
        // 提取每个H标签的标题内容、标签等级，并设置id
        const list = Array.from(hEl).map((value, index) => {
          !value.id && value.setAttribute('id', value.innerText);
          return {
            hLevel: +value.nodeName.slice(1),
            title: value.innerText,
            id: value.id,
            children: [],
            index
          };
        });
        // 目录树数组，比对条件，即将加入的新标签对象
        const pushObj = (arr, condition, newObj) => {
          // 当前层级的数组
          let currentArr = arr;
          let foundPosition = false;
          while (!foundPosition) {
            const arrLength = currentArr.length;
            if (arrLength > 0) {
              // 当前层级的最后一个标签对象，前面的对象都是完成式，只能往最后一个里面追加新标签对象
              const lastObj = currentArr[arrLength - 1];
              // 如果新标签对象符合条件就加入这一层级，否则接着向内寻找位置
              if (condition(lastObj, newObj)) {
                currentArr.push(newObj);
                foundPosition = true;
              } else {
                currentArr = lastObj.children;
              }
            } else {
              currentArr.push(newObj);
              foundPosition = true;
            }
          }
        };
        // 用来比对的条件
        // 如果新标签的等级小于或者等于比对的标签对象就要加入这一层级的目录
        const condition = (obj, newObj) => {
          return obj.hLevel >= newObj.hLevel;
        };
        // 根据提取出来的标签生成目录树
        const tree = list.reduce((pre, current) => {
          // 根据判断条件，让新标签对象加入目录树合适的位置
          pushObj(pre, condition, current);
          return pre;
        }, []);
        that.$emit('update:tree', tree);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
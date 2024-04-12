<template>
  <div>
    <span class="number" v-for="(item, index) in arr" :key="index"
      >{{ index >= arr.length - blueNum ? '+' : '' }}{{ item | padNumer }}
    </span>
    <br />
    <div class="btn" @click="random('shuangSeQiu')">双色球</div>
    <div class="btn" @click="random('daLeTou')">大乐透</div>
    <img class="rules" src="https://pic1.zhimg.com/v2-0aea76cd500faf01b036bf70ce6388cc_r.jpg" alt="双色球" />
    <img class="rules" src="https://www.neabridge.com/gytc/ywdt/202302/W020230206598784717380.png" alt="大乐透" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      blueNum:null,
      arr: [],
    };
  },
  filters: {
    padNumer(num) {
      return num.toString().padStart(2, '0');
    },
  },
  methods: {
    random(type) {
      this.arr = [];
      //   红球号码范围为01～33，蓝球号码范围为01～16
      //   33个红球中开出6个号码，从16个蓝球中开出1个号码
      let redNum,redMax,blueMax;
      switch (type) {
        case 'shuangSeQiu':{
          redNum = 6;
          redMax = 33;
          blueMax = 16;
          break;
        }
        case 'daLeTou':{
          redNum = 5;
          redMax = 35;
          blueMax = 12;
          break;
        }
      }
      const fn = (quantity,max)=>{
        const tmp = [];
        for (let i = 0; i < quantity; i++) {
          let isRepeat = true;
          let num;
          while (isRepeat) {
            num = Math.floor(Math.random() * max) + 1;
            isRepeat = tmp.includes(num);
          }
          tmp.push(num);
        }
        tmp.sort((a,b)=>a-b);
        this.arr.push(...tmp);
      };
      const allNum = 7;
      const blueNum = this.blueNum = allNum - redNum;
      fn(redNum,redMax);
      fn(blueNum,blueMax);
    }
  },
};
</script>

<style scoped>
.number {
  font-size: 20px;
}
.btn {
  display: inline-block;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 20px;
  color: white;
  background: red;
  cursor: pointer;
  margin-right: 10px;
}
.rules {
  width: 100%;
}
</style>
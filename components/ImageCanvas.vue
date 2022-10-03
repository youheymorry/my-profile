<template>
  <vue-p5 v-on="{setup}"></vue-p5>
</template>

<script>

import VueP5 from "vue-p5";
export default {
  name:"ImageCanvas",
  data(){
    return {
      sketch:null,
      isCreated:false,
      currentSize:400,
      myImgP5:null
    }
  },
  methods: {
    setup(sk) {
      this.sketch = sk;
    },
    resetMyCanvas(size=400, imgPath){//custom
      this.currentSize = size;
      this.isCreated ? this.sketch.resizeCanvas(size, size) : this.sketch.createCanvas(size, size);
      if(imgPath) this.loadMyImage(imgPath); 
    },
    loadMyImage(img){
      this.sketch.loadImage(img, this.showMyImage);
    },
    showMyImage(imageP5){
      this.myImgP5 = imageP5;
      this.sketch.image(imageP5, 0, 0, this.currentSize, this.currentSize);
    },
    getMyImageP5(){
      return this.myImgP5;
    }
  },
  components:{ "vue-p5":VueP5 }
};

</script>
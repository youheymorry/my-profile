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
      this.sketch.image(imageP5, 0, 0, this.currentSize, this.currentSize);
    },
    getImageData(){
      let imgDataP5 = this.sketch.get();
      const imgSize = this.currentSize; // for mnist model classification
      // imgDataP5.resize(imgSize, imgSize);
      // const originalSize = this.canvasProps.size;
      // let graphics = this.sketch.createGraphics(28,28);
      // let originalImgInfo = [0, 0, originalSize, originalSize];
      // let copiedInfo = [0, 0, imgSize, imgSize];
      // graphics.copy(this.sketch, ...originalImgInfo, ...copiedInfo);
      let resizedData = imgDataP5;
      //resizedData.save("ResizedImgTest");
      let dwgContext = resizedData.drawingContext;
      let imageData = dwgContext.getImageData(0,0,imgSize,imgSize);
      return imageData;
    },
  },
  components:{ "vue-p5":VueP5 }
};

</script>
<template>
  <vue-p5 class="no-touch-action" v-on="{setup, draw, touchStarted}"></vue-p5>
</template>

<script>
import VueP5 from "vue-p5";
export default {
  name:"FreeCanvas",
  data(){
    return {
      sketch:null,
      isCreated:false,
      writingMode:false,
      canvasProps:{bgColor:"black", stColor:"white", stWeight:8, size:400},
    }
  },
  methods: {
    setup(sk) {
      this.sketch = sk;
    },
    resetMyCanvas(size){//custom
      if(!size) size = this.canvasProps.size;
      this.isCreated ? this.sketch.resizeCanvas(size, size) : this.sketch.createCanvas(size, size);
      this.sketch.background(this.canvasProps.bgColor);
      this.sketch.stroke(this.canvasProps.stColor), this.sketch.strokeWeight(this.canvasProps.stWeight);
      this.isCreated = true, this.canvasProps.size = size;
    },
    draw() {
      let sk = this.sketch;
      let isWriting = (sk.mouseIsPressed || this.writingMode);
      if(isWriting){
        sk.line(sk.pmouseX, sk.pmouseY, sk.mouseX, sk.mouseY);
      }else{
        this.writingMode = false;
      }
    },
    touchStarted(){
      this.writingMode = true;
      this.draw(this.sketch);
    },
    getImageData(){
      let imgDataP5 = this.sketch.get();
      const imgSize = 28; // for mnist model classification
      imgDataP5.resize(imgSize, imgSize);
      // const originalSize = this.canvasProps.size;
      // let graphics = this.sketch.createGraphics(28,28);
      // let originalImgInfo = [0, 0, originalSize, originalSize];
      // let copiedInfo = [0, 0, imgSize, imgSize];
      // graphics.copy(this.sketch, ...originalImgInfo, ...copiedInfo);
      let resizedData = imgDataP5;
      // resizedData.save("ResizedImgTest");
      let dwgContext = resizedData.drawingContext;
      let imageData = dwgContext.getImageData(0,0,imgSize,imgSize);
      return imageData;
    },
  },
  components:{ "vue-p5":VueP5 }
};

</script>
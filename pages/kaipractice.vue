<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" ref="freeCanvasColumn">
        <FreeCanvas ref="freeCanvas" />
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8">
        <!-- <v-file-input 
          @change="showImage"
          v-model="testImage"
          >
          <template slot="append">
            <v-btn @click="classifyImage" color="success">Classify</v-btn>
          </template>
        </v-file-input> -->
        <v-btn @click="classifyImage" color="cyan">TEST</v-btn>
        <ImageCanvas ref="imageCanvas" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FreeCanvas from '~/components/FreeCanvas.vue';
import NekoImage from "~/assets/nekopic.jpg"
import ImageCanvas from '~/components/ImageCanvas.vue';
import * as MacLea from "~/assets/JSFiles/MacLea.js"

export default {
  name: "MachineLearnings",
  data(){
    return {
      imgClassifier:null,
      currentWidth:0,
      testImage:NekoImage,
      imgPath:""
    }
  },
  computed:{
    
  },
  methods: {
    resetAllCanvas(initial){
      initial = initial && initial.isTrusted === undefined;
      this.$store.commit("changeScreen");// for testing only
      let canWidth = this.getCanvasWidth();
      if(this.currentWidth !== canWidth || initial){
        this.currentWidth = canWidth;
        this.$refs.freeCanvas.resetMyCanvas(canWidth);
        let myImg = this.imgPath === '' ? this.testImage : this.imgPath;
        this.$refs.imageCanvas.resetMyCanvas(canWidth, myImg);
      }
    },
    getCanvasWidth(){
      let windowWidth = window.innerWidth-60;
      let colWidth = this.$refs.freeCanvasColumn.clientWidth;
      return Math.min(windowWidth, colWidth);
    },
    changeImage(){

    },
    classifyImage(){
      let imageP5 = this.$refs.imageCanvas.getMyImageP5();
      MacLea.classifyMyImage(imageP5, this.showImageClassifyResult);
      //this.imgClassifier.classify(imageP5, this.showImageClassifyResult);
    },
    showImageClassifyResult(error, result){
      if(error){
        console.log(error);
        alert("Error");
      }else if(result){
        console.log(result);
        var str = result[0].label;
        var perc = Math.round(result[0].confidence*100) + "%";
        alert(str + " (" + perc + ")");
      }else{
        alert("Unexpected Error");
      }
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.resetAllCanvas);
    this.resetAllCanvas(true);
    if(!this.imgClassifier) this.imgClassifier = ml5.imageClassifier('MobileNet');
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.resetAllCanvas)
  },
  components: { FreeCanvas, ImageCanvas }
};

</script>
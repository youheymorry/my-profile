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
        <v-img :src="testImage" height="500" :width="currentWidth"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FreeCanvas from '~/components/FreeCanvas.vue';
import NekoImage from "~/assets/nekopic.jpg"

export default {
  name: "MachineLearnings",
  data(){
    return {
      imgClassifier:null,
      currentWidth:0,
      testImage:NekoImage,
    }
  },
  computed:{
    
  },
  methods: {
    handleResize: function() {
      this.$store.commit("changeScreen");// for testing only
      let canWidth = this.getCanvasWidth();
      if(this.currentWidth !== canWidth){
        this.currentWidth = canWidth;
        this.createFreeCanvas(canWidth);
      }
    },
    createFreeCanvas(canWidth){
      let fc = this.$refs.freeCanvas;
      fc.resetMyCanvas(canWidth);
    },
    getCanvasWidth(){
      let windowWidth = window.innerWidth-60;
      let colWidth = this.$refs.freeCanvasColumn.clientWidth;
      return Math.min(windowWidth, colWidth);
    },
    changeImage(){

    },
    classifyImage(){

    }
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize);
    this.createFreeCanvas();
    if(!this.imgClassifier) this.imgClassifier = ml5.imageClassifier('MobileNet');
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  components: { FreeCanvas }
};

</script>
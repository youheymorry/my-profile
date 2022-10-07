<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" ref="freeCanvasColumn">
        <FreeCanvas ref="freeCanvas" />
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8">
        <v-btn color="primary" @click="fileBtnClick" class="mr-3">
          <v-icon class="mr-1">mdi-camera-image</v-icon>
          select image
        </v-btn>
        <v-btn @click="classifyImage" color="cyan">
          <v-icon class="mr-1">mdi-robot</v-icon>
          Classify
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" class="mt-0">
      <v-col cols="12" sm="8" class="mt-0">
        <ImageCanvas ref="imageCanvas" />
      </v-col>
    </v-row>
    <input
      style="display: none"
      ref="input"
      type="file"
      accept="image/jpeg, image/jpg, image/png"
      @change="changeImage()"
    >
    <MlResultDialog ref="mlResultDialog" />
  </v-container>
</template>

<script>
import FreeCanvas from '~/components/FreeCanvas.vue';
import NekoImage from "~/assets/nekopic.jpg"
import ImageCanvas from '~/components/ImageCanvas.vue';
import MlResultDialog from '~/components/MlResultDialog.vue';
// import AnimeLoader from '~/components/AnimeLoader.vue';

export default {
  name: "MachineLearnings",
  data(){
    return {
      loading:false,
      currentWidth:0,
      nokeImage:NekoImage,
      uploadedImgUrl:null,
      mlResultDialog:false,
    }
  },
  computed:{
    isAllModelsLoaded(){
      return this.imgClassifier !== null;
    },
    imgClassifier(){
      return this.$store.state.imgClassifier;
    },
    imgToClassify(){
      return this.uploadedImgUrl ? this.uploadedImgUrl : this.nokeImage;
    }
  },
  methods: {
    resetAllCanvas(initial){
      initial = initial && initial.isTrusted === undefined;
      this.$store.commit("changeScreen");// for testing only
      let canWidth = this.getCanvasWidth();
      if(this.currentWidth !== canWidth || initial){
        this.currentWidth = canWidth;
        this.$refs.freeCanvas.resetMyCanvas(canWidth);
        this.$refs.imageCanvas.resetMyCanvas(canWidth, this.imgToClassify);
      }
    },
    getCanvasWidth(){
      let windowWidth = window.innerWidth-60;
      let colWidth = this.$refs.freeCanvasColumn.clientWidth;
      return Math.min(windowWidth, colWidth);
    },
    loadMlModels(){
      const self = this;
      if(!self.imgClassifier){
        self.$store.commit("toggleLoading", true);
        ml5.imageClassifier('MobileNet', function(err, model) {
          // self.imgClassifier = model;
          self.$store.commit("saveImgClassifier", model);
          self.$store.commit("toggleLoading", false);
        });
      }
    },
    fileBtnClick(){
      this.$refs.input.click();
    },
    async changeImage(){
      const file = this.$refs.input.files[0];
      this.uploadedImgUrl = URL.createObjectURL(file);
      this.$refs.imageCanvas.resetMyCanvas(this.getCanvasWidth(), this.imgToClassify);
    },
    classifyImage(){
      this.$store.commit("toggleLoading", true);
      let imageP5 = this.$refs.imageCanvas.getMyImageP5();
      this.imgClassifier.classify(imageP5, this.showImageClassifyResult);
    },
    showImageClassifyResult(error, result){
      if(error){
        console.log(error);
        alert("Error");
      }else if(result){
        var options = {xaxis:{categories:[]}, yaxis:{}, dataLabels:{}, theme:{mode:"dark"}};
        var series = [{name:"Img Classifier Result", data:[]}];
        result.forEach(res => {
          options.xaxis.categories.push(res.label);
          var perc = Math.round(res.confidence*100);
          series[0].data.push(perc);
        });
        let height = this.$store.state.isMobile ? 400 : 500;
        let formatter = function (val) {
          return val + "%";
        };
        options.xaxis.crosshairs = {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        };
        options.yaxis.labels = {formatter:formatter};
        options.dataLabels = {formatter:formatter};
        let chartData = {options:options, series:series, height:height};
        this.$refs.mlResultDialog.showDialog(chartData);
      }else{
        alert("Unexpected Error");
      }
      this.$store.commit("toggleLoading", false);
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.resetAllCanvas);
    this.resetAllCanvas(true);
    this.loadMlModels();
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.resetAllCanvas)
  },
  components: { FreeCanvas, ImageCanvas, MlResultDialog }
};

</script>
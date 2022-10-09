<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" ref="freeCanvasColumn">
        <FreeCanvas ref="freeCanvas" />
      </v-col>
    </v-row>
    <v-divider />
    <v-row justify="center" align="center">
      <span class="text-h6">Image Classification</span>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8">
        <v-tooltip top color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" @click="fileBtnClick" v-bind="attrs" v-on="on" class="mr-1 px-0">
              <v-icon large>mdi-camera-image</v-icon>
            </v-btn>
          </template>
          <span>Select Image</span>
        </v-tooltip>
        <v-menu open-on-hover bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on" class="mr-3 px-0">
              <v-icon large>mdi-image-search</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, index) in imgItems" :key="index" @click="selectImgFromAsset(index)">    
              <v-list-item-title>
                <v-icon class="mr-1">{{item.icon}}</v-icon>{{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-tooltip top color="info">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="info" @click="classifyImage" v-bind="attrs" v-on="on" class="mr-3 px-0">
              <v-icon large>mdi-robot</v-icon>
            </v-btn>
          </template>
          <span>Classify Image</span>
        </v-tooltip>
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
    <ProgressCircularDialog ref="progressCircularDialog" />
  </v-container>
</template>

<script>
import FreeCanvas from '~/components/FreeCanvas.vue';
import ImageCanvas from '~/components/ImageCanvas.vue';
import MlResultDialog from '~/components/MlResultDialog.vue';
import BirdImage from "~/assets/sample_images/bird.jpg";
import DogImage1 from "~/assets/sample_images/jack.png";
import DogImage2 from "~/assets/sample_images/MrBubz.jpg";
import CatImage1 from "~/assets/sample_images/kitten.jpg";
import CatImage2 from "~/assets/sample_images/neko.png";
import ProgressCircularDialog from '~/components/ProgressCircularDialog.vue';

export default {
  name: "KAIPractice",
  data(){
    return {
      loading:false,
      currentWidth:0,
      selectedImg:BirdImage,
      mlResultDialog:false,
      imgItems:[
        {title:"Bird", icon:"mdi-bird", img:BirdImage},
        {title:"Dog1", icon:"mdi-dog", img:DogImage1},
        {title:"Dog2", icon:"mdi-dog", img:DogImage2},
        {title:"Cat1", icon:"mdi-cat", img:CatImage1},
        {title:"Cat2", icon:"mdi-cat", img:CatImage2}
      ]
    }
  },
  computed:{
    isAllModelsLoaded(){
      return this.imgClassifier !== null;
    },
    imgClassifier(){
      return this.$store.state.imgClassifier;
    },
  },
  methods: {
    resetAllCanvas(initial){
      initial = initial && initial.isTrusted === undefined;
      this.$store.commit("changeScreen");// for testing only
      let canWidth = this.getCanvasWidth();
      if(this.currentWidth !== canWidth || initial){
        this.currentWidth = canWidth;
        this.$refs.freeCanvas.resetMyCanvas(canWidth);
        this.$refs.imageCanvas.resetMyCanvas(canWidth, this.selectedImg);
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
        const prDialog = self.$refs.progressCircularDialog;
        prDialog.showDialog("Loading Machine Learning Models...");
        setTimeout(() => prDialog.changeProgress(30), 1);
        ml5.imageClassifier('MobileNet', function(err, model) {
          self.$store.commit("saveImgClassifier", model);
          prDialog.changeProgress(100);
          setTimeout(() => prDialog.closeDialog(), 500);
        });
      }
    },
    fileBtnClick(){
      this.$refs.input.click();
    },
    async changeImage(){
      const file = this.$refs.input.files[0];
      this.selectedImg = URL.createObjectURL(file);
      this.$refs.imageCanvas.resetMyCanvas(this.getCanvasWidth(), this.selectedImg);
    },
    selectImgFromAsset(index){
      this.selectedImg = this.imgItems[index].img;
      this.$refs.imageCanvas.resetMyCanvas(this.getCanvasWidth(), this.selectedImg);
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
        var isMobile = this.$store.state.isMobile;
        result.forEach(res => {
          var label = isMobile ? res.label.split(",")[0] : res.label;
          options.xaxis.categories.push(label);
          var perc = Math.round(res.confidence*100);
          series[0].data.push(perc);
        });
        let height = this.$store.state.isMobile ? 400 : 500;
        let formatter = function (val) {
          return val + "%";
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
  components: { FreeCanvas, ImageCanvas, MlResultDialog, ProgressCircularDialog }
};

</script>
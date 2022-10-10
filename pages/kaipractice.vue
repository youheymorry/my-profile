<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <span class="text-h5 text-primary font-weight-bold">MNIST Digit Classification</span>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" ref="pageColumn" class="mb-1 pb-0">
        <v-btn color="red" @click="clearFreeCanvas">Clear</v-btn>
        <v-btn color="primary" @click="triggerDigitRecognizer">Predict</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="4" class="mr-1 bg-white" justify="center" align="center">
        <FreeCanvas ref="freeCanvas" />
      </v-col>
      <v-col cols="12" sm="5" class="mt-2 ml-1">
        <apexchart type="bar" :height="chartHeight" :options="chartOptions" :series="chartSeries"></apexchart>
      </v-col>
    </v-row>
    <v-divider />
    <v-row justify="center" align="center">
      <span class="text-h5 text-info font-weight-bold">Image Classification</span>
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
            <v-btn color="info" @click="triggerImageClassifier" v-bind="attrs" v-on="on" class="mr-1 px-0">
              <v-icon large>mdi-robot</v-icon>
            </v-btn>
          </template>
          <span>Classify Image</span>
        </v-tooltip>
        <v-tooltip top color="cyan">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="cyan" @click="generateCartoonImage" v-bind="attrs" v-on="on" class="mr-1 px-0" style="display:none">
              <v-icon large>mdi-robot</v-icon>
            </v-btn>
          </template>
          <span>Cartoon Image</span>
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
import * as tf from "@tensorflow/tfjs";
import ImageGenerator from "~/assets/JSFiles/GenerateTensorImage.js";

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
      ],
      mnistClassifier:null,
      mnistModelPath:"https://raw.githubusercontent.com/youheymorry/mnist_model_python/main/mnist_tfjs_keras/model.json",
      chartOptions:{
        title:{
          text:"MNIST Result",
          style:{
            color:"#007bff"
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        xaxis: {
          categories: ["0","1","2","3","4","5","6","7","8","9"],
          labels:{
            formatter:function(val){
              return val + "%"
            }
          }
        },
        yaxis: {
          min:0,
          max:100,
        },
        theme:{
          mode: "dark"
        }
      },
      chartHeight:0,
      mnistResult:[0,0,0,0,0,0,0,0,0,0],
      cartoonModelPath:{
        'hosoda': 'https://raw.githubusercontent.com/leemengtaiwan/tfjs-models/master/cartoongan/tfjs_json_models/hosoda/model.json',
        'miyazaki': 'https://raw.githubusercontent.com/Derek-Wds/training_CartoonGAN/master/tfModels/Miyazaki/model.json'
      },
      hosodaModel:null,
      miyazakiModel:null
    }
  },
  computed:{
    imgClassifier(){
      return this.$store.state.mlModels.imgClassifier;
    },
    modelLoadedProgress(){
      var loads = [this.imgClassifier === null, this.mnistClassifier === null, this.hosodaModel === null];
      var val = 0;
      loads.forEach(load => {
        if(!load) val += Math.ceil(100/loads.length);
      });
      if(100 <= val) val = 100;
      return val;
    },
    chartSeries(){
      var seriesData = [];
      let res = this.mnistResult;
      res.forEach(r => {
        var perc = Math.round(r*1000);
        perc /= 10;
        seriesData.push(perc);
      });
      var series = [{data:seriesData}];
      return series;
    }
  },
  methods: {
    resetAllCanvas(initial){
      initial = initial && initial.isTrusted === undefined;
      this.$store.commit("changeScreen");// for testing only
      let canWidth = this.getCanvasWidth();
      if(this.currentWidth !== canWidth || initial){
        var isMobile = this.$store.state.isMobile;
        this.currentWidth = canWidth, this.chartHeight = isMobile ? canWidth : canWidth * 0.5;
        var adjSpace = isMobile ? 10 : 30;
        this.$refs.freeCanvas.resetMyCanvas(this.chartHeight-adjSpace);
        this.$refs.imageCanvas.resetMyCanvas(canWidth, this.selectedImg);
      }
    },
    clearFreeCanvas(){
      var isMobile = this.$store.state.isMobile;
      var adjSpace = isMobile ? 10 : 30;
      this.$refs.freeCanvas.resetMyCanvas(this.chartHeight-adjSpace);
      this.mnistResult = [0,0,0,0,0,0,0,0,0,0];
    },
    getCanvasWidth(){
      let windowWidth = window.innerWidth-60;
      let pageColumn = this.$refs.pageColumn;
      if(pageColumn){
        let colWidth = pageColumn.clientWidth;
        return Math.min(windowWidth, colWidth);
      }
    },
    loadAllModels(){
      this.loadImgModel(), this.loadMnistModel(), this.loadHosodaModel();
    },
    async loadImgModel(){
      const self = this;
      if(!self.imgClassifier){
        const mobilenet = require('@tensorflow-models/mobilenet');
        const model = await mobilenet.load();
        self.$store.commit("saveImgClassifier", model);
        self.changeProgressLoader(self.modelLoadedProgress);
      }
    },
    async loadMnistModel(){
      const path = this.mnistModelPath;
      const self = this;
      tf.loadLayersModel(path)
      .then(pretrainedModel => {
        self.mnistClassifier = pretrainedModel;
        self.changeProgressLoader(self.modelLoadedProgress);
      });
    },
    async loadHosodaModel(){
      const path = this.cartoonModelPath.hosoda;
      const self = this;
      tf.loadGraphModel(path)
      .then(pretrainedModel => {
        self.hosodaModel = pretrainedModel;
        self.changeProgressLoader(self.modelLoadedProgress);
      });
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
    triggerImageClassifier(){
      this.showProgressLoader("Classifying Image...");
      const self = this;
      setTimeout(() => self.classifyImage(), 100);
    },
    async classifyImage(){
      let err = null;
      let predictions = null
      try{
        let imageData = this.$refs.imageCanvas.getImageData();
        predictions = await this.imgClassifier.classify(imageData);
        // console.log(predictions);
      }catch(err){
        err = err;
      }
      this.showImageClassifyResult(err, predictions);
      //this.showImageClassifyResult(null, predictions);
    },
    showImageClassifyResult(error, result){
      this.changeProgressLoader(100);
      if(error){
        console.log(error);
        alert("Error");
      }else if(result){
        var options = {xaxis:{categories:[]}, yaxis:{min:0, max:100}, dataLabels:{}, theme:{mode:"dark"}};
        var series = [{name:"Img Classifier Result", data:[]}];
        var isMobile = this.$store.state.isMobile;
        result.forEach(res => {
          var label = isMobile ? res.className.split(",")[0] : res.className;
          options.xaxis.categories.push(label);
          var perc = Math.round(res.probability*100);
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
    },
    triggerDigitRecognizer(){
      this.showProgressLoader("Processing...");
      const self = this;
      setTimeout(() => self.recognizeDigit(), 100);
    },
    recognizeDigit(){
      const imageData = this.$refs.freeCanvas.getImageData();
      const self = this;
      let model = self.mnistClassifier;
      const score = tf.tidy(() => {
        // convert to tensor (shape: [width, height, channels])
        const channels = 1; // grayscale
        let input = tf.browser.fromPixels(imageData, channels).toFloat();
        // normalized
        input = input.div(tf.scalar(255));
        // reshape input format (shape: [batch_size, width, height, channels])
        input = input.expandDims();
        // predict
        return model.predict(input);
      });
      this.mnistResult = this.convertScoreToResult(score);
      this.changeProgressLoader(100);
    },
    convertScoreToResult(score){
      const result = [];
      const datas = Array.isArray(score) ? score[0].dataSync() : score.dataSync();
      datas.forEach(d => result.push(d));
      return result;
    },
    async generateCartoonImage(){
      this.showProgressLoader("Generating Cartoon Image...");
      const imageData = this.$refs.imageCanvas.getImageData();
      const hosodaModel = this.hosodaModel;
      const imgSize = this.getCanvasWidth();
      const result = tf.tidy(() => {
        let img = tf.browser.fromPixels(imageData).resizeBilinear([imgSize, imgSize]);
        if (img.shape[0] !== imgSize || img.shape[1] !== imgSize) {
          throw new Error(`Input size should be ${imgSize}*${imgSize} but ${img.shape} is found`);
        } else if (img.shape[2] !== 3) {
          throw new Error(`Input color channel number should be 3 but ${img.shape[2]} is found`);
        }
        img = img.sub(127.5).div(127.5).reshape([1, imgSize, imgSize, 3]);
        const alpha = tf.ones([imgSize, imgSize, 1]).tile([1, 1, 1]).mul(255)
        let res = hosodaModel.predict(img);
        res = res.add(1).mul(127.5).reshape([imgSize, imgSize, 3]).floor();
        return res.concat(alpha, 2).cast('int32');
      });
      const generatedImage = await ImageGenerator.generatedImageResult(result);
      console.log(generatedImage);
      this.changeProgressLoader(100);
    },
    showProgressLoader(loadingTxt){
      const prDialog = this.$refs.progressCircularDialog;
      prDialog.showDialog(loadingTxt);
    },
    changeProgressLoader(val){
      const prDialog = this.$refs.progressCircularDialog;
      prDialog.changeProgress(val);
      if(val === 100) this.closeProgressLoader();
    },
    closeProgressLoader(){
      const prDialog = this.$refs.progressCircularDialog;
      setTimeout(() => prDialog.closeDialog(), 500);
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.resetAllCanvas);
    this.resetAllCanvas(true);
    this.showProgressLoader("Loading Machine Learning Models...");
    this.loadAllModels();
    if(this.modelLoadedProgress === 100) this.closeProgressLoader();
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.resetAllCanvas)
  },
  watch:{
    modelLoadedProgress(){
      if(this.modelLoadedProgress === 100) this.closeProgressLoader();
    }
  },
  components: { FreeCanvas, ImageCanvas, MlResultDialog, ProgressCircularDialog }
};

</script>
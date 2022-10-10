<template>
  <v-dialog
    transition="dialog-bottom-transition"
    v-model="dialog"
    :max-width="$store.state.isMobile ? 2000 : 900"
  >
    <v-card>
      <v-toolbar
        color="info"
        dark
      >
        <v-icon large class="mx-1">mdi-robot</v-icon>
        <span class="text-h6 my-auto">Image Classfier Result</span>
      </v-toolbar>
      <v-card-text>
        <v-container fluid>
          <apexchart type="bar" :options="chartData.options" :series="chartData.series" :height="chartData.height"></apexchart>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name:"ImgClassDialog",
    data(){
      return {
        dialog:false,
        chartData:{}
      }
    },
    computed:{
      maxWidth(){
        return this.$store.state.isMobile ? 2000 : 1000;
      }
    },  
    methods:{
      showDialog(chartData){
        this.chartData = {options:{}, series:[], height:chartData.height}, this.dialog = true;
        const self = this;
        setTimeout(() => self.chartData = chartData, 300);
      }
    }
  }
</script>
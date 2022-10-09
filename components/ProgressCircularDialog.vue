<template>
  <v-dialog persistent v-model="dialog" :max-width="$store.state.isMobile ? 2000 : 300">
    <v-card>
      <v-container>
        <v-row align="center" justify="center">
          <v-progress-circular
            :rotate="-90"
            :width="15"
            :size="100"
            :value="showValue"
            :color="color"
          >
            {{ showValue }}
          </v-progress-circular>
        </v-row>
        <v-row align="center" justify="center">
          {{ loadingTxt }}
        </v-row>
      </v-container>
    </v-card>
    
  </v-dialog>
</template>

<script>
  export default {
    name:"ProgressCircularDialog",
    props:{
      val:{
        type:Number,
        required:false,
        default:0
      },
      color:{
        type:String,
        required:false,
        default:"teal"
      }
    },
    data(){
      return {
        dialog:false,
        value:0,
        loadingTxt:"Loading..."
      }
    },
    computed:{
      showValue(){
        return this.val < this.value ? this.value : this.val;
      }
    },
    methods:{
      showDialog(loadingTxt){
        this.value = 0;
        this.loadingTxt = loadingTxt ? loadingTxt : "Loading...";
        this.dialog = true;
      },
      changeProgress(value){
        this.value = value;
      },
      closeDialog(){
        this.dialog = false;
      }
    }
  }

</script>
<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="300"
      color="cyan"
    >
      <v-card color="primary">
        <v-card-text class="py-0">
          <LottiePlayer
            class="my-0"
            :animation-data="anime1"
            :speed="1.5"
            :loop="true" />
          <!-- <LottiePlayer
            class="my-0"
            :animation-data="anime2"
            :speed="1.5"
            :loop="true" /> -->
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import LottiePlayer from './LottiePlayer.vue';
import LoadAnime1 from "@/assets/animation/60796-robohead-loading.json"
// import LoadAnime2 from "@/assets/animation/24344-retro-loading-bar.json"
  export default {
    props: {
        dialog: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    data(){
      return {
        anime1:LoadAnime1,
        // anime2:LoadAnime2,
      }
    },
    mounted(){
      // if(!this.anim1 || !this.anim2){
      //   let objAnim = {loadAnim1:null, loadAnim2:null};
      //   objAnim.loadAnim1 = LoadAnime1;
      //   objAnim.loadAnim2 = LoadAnime2;
      //   this.$store.commit("loadAnimData", objAnim);
      // }
      // this.anime1 = require("@/assets/animation/60796-robohead-loading.json");
      // this.anime2 = require("@/assets/animation/24344-retro-loading-bar.json");
    },
    components: { LottiePlayer }
}
</script>
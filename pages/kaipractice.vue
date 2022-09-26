<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" ref="freeCanvasColumn">
        <FreeCanvas ref="freeCanvas" />
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import FreeCanvas from '~/components/FreeCanvas.vue';
  export default {
    name: "MachineLearnings",
    data(){
      return {

      }
    },
    computed:{

    },
    methods: {
      handleResize: function() {
        this.$store.commit("changeScreen");// for testing only
        this.createFreeCanvas();
      },
      createFreeCanvas(){
        let fc = this.$refs.freeCanvas;
        fc.resetMyCanvas(this.getCanvasWidth());
      },
      getCanvasWidth(){
        let windowWidth = window.innerWidth-60;
        let colWidth = this.$refs.freeCanvasColumn.clientWidth;
        return Math.min(windowWidth, colWidth);
      }
    },
    mounted: function () {
      window.addEventListener('resize', this.handleResize);
      this.createFreeCanvas();
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.handleResize)
    },
    components: { FreeCanvas }
};

</script>
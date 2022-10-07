<template>
  <div id="lottie" ref="lottie"></div>
</template>

<script>
export default {
  props:{
    animationData:{
      type: Object,
      required: false
    },
    loop: {
      type: Boolean,
      required: false,
      default: true
    },
    speed: {
      type: Number,
      required: false,
      default: 1
    }
  }, 
  data() {
    return {
      animation: null,
      lottie:null
    };
  },
  mounted() {
    this.loadAnimation();
  },
  methods: {
    async loadAnimation() {
      this.lottie = await import('lottie-web').then(module => module.default);
      //this.animationData = await import('~/path/to/animationData.json');
      const self = this;
      this.$nextTick(() => {
        self.animation = self.lottie.loadAnimation({
          animationData:self.animationData,
          loop:self.loop,
          autoplay:true,
          renderer:'svg',
          container:self.$refs.lottie,
          rendererSettings : {
            progressiveLoad: false,
          },
        });
        self.lottie.setSpeed(self.speed);
        self.animation.onComplete = self.onComplete;
      });
    },
    onComplete() {
      this.$emit("on-complete");
    },
  },
  beforeDestroy () {
    if (this.lottie) {
      this.lottie.destroy();
      this.lottie = null;
    }
    if (this.animation) {
      this.animation.stop();
      this.animation.destroy();
      this.animation = null;
    }
  },
};
</script>
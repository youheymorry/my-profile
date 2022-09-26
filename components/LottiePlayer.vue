<template>
  <div id="lottie" ref="lottie"></div>
</template>

<script>
import lottie from 'lottie-web';

export default {
  props:{
    animationData:{
      type: Object,
      required: true
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
    };
  },
  mounted() {
    this.loadAnimation();
    this.animation.onComplete = this.onComplete;
  },
  methods: {
    loadAnimation() {
      this.animation = lottie.loadAnimation({
        container: this.$refs.lottie,
        renderer: 'svg',
        loop: this.loop,
        autoplay: true,
        animationData:this.animationData,
      });
      lottie.setSpeed(this.speed);
    },
    onComplete() {
      this.$emit("on-complete");
    },
  },
};
</script>
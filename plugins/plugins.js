import Vue from 'vue';
// *** bootstrap-vue
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// *** ApexCharts
import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

// // *** Lottie Player
// import LottieVuePlayer from "@lottiefiles/vue-lottie-player";
// Vue.use(LottieVuePlayer);

// // *** Lottie Web Vue
// import LottieAnimation from 'lottie-web-vue'
// Vue.use(LottieAnimation); // add lottie-animation to your global scope
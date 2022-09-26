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
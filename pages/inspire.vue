<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6">
        <apexchart width="500" type="bar" :options="chartData.options" :series="chartData.series"></apexchart>
      </v-col>
      <v-col cols="12" sm="6">
        <apexchart width="500" type="line" :options="chartData.options" :series="chartData.series"></apexchart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'InspirePage',
  data(){
    return {

    }
  },
  computed:{
    chartData(){
      let options = {};
      options.chart = {
        id:'vuechart-example'
      };
      options.xaxis = {
        categories : [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
      };
      let series = [];
      series.push({
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      });
      return {options:options, series:series};
    }
  }
}
</script>

<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8">
        <apexchart type="candlestick" :options="chartData.options" :series="chartData.series"></apexchart>
      </v-col>
    </v-row>
    {{String(new Date(1663930493))}}
  </v-container>
</template>

<script>
export default {
  name: 'CurrencyPage',
  data(){
    return {
      usdjpy:[]
    }
  },
  methods:{
    getUsdJpy:async function(){
      const self = this;
      let url = "https://economia.awesomeapi.com.br/json/daily/USD-JPY/30";
      const res = await this.$axios.get(url)
        .then(function(response){
          let data = response.data;
          data = data.sort((a, b) => a.timestamp - b.timestamp);
          self.usdjpy = data
          console.log(data);
        })
        .catch(function(error){
          console.log(error);
        });
    },
    convertToSimpleDate(date){
      let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec"];
      return months[date.getMonth()] + date.getDate();
    }
  },
  computed:{
    chartData(){
      let options = {};
      options.theme = {mode:"dark"};
      let cdata = []; 
      this.usdjpy.forEach(obj => {
        var date = new Date(Number(obj.timestamp + "000"));
        cdata.push({x:this.convertToSimpleDate(date), y:[obj.ask, obj.high, obj.low, obj.bid+1]})
      });
      let series = [
        {name:"USD/JPY", data:cdata}
      ];
      return {options:options, series:series};
    }
  },
  mounted(){
    this.getUsdJpy();
  }
}
</script>

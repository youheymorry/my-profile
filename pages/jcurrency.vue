<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="6" sm="4">
        <v-select
          :items="currencies"
          return-object
          item-text="symbol"
          v-model="baseCurrency"
          label="Base Currency"
          :prepend-icon="baseCurrency.icon"
        ></v-select>
      </v-col>
      <v-col cols="6" sm="4">
        <v-select
          :items="currencies.filter(item => item.symbol !== baseCurrency.symbol)"
          return-object
          item-text="symbol"
          v-model="targetCurrency"
          label="Target Currency"
          :prepend-icon="targetCurrency.icon"
          color="cyan"
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8">
        <apexchart type="line" :options="chartData.options" :series="chartData.series"></apexchart>
      </v-col>
    </v-row>
    <SimpleLoader :dialog="loading" />
  </v-container>
</template>

<script>
import SimpleLoader from '~/components/SimpleLoader.vue';
export default {
    name: "CurrencyPage",
    data() {
        return {
            currencies: [
              {symbol:"USD", icon:"mdi-currency-usd"}, 
              {symbol:"EUR", icon:"mdi-currency-eur"},
              {symbol:"GBP", icon:"mdi-currency-gbp"},
              {symbol:"CHF", icon:"mdi-currency-fra"},
              {symbol:"JPY", icon:"mdi-currency-jpy"},
              {symbol:"CNY", icon:"mdi-currency-cny"}
            ],
            stackData:[],
            currencyData: [],
            baseCurrency: {symbol:"USD", icon:"mdi-currency-usd"},
            targetCurrency: {symbol:"JPY", icon:"mdi-currency-jpy"},
            num_of_days: 30,
            loading:false,
        };
    },
    methods: {
        getCurrencyData: async function () {
            this.loading = true;
            const self = this;
            let startDate = new Date(), endDate = new Date();
            startDate.setDate(startDate.getDate() - this.num_of_days);
            let url = "https://api.exchangerate.host/timeseries?base=" + this.baseCurrency.symbol;
            url += "&start_date=" + formatDate(startDate, "yyyy-MM-dd");
            url += "&end_date=" + formatDate(endDate, "yyyy-MM-dd");
            const res = await this.$axios.get(url)
              .then(function (response) {
                let convData = [];
                let rates = response.data.rates, targetDate = startDate;
                for (var i = 0; i < self.num_of_days; i++) {
                    var plusDay = i === 0 ? 0 : 1;
                    targetDate.setDate(targetDate.getDate() + plusDay);
                    var d = formatDate(targetDate, "yyyy-MM-dd");
                    var curData = rates[d];
                    if (curData) convData.push({ date: convertToSimpleDate(targetDate), data: curData });
                }
                //console.log(convData);
                self.currencyData = convData;
            })
              .catch(function (error) {
                console.log(error);
            })
              .finally(function() {
                self.loading = false;
            });
        },
    },
    computed: {
        chartData() {
            let bSymbol = this.baseCurrency.symbol;
            let tSymbol = this.targetCurrency ? this.targetCurrency.symbol : null;
            if(!tSymbol || tSymbol === bSymbol) {
              this.targetCurrency = this.currencies.filter(cur => cur.symbol !== bSymbol)[0];
              tSymbol = this.targetCurrency.symbol;
            }
            let xdata = [], ydata = [];
            this.currencyData.forEach(obj => {
                xdata.push(obj.date);
                var myData = obj.data[tSymbol];
                myData = myData ? myData : 0;
                ydata.push(myData);
            });
            let series = [{ name: bSymbol + "/" + tSymbol, data: ydata }];
            let options = {};
            options.theme = { mode: "dark" };
            options.xaxis = { categories: xdata };
            return { options: options, series: series };
        }
    },
    mounted() {
        this.getCurrencyData();
    },
    watch: {
        baseCurrency() {
            this.getCurrencyData();
        }
    },
    components: { SimpleLoader }
}

function formatDate(date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format;
};

function convertToSimpleDate(date){
  let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec"];
  return months[date.getMonth()] + date.getDate();
}

</script>

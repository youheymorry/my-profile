<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <h2><span class="text-info">Forex</span></h2>
    </v-row>
    <v-row justify="center" align="center">  
      <v-col cols="6" sm="4">
        <v-select
          :items="currencies"
          return-object
          item-text="symbol"
          v-model="baseCurrency"
          label="Base Currency"
          :prepend-icon="baseCurrency.icon"
          hide-details
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
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8">
        <apexchart type="line" :height="chartHeight" :options="forexChart.options" :series="forexChart.series"></apexchart>
      </v-col>
    </v-row>

    <v-divider />

    <v-row justify="center" align="center">
      <h2><span class="text-success">BTC</span>-<span class="text-danger">ETH</span>/USD</h2>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8">
        <apexchart type="line" :height="chartHeight" :options="cryptoChart.options" :series="cryptoChart.series"></apexchart>
      </v-col>
    </v-row>

    <v-divider />

    <v-row justify="center" align="center">
      <h2><span class="text-success">BTC</span>/<span class="text-danger">ETH</span></h2>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8">
        <apexchart type="candlestick" :height="chartHeight" :options="candleData.options" :series="candleData.series"></apexchart>
      </v-col>
    </v-row>
    <ProgressCircularDialog ref="progressCircularDialog" color="primary" />
  </v-container>
</template>

<script>
import ProgressCircularDialog from '~/components/ProgressCircularDialog.vue';
// import SimpleLoader from '~/components/SimpleLoader.vue';
export default {
    name: "CurrencyPage",
    data() {
        return {
            currencies: [
                { symbol: "USD", icon: "mdi-currency-usd" },
                { symbol: "EUR", icon: "mdi-currency-eur" },
                { symbol: "GBP", icon: "mdi-currency-gbp" },
                { symbol: "CHF", icon: "mdi-currency-fra" },
                { symbol: "JPY", icon: "mdi-currency-jpy" },
                { symbol: "CNY", icon: "mdi-currency-cny" }
            ],
            currencyData: [],
            baseCurrency: { symbol: "USD", icon: "mdi-currency-usd" },
            targetCurrency: { symbol: "JPY", icon: "mdi-currency-jpy" },
            num_of_days: 30,
            cryptoData: { btc: [], eth: [], btceth: [] },
            loadingForex: false,
            loadingBtc: false,
            loadingEth: false,
            loadingBtcEth: false,
        };
    },
    methods: {
        getForexData: async function () {
            this.loadingForex = true;
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
                    if (curData)
                        convData.push({ date: convertToSimpleDate(targetDate), data: curData, time: targetDate.getTime() });
                }
                //console.log(convData);
                self.currencyData = convData;
            })
                .catch(function (error) {
                console.log(error);
            })
                .finally(function () {
                self.loadingForex = false;
                self.changeProgressLoader(self.loadingProgress);
            });
        },
        getBtcData: async function () {
            this.loadingBtc = true;
            const self = this;
            let url = "https://api.coincap.io/v2/assets/bitcoin/history?interval=d1";
            const res = await this.$axios.get(url)
                .then(function (response) {
                //console.log(response.data);
                self.cryptoData.btc = response.data.data;
            })
                .catch(function (error) {
                console.log(error);
            })
                .finally(function () {
                self.loadingBtc = false;
                self.changeProgressLoader(self.loadingProgress);
            });
        },
        getEthData: async function () {
            this.loadingEth = true;
            const self = this;
            let url = "https://api.coincap.io/v2/assets/ethereum/history?interval=d1";
            const res = await this.$axios.get(url)
                .then(function (response) {
                //console.log(response.data);
                self.cryptoData.eth = response.data.data;
            })
                .catch(function (error) {
                console.log(error);
            })
                .finally(function () {
                self.loadingEth = false;
                self.changeProgressLoader(self.loadingProgress);
            });
        },
        getBtcEthData: async function () {
            this.loadingBtcEth = true;
            const self = this;
            let url = "https://api.coincap.io/v2/candles?exchange=poloniex&interval=w1&baseId=ethereum&quoteId=bitcoin";
            const res = await this.$axios.get(url)
                .then(function (response) {
                //console.log(response.data);
                self.cryptoData.btceth = response.data.data;
            })
                .catch(function (error) {
                console.log(error);
            })
                .finally(function () {
                self.loadingBtcEth = false;
                self.changeProgressLoader(self.loadingProgress);
            });
        },
        showProgressLoader(loadingTxt){
            const prDialog = this.$refs.progressCircularDialog;
            prDialog.showDialog(loadingTxt);
        },
        changeProgressLoader(val){
            const prDialog = this.$refs.progressCircularDialog;
            prDialog.changeProgress(val);
            if(val === 100) this.closeProgressLoader();
        },
        closeProgressLoader(){
            const prDialog = this.$refs.progressCircularDialog;
            setTimeout(() => prDialog.closeDialog(), 350);
        }
    },
    computed: {
        forexChart() {
            let bSymbol = this.baseCurrency.symbol;
            let tSymbol = this.targetCurrency ? this.targetCurrency.symbol : null;
            if (!tSymbol || tSymbol === bSymbol) {
                this.targetCurrency = this.currencies.filter(cur => cur.symbol !== bSymbol)[0];
                tSymbol = this.targetCurrency.symbol;
            }
            let gdata = [];
            this.currencyData.forEach(obj => {
                var myData = obj.data[tSymbol];
                myData = myData ? myData : 0;
                gdata.push({ x: obj.time, y: myData });
            });
            let series = [{ name: bSymbol + "/" + tSymbol, data: gdata }];
            let options = {};
            options.theme = { mode: "dark" };
            options.xaxis = { type: "datetime" };
            return { options: options, series: series };
        },
        cryptoChart() {
            let btcData = [], ethData = [];
            this.cryptoData.btc.forEach(item => {
                btcData.push({ x: item.time, y: Math.round(item.priceUsd) });
            });
            this.cryptoData.eth.forEach(item => {
                ethData.push({ x: item.time, y: Math.round(item.priceUsd) });
            });
            let series = [];
            series.push({ name: "BTC/USD", data: btcData });
            series.push({ name: "ETH/USD", data: ethData });
            let options = {};
            options.theme = { mode: "dark" };
            options.xaxis = { type: "datetime" };
            options.colors = ["#28a745", "#dc3545"];
            let formatter = function (val) {
                return Number(val).toLocaleString();
            };
            options.yaxis = [];
            let btcAxis = {
                axisTicks: { show: true },
                axisBorder: {
                    show: true,
                    color: options.colors[0]
                },
                labels: {
                    style: { color: options.colors[0] },
                    formatter: formatter
                },
                title: {
                    text: "BTC/USD",
                    style: { color: options.colors[0] }
                }
            };
            let ethAxis = {
                opposite: true,
                axisTicks: { show: true },
                axisBorder: {
                    show: true,
                    color: options.colors[1]
                },
                labels: {
                    style: { color: options.colors[1] },
                    formatter: formatter
                },
                title: {
                    text: "ETH/USD",
                    style: { color: options.colors[1] }
                }
            };
            options.yaxis = [btcAxis, ethAxis];
            return { options: options, series: series };
        },
        candleData() {
            let gdata = [];
            let btcethData = this.cryptoData.btceth;
            btcethData = btcethData.slice(-30);
            btcethData.forEach(obj => {
                var xdata = obj.period;
                var ydata = [obj.open, obj.high, obj.low, obj.close];
                gdata.push({ x: xdata, y: ydata });
            });
            let series = [{ name: "BTC/ETH", data: gdata }];
            let options = {};
            options.theme = { mode: "dark" };
            options.xaxis = { type: "datetime" };
            return { options: options, series: series };
        },
        chartHeight() {
            return this.$store.state.isMobile ? 400 : 500;
        },
        loadingProgress() {
            var val = 0;
            var loads = [this.loadingForex, this.loadingBtc, this.loadingEth, this.loadingBtcEth];
            loads.forEach(load => {
              if(!load) val += Math.round(100/loads.length);
            });
            return val;
        }
    },
    mounted() {
        this.showProgressLoader("Loading Currency Data...");
        this.getForexData();
        this.getBtcData();
        this.getEthData();
        this.getBtcEthData();
    },
    watch: {
        baseCurrency() {
            this.changeProgressLoader(0);
            this.showProgressLoader("Loading Currency Data...");
            this.getForexData();
        },
    },
    components: { ProgressCircularDialog }
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

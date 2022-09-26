<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="5" sm="3">
        <LottiePlayer
          :animation-data="animationData"
          :speed="1.5"
          :loop="true"/>
      </v-col>
      <v-col cols="7" sm="6">
        <div class="subtitle my-3">
          Hello I am
        </div>
        <h2 class="subheading">
          <v-avatar>
            <img
              src="@/static/japan.png"
              alt="JP"
            >
          </v-avatar>
          Yuhei Morimoto
        </h2>
        <v-card class="text-success font-weight-bold mb-3">
          Frontend & App Developer / Mechanical Application & Sales Engineer
        </v-card>
        <h2>
          <v-tooltip bottom v-for="(item, i) in scrLangs" :key="i">
            <template v-slot:activator="{ on, attrs }">
              <v-icon :large="!isMobile" :color="item.color" v-bind="attrs" v-on="on">
                {{item.icon}}
              </v-icon>
            </template>
            <span>{{item.name}}</span>
          </v-tooltip>
        </h2>
      </v-col>
    </v-row>
    <v-row v-for="(item, i) in scrLangs" :key="i" justify="center" align="center">
      <v-col cols="12" sm="8">
        <span class="text-subtitle"><v-icon large class="mr-1" :color="item.color">{{item.icon}}</v-icon>{{item.name}}</span>
        <v-progress-linear
          color="blue"
          height="15"
          :value="item.score"
          striped
        ></v-progress-linear>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8">
        <v-timeline :dense="$store.state.isMobile">
          <v-timeline-item
            v-for="(item, i) in timeLines"
            :key="i"
            :color="item.color"
            small
          >
            <template v-slot:opposite>
              <span
                :class="`headline font-weight-bold ${item.color}--text`"
                v-text="item.year"
              ></span>
            </template>
            <div class="py-4">
              <h2 :class="`headline font-weight-light mb-4 ${item.color}--text`">
                <span v-show="$store.state.isMobile" v-text="item.year" class="mr-2"></span>
                <span>{{item.title}}</span>
              </h2>
              <div v-html="item.description" />
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import animationData from "@/assets/animation/38825-robot-hello.json"
import LottiePlayer from "~/components/LottiePlayer.vue";

export default {
    name: "IndexPage",
    data() {
        return {
            animationData: animationData,
            scrLangs:[
              {icon:"mdi-vuejs", name:"Vue", color:"green", score:0},
              {icon:"mdi-language-javascript", name:"Javascript", color:"yellow", score:0},
              {icon:"mdi-language-java", name:"Java", color:"red", score:0},
              {icon:"mdi-database-search", name:"SQL", color:"white", score:0},
              {icon:"mdi-language-python", name:"Python", color:"purple", score:0},
              {icon:"mdi-language-html5", name:"HTML5", color:"grey", score:0},
              {icon:"mdi-language-css3", name:"CSS3", color:"grey", score:0},
              {icon:"mdi-google-spreadsheet", name:"Google App Script", color:"grey", score:0},
              {icon:"mdi-microsoft-excel", name:"Visual Basic for Applications", color:"grey", score:0},
            ],
            maxScores:[90, 80, 60, 50, 40, 70, 60, 100, 100],
            timeLines: [
              {color: 'cyan', year: 'Mar. 2015', title:"University Graduation",
                description:`
                  Graduated from Ryukoku University in Japan, Master's Degree of Mechanical Engineering.
                  <a class="mx-1" target="_blank" href="https://www.ryukoku.ac.jp/english2/">Link</a>
                `
              },
              {color: 'green', year: 'Apr. 2015', title:"Start a Career",
                description:`
                  Started working as a Sales Engineer at Torishima Pump MFG. Co., Ltd.
                  <a class="mx-1" target="_blank" href="https://www.torishima.co.jp/en/">Link</a>
                `
              },
              {color: 'pink', year: 'Apr. 2018', title:"Work Style Reform Project",
                description:`
                  Joined the Work-Style-Reform-Project team and stated developing/improving applications and systems for the internal work process. (Concurrent)
                `
              },
              {color: 'amber', year: 'Apr. 2022', title:"Application Engineer",
                description:`
                  Transferred to a different department and started working as an Application Engineer.
                `
              },
            ],
            isMobile:this.$store.state.isMobile,
        };
    },
    methods:{
      setUpScores(){
        for(let i=0; i<this.scrLangs.length; i++){
          this.scrLangs[i].score = this.maxScores[i];
        }
      }
    },
    mounted(){
      let self = this;
      setTimeout(() => {self.setUpScores()}, 1);
    },
    components: { LottiePlayer }
}
</script>

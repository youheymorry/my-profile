<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer" 
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          replace
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :app="launched"
      color="blue darken-3"
      v-show="launched"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-icon class="mx-2">{{currentPage.icon}}</v-icon>
      <v-toolbar-title v-text="currentPage.title" />
      <v-spacer />
      <v-btn icon>
        <v-avatar>
          <img
            src="@/static/propic.png"
            alt="YM"
          >
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-row v-if="!launched">
          <v-col cols="12">
            <LottiePlayer 
              :animation-data="animationData"
              :speed="2"
              :loop="false"
              @on-complete="onCompleteAnim"/>
          </v-col>
        </v-row>
        <Nuxt v-else/>
      </v-container>
    </v-main>
    <v-footer v-show="launched"
      
    >
      <span>Powered by Nuxt JS</span>
    </v-footer>
  </v-app>
</template>

<script>
import LottiePlayer from "../components/LottiePlayer.vue";
import animationData from "@/assets/animation/yellow-welcome.json"

export default {
    name: "DefaultLayout",
    data() {
        return {
            launched: false,
            title: "My Portfolio",
            animationData:animationData,
            drawer: false,
            clipped: true,
            fixed: false,
            items: [
                {
                    icon: "mdi-account-box",
                    title: "About Me",
                    to: "/"
                },
                {
                    icon: "mdi-chart-bubble",
                    title: "Currency Charts",
                    to: "/jcurrency"
                },
                {
                    icon: "mdi-folder",
                    title: "Machine Learning",
                    to: "/kaipractice"
                }
            ],
        };
    },
    computed: {
        currentPage() {
            let currentPath = this.$route.path;
            let myItem = this.items.filter(obj => obj.to === currentPath)[0];
            return myItem ? myItem : this.items[0];
        }
    },
    methods:{
      onCompleteAnim(){
        this.launched = true;
      }
    },  
    mounted() {
    },
    components: { LottiePlayer }
}
</script>

<style scoped>
  .bg-img {
    background-image: url("@/static/propic.png");
  }
</style>
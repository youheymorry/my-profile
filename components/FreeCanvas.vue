<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" :color="canvasProps.stWeight === 8 ? 'info' : ''" @click="setCanvasProps(null, null, true)">
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>
      </template>
      Bold Font
    </v-tooltip>
    
    <v-tooltip top>
      <template #activator="tooltip">
        <v-menu offset-y color="white" v-model="penColorMenuOpen">
          <template #activator="menu">
            <v-btn v-on="{...tooltip.on, ...menu.on}" color="white">
              <v-icon :color="canvasProps.stColor">mdi-grease-pencil</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in colors"
              :key="index"
              @click="setCanvasProps(null, item, null)"
            >
              <v-list-item-title>
                <v-icon :color="item" class="mr-1">mdi-grease-pencil</v-icon>
                <span>{{item}}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      Font Color
    </v-tooltip>
    <v-tooltip top>
      <template #activator="tooltip">
        <v-btn v-on="{...tooltip.on}" color="red" @click="sketch.background('white')">
          <v-icon>mdi-eraser</v-icon>
        </v-btn>
      </template>
      Clear Canvas
    </v-tooltip>
    <vue-p5 v-on="{setup, draw, touchStarted}"></vue-p5>
  </div>
    
</template>

<script>
import VueP5 from "vue-p5";
export default {
  name:"VueP5",
  data(){
    return {
      sketch:null,
      isCreated:false,
      writingMode:false,
      canvasProps:{bgColor:"white", stColor:"black", stWeight:4, width:400, height:400},
      colors:["black", "red", "blue", "green", "orange", "cyan"],
      penColorMenuOpen:false
    }
  },
  methods: {
    setup(sk) {
      this.sketch = sk;
    },
    resetMyCanvas(width, height=400){//custom
      if(!width) width = this.canvasProps.width;
      this.isCreated ? this.sketch.resizeCanvas(width+1, height) : this.sketch.createCanvas(width, height);
      this.sketch.background(this.canvasProps.bgColor);
      this.sketch.stroke(this.canvasProps.stColor), this.sketch.strokeWeight(this.canvasProps.stWeight);
      this.isCreated = true, this.canvasProps.width = width;
    },
    setCanvasProps(bgColor, stColor, stWeight){
      this.writingMode = false;
      if(bgColor) {
        this.canvasProps.bgColor = bgColor;
        this.sketch.background(this.canvasProps.bgColor);
      }
      if(stColor) {
        this.canvasProps.stColor = stColor;
        this.sketch.stroke(this.canvasProps.stColor);
      }
      if(stWeight) {
        this.canvasProps.stWeight = this.canvasProps.stWeight === 4 ? 8 : 4;
        this.sketch.strokeWeight(this.canvasProps.stWeight);
      }
    },
    draw() {
      let sk = this.sketch;
      if((sk.mouseIsPressed || this.writingMode) && !this.penColorMenuOpen){
        sk.line(sk.pmouseX, sk.pmouseY, sk.mouseX, sk.mouseY);
      }else{
        this.writingMode = false;
      }
    },
    touchStarted(){
      this.writingMode = true;
      this.draw(this.sketch);
    },
    testFunc(val){
      alert(val);
    }
  },
  components:{ "vue-p5":VueP5 }
};
</script>
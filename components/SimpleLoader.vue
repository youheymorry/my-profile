<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      width="300"
    >
      <v-card
        color="purple"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name:"SimpleLoader",
    props:{
      dialog:{
        type:Boolean,
        required:true,
        default:false
      }
    },
  }
</script>
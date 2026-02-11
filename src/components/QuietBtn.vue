<script setup lang="ts">
import { ref } from 'vue'
import hornOn from '../assets/icons/horn-on.svg'
import hornOff from '../assets/icons/horn-off.svg'
import { EventCenter } from '../eventCenter'

let isQuiet = false

const btnColor = ref("primary")

const btnIcon = ref(hornOn)

function quiet() {
  isQuiet = !isQuiet
  EventCenter.instance.emit("quiet", isQuiet)
  if (isQuiet) {
    btnColor.value = "success"
    btnIcon.value = hornOff
  } else {
    btnColor.value = "primary"
    btnIcon.value = hornOn
  }
}

</script>

<template>
  <v-fab icon="" @click="quiet" :color="btnColor">
    <img :src="btnIcon" alt="btn-icon" width="25" height="25">
  </v-fab>
</template>

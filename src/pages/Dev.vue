<script setup lang="ts">
import * as hap from '@tauri-apps/plugin-haptics'
import { Ref, ref } from 'vue';
// import * as not from '@tauri-apps/plugin-notification'

const impactFeedbackStyle: Ref<hap.ImpactFeedbackStyle> = ref('medium')

async function impactFeedback() {
  await hap.impactFeedback(impactFeedbackStyle.value)
}

const notificationFeedbackType: Ref<hap.NotificationFeedbackType> = ref('warning')

async function notificationFeedback() {
  await hap.notificationFeedback(notificationFeedbackType.value)
}

async function selectionFeedback() {
  await hap.selectionFeedback()
}

const vibrateDuration: Ref<number> = ref(1)

async function vibrate() {
  await hap.vibrate(vibrateDuration.value)
}

</script>

<style scoped>
.btn-container {
  display: flex;
  width: 100vw;
  height: auto;
  position: absolute;
  top: 20px;
  gap: 10px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.data {
  width: 80vw;
}

</style>

<template>
  <div class="btn-container">
    <v-btn class="data" @click="impactFeedback">impactFeedback</v-btn>
    <v-btn class="data" @click="notificationFeedback">notificationFeedback</v-btn>
    <v-btn class="data" @click="selectionFeedback">selectionFeedback</v-btn>
    <v-btn class="data" @click="vibrate">vibrate</v-btn>
    <v-select
      label="impactFeedbackStyle"
      class="data"
      :items="['light', 'medium', 'heavy', 'soft', 'rigid']"
      v-model="impactFeedbackStyle"
    ></v-select>
    <v-select
      label="notificationFeedbackType"
      class="data"
      :items="['success', 'warning', 'error']"
      v-model="notificationFeedbackType"
    ></v-select>
    <v-number-input
      label="vibrateDuration"
      class="data"
      :min="0"
      v-model="vibrateDuration"
    ></v-number-input>
  </div>
</template>

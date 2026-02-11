<script setup lang="ts">
// import { fetch } from '@tauri-apps/plugin-http'
import { ref } from 'vue'

const props = defineProps<{
  characterName: string
  backgroundColor?: string
  cardText?: string
}>()

const charPortraitUrl = ref("")

async function getCharPortraitUrl(title: string, prefix: boolean = true) {
  let charName: string | null = null
  if (prefix) {
    charName = title.replace("EVE - ", "")
  } else {
    charName = title
  }
  const id = (await (await fetch("https://esi.evetech.net/universe/ids", {
    method: "POST",
    body: JSON.stringify([charName])
  })).json()).characters[0].id
  const portraitUrl = `https://images.evetech.net/characters/${id}/portrait?tenant=tranquility&size=128`
  return portraitUrl
}

getCharPortraitUrl(props.characterName).then(url => charPortraitUrl.value = url)

</script>

<template>
  <v-card class="card" :title="characterName" :append-avatar="charPortraitUrl" :style="{ '--background-color': backgroundColor ?? 'white' }" :text="cardText ?? ''"></v-card>
</template>

<style scoped>
.card {
  width: 80vw;
  background-color: var(--background-color);
}

</style>


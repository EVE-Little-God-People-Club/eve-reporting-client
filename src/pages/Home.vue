<template>
  <div class="view">
    <character-card character-name="EVE - BOOOOM BOM" background-color="white" card-text="赛博炒鸡保佑我代码一遍过">
    </character-card>
    <character-card v-for="char in characters" :character-name="char.title" :background-color="char.backgroundColor" :card-text="char.cardText"></character-card>
  </div>
  <quiet-btn class="quiet-btn"></quiet-btn>
</template>

<style scoped>

.view {
	position: absolute;
	top: 20px;
	height: auto;
	width: 100vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
  gap: 10px;
}

.quiet-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

</style>

<script setup lang="ts">
import { Ref, ref } from 'vue'
import CharacterCard from '../components/CharacterCard.vue'
import QuietBtn from '../components/QuietBtn.vue'
import { EventCenter } from '../eventCenter'
import { EventReceiverManager } from '../event'

interface CharacterState {
	title: string
	backgroundColor: string
	cardText: string
}

const characters: Ref<CharacterState[]> = ref(
  EventReceiverManager.instance.characters
    .map(t => {
      return {
        title: t,
        backgroundColor: "white",
        cardText: "Safe"
      }
    })
)

const charStateChangeTimer: Map<string, number> = new Map()

function changeCharState(charTitle: string, backgroundColor: string, cardText: string, time: number) {
  const timerId = charStateChangeTimer.get(charTitle)
  if (timerId) {
    return
  }
  const target = characters.value.find(char => char.title === charTitle)
  if (!target) return
  const rawBackgroundColor = target.backgroundColor
  const rawCardText = target.cardText
  target.backgroundColor = backgroundColor
  target.cardText = cardText
  charStateChangeTimer.set(charTitle, setTimeout(() => {
    target.backgroundColor = rawBackgroundColor
    target.cardText = rawCardText
    charStateChangeTimer.delete(charTitle)
  }, time))
}

EventCenter.instance.listen("warn", (arg: unknown) => {
  const title = arg as string
  changeCharState(title, "red", "Warn", 5000)
})

EventCenter.instance.listen("reminder", (arg: unknown) => {
  const title = arg as string
  changeCharState(title, "yellow", "Reminder", 5000)
})

EventCenter.instance.listen("event-receiver-open", (arg: unknown) => {
  const chars = arg as string[]
  characters.value = []
	chars.forEach(title => characters.value.push({
		title,
		backgroundColor: "white",
		cardText: "Safe"
	}))
})

</script>

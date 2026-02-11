<script setup lang="ts">
import { ref } from 'vue';
import { EventCenter } from './eventCenter'
import { getConfig } from './config'

const androidStatusBarHeightPx = ref(24)

getConfig().then(c => androidStatusBarHeightPx.value = c.statusBarHeightPx)

const appBarHeightPx = ref(70)

function refresh() {
	EventCenter.instance.emit("refresh")
}

</script>

<template>
	<v-app>
		<v-app-bar :elevation="2" :height="appBarHeightPx" absolute class="bar" :style="{ '--android-status-bar-height': androidStatusBarHeightPx + 'px' }">
			<v-app-bar-title><b><span class="title text">EVE <br/> Reporting Client</span></b></v-app-bar-title>
			<template #append>
				<div class="nav-div">
					<!-- <v-btn to="/dev"><span class="text">Dev</span></v-btn> -->
					<v-btn @click="refresh()"><span class="text">刷新</span></v-btn>
					<v-btn to="/settings"><span class="text">设置</span></v-btn>
					<v-btn to="/"><span class="text">主页</span></v-btn>
					<div class="space"></div>
				</div>
			</template>
		</v-app-bar>
		<v-main class="content" :style="{ '--content-start-top': androidStatusBarHeightPx + appBarHeightPx + 'px' }">
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<style scoped>

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

@font-face {
	font-family: 'AaTCKAZDD';
	src: url('./assets/fonts/AaTCKAZDD.eot');
	src: url('./assets/fonts/AaTCKAZDD.eot?#iefix') format('embedded-opentype'),
	url('./assets/fonts/AaTCKAZDD.woff2') format('woff2'),
	url('./assets/fonts/AaTCKAZDD.woff') format('woff'),
	url('./assets/fonts/AaTCKAZDD.ttf') format('truetype'),
	url('./assets/fonts/AaTCKAZDD.svg#AaTCKAZDD') format('svg');
}

* {
	margin: 0px;
	padding: 0px;
	user-select: none;
	font-family: 'AaTCKAZDD';
}

.content {
	position: absolute;
	top: var(--content-start-top);
}

.nav-div {
	display: flex;
	gap: 10px;
}

.space {
	width: 10px;
}

.title {
	font-size: 14px;
	line-height: 0px;
}

.bar {
	padding-top: var(--android-status-bar-height); /* 预留android状态栏空间 */
}

</style>


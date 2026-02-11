<script setup lang="ts">
import { reactive } from 'vue'
import { getRawConfig, RawConfig, saveConfig, getDefaultRawConfig } from '../config'
import { EventCenter } from '../eventCenter'

const rules = {
  required: (value: unknown) => (value !== undefined && value !== null) || 'Field is required',
}

let formData: RawConfig = reactive(getDefaultRawConfig())

getRawConfig().then(raw => {
  for (const k in raw) {
    (formData[k as keyof RawConfig] as RawConfig[keyof RawConfig]) = raw[k as keyof RawConfig]
  }
})

function submit(e: SubmitEvent) {
  e.preventDefault()

  saveConfig(formData).then(() => EventCenter.instance.emit("refresh"))
}

</script>

<template>
  <div class="view">
    <v-form class="form" id="form" @submit.prevent="submit">
      <div class="config-item">
        <v-number-input label="Status Bar Height (px)" hint="状态栏高度（px）" :min="0" class="item" v-model="formData.statusBarHeightPx" :rules="[rules.required]"></v-number-input>
        <v-text-field label="SSE URL" hint="SSE服务器地址" type="input" class="item" v-model="formData.sseUrl"></v-text-field>
        <v-switch class="item" label="开启通知提醒" v-model="formData.notificationEnabled"></v-switch>
        <div v-if="formData.notificationEnabled">
          <v-text-field class="item" label="警告通知标题" v-model="formData.warnNotificationTitle"></v-text-field>
          <v-text-field class="item" label="警告通知内容" v-model="formData.warnNotificationContent"></v-text-field>
          <v-text-field class="item" label="提醒通知标题" v-model="formData.reminderNotificationTitle"></v-text-field>
          <v-text-field class="item" label="提醒通知内容" v-model="formData.reminderNotificationContent"></v-text-field>
        </div>
        <v-switch class="item" label="开启震动提醒" v-model="formData.vibrateEnabled"></v-switch>
        <div v-if="formData.vibrateEnabled">
          <v-number-input :min="0" class="item" label="警告震动时间" hint="单位：毫秒（ms）" v-model="formData.warnVibrateTime"></v-number-input>
          <v-number-input :min="0" class="item" label="警告震动间隔" hint="单位：毫秒（ms）" v-model="formData.warnVibrateSpaceTime"></v-number-input>
          <v-number-input :min="0" class="item" label="提醒震动时间" hint="单位：毫秒（ms）" v-model="formData.reminderVibrateTime"></v-number-input>
          <v-number-input :min="0" class="item" label="提醒震动间隔" hint="单位：毫秒（ms）" v-model="formData.reminderVibrateSpaceTime"></v-number-input>
        </div>
        <div class="space-for-btn"></div>
      </div>
      <v-btn type="submit" class="submit">保存</v-btn>
    </v-form>
  </div>
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
}

.form {
  width: 80vw;
}

.item {
  width: 100%;
}

.submit {
  position: fixed;
  bottom: 20px;
  width: 80vw;
}

.space-for-btn {
  height: 60px;
}

</style>


import * as fs from '@tauri-apps/plugin-fs'
// import { EventCenter } from './eventCenter'

export interface RawConfig {
	sseUrl?: string
	statusBarHeightPx: number
	notificationEnabled: boolean
	warnNotificationTitle: string
	warnNotificationContent: string
	reminderNotificationTitle: string
	reminderNotificationContent: string
	vibrateEnabled: boolean
	warnVibrateSpaceTime: number
	warnVibrateTime: number
	reminderVibrateSpaceTime: number
	reminderVibrateTime: number
}

const defaultRawConfig: Readonly<RawConfig> = {
	statusBarHeightPx: 24,
	notificationEnabled: true,
	warnNotificationTitle: "Warn",
	warnNotificationContent: "Warn {{CHARACTER_TITLE}}",
	reminderNotificationTitle: "Reminder",
	reminderNotificationContent: "Reminder {{CHARACTER_TITLE}}",
	vibrateEnabled: true,
	warnVibrateSpaceTime: 200,
	warnVibrateTime: 1000,
	reminderVibrateSpaceTime: 100,
	reminderVibrateTime: 500
}

export function getDefaultRawConfig(): RawConfig {
	return defaultRawConfig
}

type ChangeType<Origin extends object, Override extends object> = {
	[K in keyof Origin]: K extends keyof Override ? Override[K] : Origin[K]
}

interface RawOverride {
	sseUrl: URL
}

export type Config = ChangeType<RawConfig, RawOverride>

// export interface Config {
// 	sseUrl: URL
// 	statusBarHeightPx: number
// 	notificationEnabled: boolean
// 	warnNotificationTitle: string
// 	warnNotificationContent: string
// 	reminderNotificationTitle: string
// 	reminderNotificationContent: string
// 	vibrateEnabled: boolean
// 	warnVibrateSpaceTime: number
// 	warnVibrateTime: number
// 	reminderVibrateSpaceTime: number
// 	reminderVibrateTime: number
// }

let configCache: RawConfig | null = null

// EventCenter.instance.listen("refresh", () => getRawConfig(true))

export function toConfig(raw: RawConfig): Config {
	return {
		...raw,
		sseUrl: new URL(raw.sseUrl ?? 'http://localhost:8080'),
	}
}

export async function getRawConfig(refresh: boolean = false) {
	if (configCache && !refresh) return configCache
	
	let raw: RawConfig
	
	try {
		if (!await fs.exists('config.json', {
			baseDir: fs.BaseDirectory.AppConfig
		})) {
			await fs.mkdir(".", {
				baseDir: fs.BaseDirectory.AppConfig
			})
			await fs.writeTextFile("config.json", JSON.stringify(defaultRawConfig), {
				baseDir: fs.BaseDirectory.AppConfig
			})
			raw = defaultRawConfig
		} else {
			raw = JSON.parse(await fs.readTextFile("config.json", {
				baseDir: fs.BaseDirectory.AppConfig
			}))
		}
	} catch {
		raw = defaultRawConfig
	}

	configCache = raw
	return raw
}

export async function getConfig() {
	return toConfig(await getRawConfig())
}

export async function saveConfig(raw: RawConfig) {
	configCache = raw
	await fs.writeTextFile("config.json", JSON.stringify(raw), {
		baseDir: fs.BaseDirectory.AppConfig
	})
}


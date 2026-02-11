import { Reportable } from "."
import * as not from '@tauri-apps/plugin-notification'

export class Notification implements Reportable {
  private timers: Map<string, number> = new Map()
  constructor(
    public warnNotificationTitle: string,
    public warnNotificationContent: string,
    public reminderNotificationTitle: string,
    public reminderNotificationContent: string
  ) {}

  public async requestPermission() {
    let permissionGranted = await not.isPermissionGranted();
    if (!permissionGranted) {
      const permission = await not.requestPermission();
      permissionGranted = permission === 'granted';
    }
    return permissionGranted
  }

  private checkTimer(timerKey: string) {
    const timerId = this.timers.get(timerKey)
    if (timerId) {
      clearTimeout(timerId)
      setTimeout(() => this.timers.delete(timerKey), 5000)
      return true
    } else {
      return false
    }
  }

  public async warn(title: string) {
    const timerKey = title + "/warn"
    if (this.checkTimer(timerKey)) {
      return
    }
    this.timers.set(timerKey, setTimeout(() => this.timers.delete(timerKey), 5000))
    if (await this.requestPermission()) {
      not.sendNotification({
        title: this.warnNotificationTitle,
        body: this.warnNotificationContent.replace("{{CHARACTER_TITLE}}", title)
      })
    }
  }

  public async reminder(title: string) {
    const timerKey = title + "/reminder"
    if (this.checkTimer(timerKey)) {
      return
    }
    this.timers.set(timerKey, setTimeout(() => this.timers.delete(timerKey), 5000))
    if (await this.requestPermission()) {
      not.sendNotification({
        title: this.reminderNotificationTitle,
        body: this.reminderNotificationContent.replace("{{CHARACTER_TITLE}}", title)
      })
    }
  }
}


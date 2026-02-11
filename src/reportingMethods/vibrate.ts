import { Reportable } from "."
import { vibrate } from "@tauri-apps/plugin-haptics"

interface Recall {
  isSpace: boolean
  isRecall: boolean
}

export class Vibrate implements Reportable {
  private isCalling = false
  private warnRecall: Recall = {
    isRecall: false,
    isSpace: false,
  }
  private reminderRecall: Recall = {
    isRecall: false,
    isSpace: false,
  }
  constructor(
    public warnVibrateSpaceTime: number,
    public warnVibrateTime: number,
    public reminderVibrateSpaceTime: number,
    public reminderVibrateTime: number
  ) {}

  public async warn(_title: string) {
    if (this.isCalling) {
      return
    }
    if (this.warnRecall.isSpace) {
      this.warnRecall.isRecall = true
      return
    }
    const start = async () => {
      this.isCalling = true
      await vibrate(this.warnVibrateTime)
      this.isCalling = false
      this.warnRecall.isSpace = true
      setTimeout(() => {
        this.warnRecall.isSpace = false
        if (this.warnRecall.isRecall) {
          this.warnRecall.isRecall = false
          start()
        }
      }, this.warnVibrateSpaceTime)
    }
    await start()
  }

  public async reminder(_title: string) {
    if (this.isCalling) {
      return
    }
    if (this.reminderRecall.isSpace) {
      this.reminderRecall.isRecall = true
      return
    }
    const start = async () => {
      this.isCalling = true
      await vibrate(this.reminderVibrateTime)
      this.isCalling = false
      this.reminderRecall.isSpace = true
      setTimeout(() => {
        this.reminderRecall.isSpace = false
        if (this.reminderRecall.isRecall) {
          this.reminderRecall.isRecall = false
          start()
        }
      }, this.reminderVibrateSpaceTime)
    }
    await start()
  }
}


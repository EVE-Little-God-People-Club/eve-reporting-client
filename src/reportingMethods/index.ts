import { EventCenter } from "../eventCenter"
import { getConfig } from "../config"
import { Notification } from "./notification"
import { Vibrate } from "./vibrate"

export interface Reportable {
  warn(title: string): unknown
  reminder(title: string): unknown
}

export class ReportingMethodsMediator {
  public static instance = new ReportingMethodsMediator()

  public isQuiet: boolean = false

  public reportMethods: Reportable[] = []

  private constructor() {
    EventCenter.instance.listen("quiet", (arg: unknown) => {
      const isQuiet = arg as boolean
      this.isQuiet = isQuiet
    })
    EventCenter.instance.listen("warn", (arg: unknown) => {
      const title = arg as string
      if (!this.isQuiet) {
        this.emitWarn(title)
      }
    })
    EventCenter.instance.listen("reminder", (arg: unknown) => {
      const title = arg as string
      if (!this.isQuiet) {
        this.emitReminder(title)
      }
    })
    EventCenter.instance.listen("refresh", () => this.refresh())
  }

  public refresh() {
    getConfig().then(cfg => {
      this.reportMethods = []
      if (cfg.notificationEnabled) {
        this.reportMethods.push(
          new Notification(
            cfg.warnNotificationTitle,
            cfg.warnNotificationContent,
            cfg.reminderNotificationTitle,
            cfg.reminderNotificationContent
          )
        )
      }
      if (cfg.vibrateEnabled) {
        this.reportMethods.push(
          new Vibrate(
            cfg.warnVibrateSpaceTime,
            cfg.warnVibrateTime,
            cfg.reminderVibrateSpaceTime,
            cfg.reminderVibrateTime
          )
        )
      }
    })
  }

  public addReportMethod(reportMethod: Reportable) {
    this.reportMethods.push(reportMethod)
  }

  public emitWarn(t: string) {
    this.reportMethods.forEach(h => h.warn(t))
  }

  public emitReminder(t: string) {
    this.reportMethods.forEach(h => h.reminder(t))
  }
}


import { EventCenter } from "./eventCenter"
import { getConfig } from "./config"

export type EventType = "Warn" | "Reminder"

export interface Event {
	type: EventType
	title: string
}

export class EventReceiver {
	public eventSource
	public warnListener: ((title: string) => unknown)[] = []
	public reminderListener: ((title: string) => unknown)[] = []
	public characters: string[] = []

	constructor(
		public url: URL,
		public onopen: (characters: string[]) => unknown
	) {
		this.eventSource = new EventSource(url)
		let firstMsgReceived = false
		this.eventSource.onmessage = event => {
			const eventData = JSON.parse(event.data)
			if (!firstMsgReceived) {
				const data: string[] = eventData
				this.characters = data
				firstMsgReceived = true
				onopen(this.characters)
				return
			} else if (firstMsgReceived && Array.isArray(eventData)) {
				return
			}
			const data: Event = eventData
			switch (data.type) {
				case "Warn": {
					this.warnListener.forEach(f => f(data.title))
					break
				}
				case "Reminder": {
					this.reminderListener.forEach(f => f(data.title))
					break
				}
			}
		}
	}

	public addWarnListener(listener: (title: string) => unknown) {
		this.warnListener.push(listener)
	}

	public addReminderListener(listener: (title: string) => unknown) {
		this.reminderListener.push(listener)
	}

	public close() {
		this.eventSource.close()
	}
}

export class EventReceiverManager {
  public static instance = new EventReceiverManager()

  public characters: string[] = []
  public warnListener: ((title: string) => unknown)[] = []
	public reminderListener: ((title: string) => unknown)[] = []
  public openListener: ((chars: string[]) => unknown)[] = []

  private eventReceiver: EventReceiver | undefined = undefined
  private constructor() {
    this.refresh()
    EventCenter.instance.listen("refresh", () => this.refresh())
  }

  public refresh() {
    getConfig().then(cfg => {
      this.eventReceiver?.close()
			this.characters = []
      this.eventReceiver = new EventReceiver(cfg.sseUrl as URL, chars => {
        this.characters = chars
        this.openListener.forEach(l => l(this.characters))
				EventCenter.instance.emit("event-receiver-open", chars)
      })
      this.warnListener.forEach(l => this.eventReceiver?.addWarnListener(l))
      this.reminderListener.forEach(l => this.eventReceiver?.addReminderListener(l))

			this.eventReceiver.addWarnListener(t => EventCenter.instance.emit("warn", t))
			this.eventReceiver.addReminderListener(t => EventCenter.instance.emit("reminder", t))
    })
  }

  public addWarnListener(listener: (title: string) => unknown) {
		this.warnListener.push(listener)
	}

	public addReminderListener(listener: (title: string) => unknown) {
		this.reminderListener.push(listener)
	}

  public addOpenListener(listener: (chars: string[]) => unknown) {
    this.openListener.push(listener)
    if (this.eventReceiver) {
      listener(this.characters)
    }
  }
}


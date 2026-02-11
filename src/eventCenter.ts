export interface Listener {
  eventName: string
  listener: (args: unknown) => unknown
  id: string
}

export class EventCenter {
  public static instance = new EventCenter()

  private listener: Listener[] = []

  private constructor() {}

  public emit(eventName: string, args: unknown = undefined) {
    this.listener
      .filter(l => l.eventName === eventName)
      .map(l => l.listener)
      .forEach(l => l(args))
  }

  public listen(eventName: string, listener: (args: unknown) => unknown) {
    const id = crypto.randomUUID()
    this.listener.push({
      eventName,
      listener,
      id
    })
    return () => {
      this.listener = this.listener.filter(l => l.id !== id)
    }
  }
}


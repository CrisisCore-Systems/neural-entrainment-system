/**
 * Event Bus - Simple event system for cross-component communication
 */

type EventCallback = (data?: unknown) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: unknown): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export const eventBus = new EventBus();

// Event types
export const EVENTS = {
  SESSION_COMPLETED: 'session:completed',
  SESSION_STOPPED: 'session:stopped',
} as const;

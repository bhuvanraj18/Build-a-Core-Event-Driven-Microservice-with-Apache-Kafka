import { UserEvent } from '../types';

class MemoryStore {
    private events: UserEvent[] = [];
    private eventIds: Set<string> = new Set();

    addEvent(event: UserEvent) {
        if (this.eventIds.has(event.eventId)) {
            console.log(`Duplicate event ignored: ${event.eventId}`);
            return;
        }
        this.events.push(event);
        this.eventIds.add(event.eventId);
        console.log(`Event stored: ${event.eventId}`);
    }

    getEvents(): UserEvent[] {
        return this.events;
    }

    hasEvent(eventId: string): boolean {
        return this.eventIds.has(eventId);
    }
}

export const memoryStore = new MemoryStore();

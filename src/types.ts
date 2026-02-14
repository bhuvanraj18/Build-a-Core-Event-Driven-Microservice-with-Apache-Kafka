export interface UserEvent {
    eventId: string;
    userId: string;
    eventType: 'LOGIN' | 'LOGOUT' | 'PRODUCT_VIEW';
    timestamp: string;
    payload: Record<string, any>;
}

export interface UserEventPayload {
    userId: string;
    eventType: 'LOGIN' | 'LOGOUT' | 'PRODUCT_VIEW';
    payload: Record<string, any>;
}

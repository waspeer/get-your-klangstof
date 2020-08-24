import type { EventTypes } from './event-types';
import type { DomainEventEmitter } from '~root/lib/events/domain-event-emitter';

export type AppDomainEventEmitter = DomainEventEmitter<EventTypes>;

import { Publisher, Subjects, TicketUpdatedEvent } from "@uc-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    
}
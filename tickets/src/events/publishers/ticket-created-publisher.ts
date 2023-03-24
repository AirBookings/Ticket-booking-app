import { Publisher, Subjects, TicketCreatedEvent } from "@uc-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    
}
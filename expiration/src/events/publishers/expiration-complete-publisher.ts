import { ExpirationCompleteEvent, Publisher, Subjects } from "@uc-tickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
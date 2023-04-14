import { PaymentCreatedEvent, Publisher, Subjects } from "@uc-tickets/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated

}
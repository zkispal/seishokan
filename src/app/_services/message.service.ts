import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageService {

  private subject = new Subject<any>();

    sendMessage(message: string []) {
        this.subject.next({ roles: message });
    }

    clearMessage() {
        const empty = [];
        this.subject.next({ roles: empty });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}

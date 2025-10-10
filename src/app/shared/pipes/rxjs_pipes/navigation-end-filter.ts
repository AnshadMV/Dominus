import { NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

export function navigationEndFilter(events$: Observable<Event>) {
  return events$.pipe(
    filter(event => event instanceof NavigationEnd)
  );
}

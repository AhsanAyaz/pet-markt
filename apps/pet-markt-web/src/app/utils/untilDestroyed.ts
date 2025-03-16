import { DestroyRef, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

export default function untilDestroyed() {
  const subject = new Subject();

  inject(DestroyRef).onDestroy(() => {
    subject.next(true);
    subject.complete();
  });

  return <T>() => takeUntil<T>(subject.asObservable());
}

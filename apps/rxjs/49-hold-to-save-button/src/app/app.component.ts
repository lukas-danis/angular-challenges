import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  fromEvent,
  interval,
  map,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';

@Component({
  imports: [],
  selector: 'app-root',
  template: `
    <main class="flex h-screen items-center justify-center">
      <div
        class="flex w-full max-w-screen-sm flex-col items-center gap-y-8 p-4">
        <button
          #holdBtn
          class="rounded bg-indigo-600 px-4 py-2 font-bold text-white transition-colors ease-in-out hover:bg-indigo-700">
          Hold me
        </button>

        <progress [value]="heldDuration" [max]="submitInterval"></progress>
      </div>
    </main>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  submitInterval = 2000;
  heldDuration = 0;
  @ViewChild('holdBtn', { static: true }) holdBtn!: ElementRef;

  intervalMs = 10; //  emit every 10ms
  ngAfterViewInit() {
    const mousedown$ = fromEvent(this.holdBtn.nativeElement, 'mousedown');
    const mouseup$ = fromEvent(document, 'mouseup');

    mousedown$
      .pipe(
        switchMap(() =>
          interval(this.intervalMs).pipe(
            map((i) => i * this.intervalMs),
            takeUntil(mouseup$),
            takeWhile((duration) => duration < this.submitInterval, true),
            tap((duration) => {
              this.heldDuration = duration;
              if (duration >= this.submitInterval) {
                this.onSend();
                this.heldDuration = 0;
              }
            }),
          ),
        ),
      )
      .subscribe();

    mouseup$.subscribe(() => {
      this.heldDuration = 0;
    });
  }

  ngOnDestroy() {
    console.log('Not needed. Automatic unsubscribe with takeUntil/takeWhile');
  }

  // Method with crating subscribtion and unsubscribing in NgOnDestroy
  // private subscription: Subscription = new Subscription();

  // ngAfterViewInit() {
  //   const mousedown$ = fromEvent(this.holdBtn.nativeElement, 'mousedown');
  //   const mouseup$ = fromEvent(document, 'mouseup');
  //   const sub = mousedown$.subscribe(() => {
  //     const start = Date.now();

  //     const hold$ = interval(1).pipe(
  //       takeUntil(mouseup$)
  //       ).subscribe(() => {
  //         this.heldDuration = Date.now() - start;
  //         if(this.heldDuration >= this.submitInterval) {
  //           this.onSend();
  //           this.heldDuration = 0;
  //           hold$.unsubscribe();
  //           stop$.unsubscribe();
  //         }
  //       });

  //       const stop$ = mouseup$.subscribe(() => {
  //         this.heldDuration = 0;
  //         hold$.unsubscribe();
  //         stop$.unsubscribe();
  //       });
  //   });

  //   this.subscription.add(sub);
  // }

  // ngOnDestroy() {
  //   console.log('Destroyed');
  //   this.subscription.unsubscribe();
  // }

  onSend() {
    console.log('Save it!');
  }
}

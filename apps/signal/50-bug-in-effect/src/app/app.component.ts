import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  template: `
    <section class="flex gap-5">
      <p>MacBook</p>
      <p>1999,99 €</p>
    </section>

    <section>
      <p>Extras:</p>

      <div>
        <input type="checkbox" [(ngModel)]="drive" />
        +500 GB drive-space
      </div>
      <div>
        <input type="checkbox" [(ngModel)]="ram" />
        +4 GB RAM
      </div>
      <div>
        <input type="checkbox" [(ngModel)]="gpu" />
        Better GPU
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  drive = model(false);
  ram = model(false);
  gpu = model(false);

  checkedCount = computed(() => {
    return (this.drive() ? 1 : 0) + (this.ram() ? 1 : 0) + (this.gpu() ? 1 : 0);
  });
  previousCheckedCount = 0;

  constructor() {
    // 1. with computed - Bonus Challenge
    effect(() => {
      if (this.previousCheckedCount < this.checkedCount()) {
        alert('Price increased!');
      }
      this.previousCheckedCount = this.checkedCount();
    });

    // // 2. without computed (Doesnt work correctly. Alerts when unchecking checkboxes)
    // effect(() => {
    //   const driveValue = this.drive();
    //   const ramValue = this.ram();
    //   const gpuValue = this.gpu();

    //   if (driveValue || ramValue || gpuValue) {
    //     alert('Price increased!');
    //   }
    // });

    // // 3. without computed (Works correctly)
    // effect(() => {
    //   if (this.drive()) {
    //     alert('Price increased!');
    //   }
    // });

    // effect(() => {
    //   if (this.ram()) {
    //     alert('Price increased!');
    //   }
    // });

    // effect(() => {
    //   if (this.gpu()) {
    //     alert('Price increased!');
    //   }
    // });
  }
}

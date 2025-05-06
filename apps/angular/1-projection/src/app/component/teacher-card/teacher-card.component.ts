import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { FakeHttpService } from '../../data-access/fake-http.service';
import { TeacherStore } from '../../data-access/teacher.store';
import { CardType } from '../../model/card.model';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card
      [list]="teachers()"
      [type]="cardType"
      [itemTemplate]="teacherItemTemplate"
      customClass="bg-light-red">
      <card-image-content>
        <img
          ngSrc="../../../assets/img/teacher.png"
          width="200"
          height="200"
          class="card-image" />
      </card-image-content>
    </app-card>

    <ng-template #teacherItemTemplate let-teacher>
      <app-list-item [id]="teacher.id" [type]="cardType">
        {{ teacher.firstName }}
      </app-list-item>
    </ng-template>
  `,
  styles: [
    `
      ::ng-deep .bg-light-red {
        background-color: rgba(250, 0, 0, 0.1);
      }
    `,
  ],
  imports: [CardComponent, NgOptimizedImage, ListItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TeacherCardComponent implements OnInit {
  private http = inject(FakeHttpService);
  private store = inject(TeacherStore);

  teachers = this.store.teachers;
  cardType = CardType.TEACHER;

  ngOnInit(): void {
    this.http.fetchTeachers$.subscribe((t) => this.store.addAll(t));
  }
}

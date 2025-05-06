import { inject, Injectable } from '@angular/core';
import { forkJoin, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalDBService, TopicType } from './localDB.service';

@Injectable({ providedIn: 'root' })
export class AppService {
  private dbService = inject(LocalDBService);

  getAllInfo = this.dbService.infos;

  deleteOldTopics(type: TopicType): Observable<boolean> {
    const infoByType = this.dbService.searchByType(type);

    if (infoByType.length === 0) {
      return of(true);
    }

    const deleteObservables = infoByType.map((t) =>
      this.dbService.deleteOneTopic(t.id),
    );

    return forkJoin(deleteObservables).pipe(
      map((results) => results.every((result) => result === true)),
    );
  }

  // This doesnt check result directly on deleteOneTopic results.
  // but I call searchByType again and check if all topics are deleted. (not the best way)
  deleteOldTopics2(type: TopicType): Observable<boolean> {
    const infoByType = this.dbService.searchByType(type);
    if (!infoByType || infoByType.length > 0) {
      infoByType
        .map((t) => this.dbService.deleteOneTopic(t.id))
        .reduce((acc, curr) => merge(acc, curr), of(true));
    }

    return this.dbService.searchByType(type).length ? of(false) : of(true);
  }
}

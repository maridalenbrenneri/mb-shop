import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class TableDataSource extends DataSource<any> {
  constructor(private rowData: Array<any>) { super(); }
  connect(): Observable<Element[]> {
    const rows = [];
    this.rowData.forEach(element => rows.push(element, { detailRow: true, element }));
    return of(rows);
  }
  disconnect() { }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserReportService {
  private base = 'http://localhost:8087/api/reports/user';

  constructor(private http: HttpClient) {}

  getReport(): Observable<any> {
    return this.http.get(this.base);
  }
}

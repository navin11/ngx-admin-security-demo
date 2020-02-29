import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API = `${environment.API_ENDPOINT}`;
  constructor(
    private _http: HttpClient
  ) { }

  authenticate(userCredentials) {
    return this._http.post(`${this.API}/account/login`, userCredentials);
  }

  getUserDetails(userId) {
    return this._http.get(`${this.API}/user/${userId}`)
      .pipe(
        catchError(this.handleError('getUserDetails', []))
      );
  }

  getDataList() {
    const reqBody = {
      'total': 1,
      'start': 1,
      'limit': 10,
      'results': [
        {
          'id': '856626d6-8f88-413e-98f8-4b6fdd9e74a9',
          'spid': 'a1bcd4ds67',
          'firstName': 'Augustine',
          'lastName': 'Oh',
          'email': 'augustine.oh@calix.com',
          'msisdn': 2067084311,
          'companyName': 'Calix, Inc.',
          'companyAddress': '100 headquaters dr, San Jose, CA 94566',
          'isValidate': true,
          'created': 1529431779136,
          'updated': 1529431779136
        }
      ]
    };
    return this._http.post(`${this.API}/sp/account/list`, reqBody)
      .pipe(
        catchError(this.handleError('getUserDetails', []))
      );
  }

  /**
 * Handle Http operation that failed.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      return of(error as T);
    };
  }
}

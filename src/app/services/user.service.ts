import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  userIdentity: any;
  authenticated = false;
  public authenticationState = new BehaviorSubject<any>({});

  constructor(
    private authService: AuthService
  ) { }

  authenticate(identity) {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
  }

  hasAnyAuthority(authorities: string[]): Promise<boolean> {
    return Promise.resolve(this.hasAnyAuthorityRole(authorities));
  }

  hasAnyAuthorityRole(roles: string[]): boolean {
    if ((roles === null) || (roles === undefined)) {
      // no authorities to look
      return false;
    }
    if (!this.authenticated || !this.userIdentity || !this.userIdentity.roles) {
      return false;
    }

    for (let i = 0; i < roles.length; i++) {
      if (this.userIdentity.roles.includes(roles[i])) {
        return true;
      }
    }

    return false;
  }

  hasAuthority(role: string): Promise<boolean> {
    if (!this.authenticated) {
      return Promise.resolve(false);
    }

    return this.identity().then(user => {
      return Promise.resolve(user.roles && user.roles.includes(role));
    }, () => {
      return Promise.resolve(false);
    });
  }

  identity(): Promise<any> {
    // check and see if we have retrieved the userIdentity data from the server.
    // if we have, reuse it by immediately resolving
    if (this.userIdentity) {
      return Promise.resolve(this.userIdentity);
    }

    // retrieve the userIdentity data from the server, update the identity object, and then resolve.
    return Promise.resolve(this.getUserIdentity());
  }

  getUserIdentity() {
    this.authService.getUserDetails('').subscribe(userInfo => {
      if (userInfo) {
        return this.setUserInfo(userInfo);
      }
      this.userIdentity = null;
      this.authenticated = false;
      this.authenticationState.next(this.userIdentity);
      return null;
    });
  }

  async setUserInfo(userInfo) {
    if (userInfo) {
      this.userIdentity = {
        id: userInfo.id,
        firstName: userInfo.lastName,
        lastName: userInfo.firstName,
        email: userInfo.email,
        roles: userInfo.roles,
      };
      this.authenticated = true;
    } else {
      this.userIdentity = null;
      this.authenticated = false;
    }
    this.authenticationState.next(this.userIdentity);
    return this.userIdentity;
  }

  getAuthenticationState(): Observable<any> {
    return this.authenticationState.asObservable();
  }
}

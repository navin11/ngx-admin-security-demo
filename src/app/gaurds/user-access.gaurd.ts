import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UserRoleAuthGuard implements CanActivateChild {
    private userHasAccess = new BehaviorSubject(null);
    public hasAccess = this.userHasAccess.asObservable();
    userRoles = {};

    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    canActivateChild() {
        this.getUserRoleAccess().then(roles => {
            this.userRoles = roles;
        });
        return true;
    }


    checkUserRoleAccess(data, url) {
        if (data && data['roles']) {
            if ((this.router.url.indexOf(url) !== -1)) {
                return this.navigateToAccessDenied();
            } else {
                this.userHasAccess.next(this.userRoles);
                return true;
            }
        }
    }

    navigateToAccessDenied() {
        this.router.navigate(['access-denied']);
        return false;
    }

    getUserRoleAccess() {
        return this.userService.identity().then(user => {
            return user;
        });
    }

}

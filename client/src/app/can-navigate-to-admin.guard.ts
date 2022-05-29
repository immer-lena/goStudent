import {Injectable} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "./shared/services/authentication.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class CanNavigateToAdminGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let params = route.params;
    if (this.authService.isLoggedIn()) {
      if(this.authService.getCurrentUserId() == params['id']){
        return true;
      }
      else{
        console.log(this.authService.getCurrentUserId());
        this.toastr.error("Du kannst keine Änderungen an diesem Eintrag durchführen");
        this.router.navigate(["../"], {relativeTo: this.route});
        return false;
      }
    } else {
      this.toastr.error("Du musst dich einloggen, um Änderungen durchzuführen!");
      this.router.navigate(["../"], {relativeTo: this.route});
      return false;
    }
  }

}

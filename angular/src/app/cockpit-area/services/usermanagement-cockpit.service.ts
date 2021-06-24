import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Filter,
  FilterCockpit,
  Pageable,
  Sort,
  UserInfo,
  UserListCriteria,
} from 'app/shared/backend-models/interfaces';
import { cloneDeep, map, template } from 'lodash';

import { Observable } from 'rxjs';
import {LoginInfo}  from 'app/shared/backend-models/interfaces';//wichtig 
import {  exhaustMap} from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';
import {
  UserListResponse,
  BookingResponse,
  DishView,
  OrderResponse,
  OrderView,
  OrderViewResult,
} from '../../shared/view-models/interfaces';//nicht nötig 
import { PriceCalculatorService } from '../../sidenav/services/price-calculator.service';//nicht nötig 


@Injectable({
  providedIn: 'root'
})
export class UsermanagementCockpitService {


  
  private readonly getUsersRestPath: string =
  'usermanagement/v1/user/search';
  private readonly createUserRestPath: string =
  'usermanagement/v1/user/';
  private readonly deleteUserRestPath: string =
  'usermanagement/v1/user/';
  private readonly updateUserRestPath: string =
  'usermanagement/v1/user/update/';
  private readonly resetUserPasswordRestPath: string =
  'usermanagement/v1/user/reset/password/request/';


  
private readonly restServiceRoot$: Observable<
  string
> = this.config.getRestServiceRoot();
temp :any;
constructor(
  private http: HttpClient,
  private priceCalculator: PriceCalculatorService,//nicht nötig 
  private config: ConfigService,
) {}



getUsers(
  pageable: Pageable,
  sorting: Sort[],

): Observable<UserListResponse[]> {
  let path: string;
  pageable.sort =sorting;
  console.log("starting the http request ");
  console.log(pageable);
  var temp : UserListCriteria ={"pageable":pageable};
 
  console.log(temp);
  return this.restServiceRoot$.pipe(
    exhaustMap((restServiceRoot) =>
      this.http.post<UserListResponse[]>(`${restServiceRoot}${this.getUsersRestPath}`, temp),
    ),
  );
}
postNewUser(userDetails :UserInfo){
  return this.restServiceRoot$.pipe(
    exhaustMap((restServiceRoot) =>
      this.http.post(`${restServiceRoot}${this.createUserRestPath}`, userDetails),
    ),
  );
}
deleteUser(id :number){
  var pathID= id.toString() + "/";
  return this.restServiceRoot$.pipe(
    exhaustMap((restServiceRoot) =>
      this.http.delete(`${restServiceRoot}${this.deleteUserRestPath}${pathID}`, ),
    ),
  );
}
updateUser(UserInfo :UserInfo){

  return this.restServiceRoot$.pipe(
    exhaustMap((restServiceRoot) =>
      this.http.post(`${restServiceRoot}${this.updateUserRestPath}`, UserInfo),
    ),
  );
}
resetUserPassword(Email :String){
 let body = {email : Email};
  return this.restServiceRoot$.pipe(
    exhaustMap((restServiceRoot) =>
      this.http.post(`${restServiceRoot}${this.resetUserPasswordRestPath}`, body),
    ),
  );
}
}

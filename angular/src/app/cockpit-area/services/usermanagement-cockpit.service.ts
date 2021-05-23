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


/*
  private readonly getReservationsRestPath: string =
  'bookingmanagement/v1/booking/search';
private readonly getOrdersRestPath: string =
  'ordermanagement/v1/order/search';
private readonly filterOrdersRestPath: string =
  'ordermanagement/v1/order/search';
private readonly orderUpdateRestPath: string =
  'ordermanagement/v1/order/status/update'; 
  private readonly orderCancelRestPath: string =
  'ordermanagement/v1/order/cancelorder';
  private readonly orderArchivRestPath: string =
  'ordermanagement/v1/order/archived';
  private readonly filtersDishRestPath: string = 
  'dishmanagement/v1/dish/search';
*/
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
}

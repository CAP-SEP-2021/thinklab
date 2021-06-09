import { createAction, props, union } from '@ngrx/store';
import { UserInfo } from '../../../shared/backend-models/interfaces';


export const createUser = createAction(
  '[createUser] createUser ',
  props<{UserInfo :UserInfo }>(),
);

export const createUserSuccess = createAction(
  '[createUser] createUser success',
  props< UserInfo >(),
);

export const createUserFail = createAction(
  '[createUser] createUser Fail',
  props<{ error: Error }>(),
);

export const updateUser = createAction(
  '[updateUser] updateUser ',
  props<{UserInfo :UserInfo }>(),
);

export const updateUserSuccess = createAction(
  '[updateUser] updateUser success',
  
);

export const updateUserFail = createAction(
  '[updateUser] updateUser Fail',
  props<{ error: Error }>(),
);

export const deleteUser = createAction(
  '[deleteUser] deleteUser ',
  props<{UserInfo :UserInfo }>(),
);

export const deleteUserSuccess = createAction(
  '[deleteUser] deleteUser success'
);

export const deleteUserFail = createAction(
  '[deleteUser] deleteUser Fail',
  props<{ error: Error }>(),
);

// action types
const all = union({
  createUser,
  createUserSuccess,
  createUserFail,
  updateUser,
  updateUserSuccess,
  updateUserFail,
  deleteUser,
  deleteUserSuccess,
  deleteUserFail

});
export type CockpitAreaActions = typeof all;

import { createReducer, on, Action } from '@ngrx/store';
import { UserInfo } from '../../../shared/backend-models/interfaces';
import * as cockpitActions from '../actions/cockpit-area.actions';


export interface State {
  pending: boolean;
  errorMessage: string | null;
  textMessage: string | null;
  UserInfo: UserInfo | null;
  token: string | null;
  UserInfoResponse: UserInfo | null;
}

export const initialState: State = {
  pending: false,
  errorMessage: '',
  textMessage: '',
  UserInfo: undefined,
  token: undefined,
  UserInfoResponse: {
    username: '',
    userRoleId: undefined,
    id: undefined,
    password: '',
    email: '',
    twoFactorStatus:undefined,
  },
};

const cockpitReducer = createReducer(
  initialState,
  on(cockpitActions.createUser, (state, {UserInfo: UserInfo} ) => ({
    ...state,
    pending: true,
    UserInfo,
  })),
  on(cockpitActions.createUserSuccess, (state,  UserInfo ) => ({
    ...state,
    pending: false,
    UserInfo,
  })),
  on(cockpitActions.createUserFail, (state, { error }) => ({
    ...state,
    pending: false,
    errorMessage: error.message,
  })),
  on(cockpitActions.deleteUser, (state, {UserInfo: UserInfo} ) => ({
    ...state,
    pending: true,
    UserInfo,
  })),
  on(cockpitActions.deleteUserSuccess, (state ) => ({
    ...state,
    pending: false,
    
  })),
  on(cockpitActions.deleteUserFail, (state, { error }) => ({
    ...state,
    pending: false,
    errorMessage: error.message,
  })),
  on(cockpitActions.updateUser, (state, {UserInfo: UserInfo} ) => ({
    ...state,
    pending: true,
    UserInfo,
  })),
  on(cockpitActions.updateUserSuccess, (state ) => ({
    ...state,
    pending: false,
    
  })),
  on(cockpitActions.updateUserFail, (state, { error }) => ({
    ...state,
    pending: false,
    errorMessage: error.message,
  }))


);

export function reducer(state: State | undefined, action: Action): State {
  return cockpitReducer(state, action);
}

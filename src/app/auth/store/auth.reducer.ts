import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State{
    user: User;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActionsUnion){
    {
        switch (action.type) {
            case AuthActions.LOGIN:
                const user = new User(
                    action.payload.email, 
                    action.payload.userId,
                    action.payload.token,
                    action.payload.expirationDate
                );
                return {
                    ...state,
                    authError: null,
                    user: user,
                    loading: false
                };
            case AuthActions.LOGOUT:
                return{
                    ...state,
                    user: null
                };
            case AuthActions.LOGIN_START:
                return{
                    ...state,
                    authError: null,
                    loading: true
                };
            case AuthActions.LOGIN_FAIL:
                return{
                    ...state,
                    authError: action.payload,
                    user: null,
                    loading: false
                };    
            default:
                return state;
        }
    }
}
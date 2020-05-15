import { LOGIN_USER, SIGNOUT_USER } from "./authConstants";

export const login = (creds) => {
    return {
        type: LOGIN_USER,
        payload: {
            creds
        }
     }
}
export const logout = () => {
    return {
        type: SIGNOUT_USER
     }
}
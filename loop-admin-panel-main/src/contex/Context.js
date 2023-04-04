import { createContext, useReducer} from "react";
import * as ActionTypes from './ActionTypes';
import ContextReducer from "./reducers/contextReducer";
import jwt_decode from "jwt-decode";

const Context = createContext();
const data = localStorage.getItem("loop_token")


const initialValue = {
    role: data != null ? jwt_decode(data).role : 0
}


export const ContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(ContextReducer, initialValue);

    const handleRole = (role) => {
        dispatch({ type: ActionTypes.ROLE_UPDATE, payload: role })
    }

    return (
        <Context.Provider
            value={{
                ...state,
                handleRole
            }}
        >
            {children}
        </Context.Provider>
    )
}

export default Context;
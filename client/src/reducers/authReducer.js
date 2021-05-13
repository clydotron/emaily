import { FETCH_USER } from '../actions/types';

// returns null (we dont know), user info (if logged in), or galse
export default function(state=null, action) {
   
    switch(action.type) {
        case FETCH_USER:
            return action.payload || false;
        default: 
            return state;
    }
}
// Context
import LogContext from "./LogContext";

// For Cookies set
import {useCookies} from 'react-cookie';

const LogState = (props) => {

    // Object
    const [cookies , setCookies] = useCookies(["token" , "email"]);

    // Set and remove the cookies
    const handleCookies = (data) => {
        if(data !== null){
            setCookies("token" , data.token);
            setCookies("email", data.data.user_email);
        }
        else{
            setCookies("token" ,"");
            setCookies("email", "");
        }
    }

 return(
    <LogContext.Provider value={{handleCookies , cookies}}>
        {props.children}
    </LogContext.Provider>
 );
}

export default LogState;
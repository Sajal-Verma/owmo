import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

//create the context used in other componet
export const store = createContext();


//This component wraps your app and provides context values to all its children
function ContextProvider({children}){

    const [user, setUser]= useState(null);
    const [loder, setLoader] = useState(false);


    const getUser= async ()=>{
        try {
            setLoader(true)
            const userData= await axiosInstance.get('/user/get-user')
            setUser(userData.user) /// acordig the server response
            
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoader(false)
        }
    }


    useEffect(()=>{
        getUser()
    },[])
    return (

        //provide the data that can be used by the other componet
        <store.Provider value={{user,setUser,loder}}>
            {children}
        </store.Provider>
    )
}
export default ContextProvider
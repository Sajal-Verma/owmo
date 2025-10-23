import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Foot from "./Foot";
import { useEffect, useState } from "react";

function Layout (){
    
    const location = useLocation()
    const [show, setShow] = useState(true);


    useEffect(()=>{
        switch(location.pathname){
            case "/login":
                setShow(false);
            break;
            case "/signup":
                setShow(false)
                break
            default:
                setShow(true)
        }
    },[location.pathname])


    return (
        <>
        {
            show &&
            <NavBar/>

        }
        <Outlet/>
        {
            show && 
            <Foot/>

        }
        </>
    )
}
export default Layout
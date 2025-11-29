import { useContext } from "react";
import {store} from "../context/StoreProvider"
import { Link } from "react-router-dom";

function BookButton() {


    const {user, isLogin, loginUser} = useContext(store);

    return (
        <button className="bg-[#52AB98] text-xl px-6 py-2 mt-4 mx-auto rounded-md">
            {
                isLogin ?(
                    <Link to={"/Request"}>
                    Book a Repair
                    </Link>
                )
                :
                (
                  <Link to={"/login"}>
                    Book a Repair
                    </Link>
                )
            }
        </button>
    );
}


export default BookButton
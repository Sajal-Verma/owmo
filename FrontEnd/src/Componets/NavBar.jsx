import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

import logo from '../assets/image/SiteLogo.png';
import logo2 from "../assets/image/owmo1.png"
import { useState, useEffect , useContext} from 'react';
import {store} from "../context/StoreProvider"

function NavBar() {


    const [Open, setOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const {user, isLogin, loginUser} = useContext(store);

    useEffect(() => {
        // Load user data from cookies on mount
        const cookieUser = Cookies.get("user");
        if (cookieUser) {
            setUserData(JSON.parse(cookieUser));
        }

        const handleScroll = () => {
            setOpen(false); // Hide menu on scroll
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    return (
        <nav className={`flex justify-between p-2 ${Open ? '' : 'bg-[#BBBDBC]/50'} sticky top-0`}>


            {/*button for open and close*/}
            <div className={`${Open ? 'bg-[#BBBDBC] p-2 rounded-md fixed z-10 shadow-xl' : ''} md:hidden`}>
                <button
                    onClick={() => setOpen(!Open)}
                    className='bg-[#C8D8E4] w-10 h-10 rounded-md border-2 border-[#57A7E3] text-xl md:hidden'
                >
                    {Open ? '✖' : '☰'}
                </button>
                {Open && (
                    <div className='flex flex-col items-center p-2'>
                        <ul className="flex flex-col space-y-8 text-xl p-2 md:hidden mt-4 gap-4">
                            <li ><Link to="/" className="block hover:text-gray-200">Home</Link></li>
                            <li><Link to="/about" className="block hover:text-gray-200">About</Link></li>
                            <li><Link to="/faq" className="block hover:text-gray-200">FAQs</Link></li>
                            <li><Link to="/contact" className="block hover:text-gray-200">dashboard</Link></li>
                        </ul>
                        <button className='bg-[#52AB98] text-xl px-6 py-2 rounded-md mt-4 md:hidden'>Book a Repair</button>
                    </div>
                )}
            </div>


            <div className='pt-1 md:self-center'>
                <Link to="/" className='flex flex-row'>
                <img src={logo} alt="img" className='h-10' />
                <img src={logo2} alt="img" className='h-5 self-center pl-1' />
                </Link>
            </div>
            <ul className="hidden md:flex space-x-8 text-xl self-center">
                <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
                <li><Link to="/about" className="hover:text-gray-200">About</Link></li>
                <li><Link to="/faq" className="hover:text-gray-200">FAQs</Link></li>
                {/*<li><Link to="/contact" className="hover:text-gray-200">Contact</Link></li>*/}
            </ul>
            {
                isLogin ? (
                    <Link to={"/lala"}>
                        <button className='hidden md:inline bg-[#52AB98] text-xl px-6 py-1 rounded-md cursor-pointer'>
                            Welcome {user.name || ""}
                        </button>
                    </Link>
                ) : (
                    <Link to={"/login"}>
                        <button className='hidden md:inline bg-[#52AB98] text-xl px-6 py-1 rounded-md cursor-pointer'>
                            Login
                        </button>
                    </Link>
                )
            }
        </nav>
    );
}

export default NavBar;

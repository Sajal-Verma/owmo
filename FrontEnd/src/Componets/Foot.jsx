import { brands, mobiles, Simg } from "../assets/data";


function Foot() {
    const brandList = brands.map((data, index) =>
        <li key={index}>{data}</li>
    );

    const mobileList = mobiles.map((data, index) =>
        <li key={index}>{data}</li>
    );

    const simg = Simg.map((data, index) =>
        <img key={index} src={data} alt="img" className="w-[25px]" />
    );

    return (
        <div className="w-full bg-[#16363F]">
            <div className="flex flex-col md:flex-row justify-evenly py-4">


                <div className="flex space-x-8 text-white">
                    <div className="px-4">
                        <h1 className="text-lg text-bold">Popular Brands</h1>
                        <ul className="flex flex-col justify-between h-64 text-sm px-4 py-2">
                            {brandList}
                        </ul>
                    </div>
                    <div className="px-4">
                        <h1 className="text-lg text-bold">Popular Mobiles</h1>
                        <ul className="text-sm flex flex-col justify-between h-64 px-4 py-2">
                            {mobileList}
                        </ul>
                    </div>
                </div>


                <div className="flex justify-between py-4 md:flex-col">
                    <div className="hidden md:inline px-4 text-[#FFFFFF]">
                        <h1 className="text-lg">Want to be a Partner</h1>
                        <p className="text-sm">Contact Us</p>
                    </div>
                    <div className="px-4">
                        <h1 className="text-white text-lg font-semibold py-2">Follow Us</h1>
                        <div className="flex space-x-2">
                            {simg}
                        </div>
                    </div>
                    <div className="px-4">
                        <h1 className="text-md text-[#FFFFFF] py-2">Subscribe to our newsletter</h1>
                        <div className="flex-row w-[230px]">
                            <input type="email" value={"hello"} className="bg-[#FFFFFF] p-1 w-[150px]" />
                            <button className="bg-[#52AB98] p-1 text-[#FFFFFF]">Subscribe</button>
                        </div>
                    </div>
                </div>


            </div>


            <div className='w-full justify-items-center'>
                <hr className="w-sm h-0.5 bg-white border-none md:w-4xl" />
                <p className='text-white'>© 2025 Created by Sajal Verma</p>
            </div>
        </div>
    );
}

export default Foot;

import { useRef, useEffect } from "react";
import { ServiceData, ModleData } from "../assets/data";
import BookButton from "../Componets/BookButton";
import img from '../assets/image/owmovideo.mp4';

function Home() {
    const videoRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (videoRef.current) {
                        if (entry.isIntersecting) {
                            videoRef.current.play();
                        } else {
                            videoRef.current.pause();
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const services = ServiceData.map((data, index) => (
        <div
            key={index}
            className="bg-[#BBBDBC] w-72 md:w-70 h-auto rounded-lg flex flex-col justify-around items-center px-8 py-6 shadow-xl space-y-4"
        >
            <img src={data.logo} alt="img" className="w-14 h-14 object-contain" />
            <h2 className="text-xl text-[#555555] font-bold text-center">{data.heading}</h2>
            <p className="text-md text-[#FFFFFF] text-shadow-lg ">{data.tex}</p>
        </div>
    ));

    const modele = ModleData.map((data, index) => (
        <div
            key={index}
            className="bg-[#BBBDBC] w-30 md:w-51 h-auto rounded-lg flex flex-col justify-around items-center px-4 py-6 shadow-xl"
        >
            <img src={data.im} alt="img" className="rounded-md w-14 h-14 object-cover" />
            <h1 className="text-xl text-[#555555] font-bold py-2 text-center">{data.head}</h1>
            <p className="text-sm text-[#FFFFFF] text-shadow-lg">{data.tx}</p>
        </div>
    ));

    return (
        <div className="flex flex-col space-y-12 py-10 items-center bg-[#F2F0EF] w-full max-x-4xl px-4 scroll-smooth" >

            {/* Hero Section */}
            <div className="shadow-xl w-5/6 max-w-4xl bg-[#BBBDBC] flex rounded-lg ">
                <div className="rounded-lg flex flex-col justify-around px-4 py-4 space-y-4 md:px-8 w-md rounded-l-lg">
                    <div>
                        <h1 className="text-3xl w-full md:text-4xl text-[#2B6777] font-semibold">
                            Fast, affordable and reliable repairs
                        </h1>
                        <p className="text-xl text-[#FFFFFF] text-shadow-lg my-2 md:my-4">
                            for your mobile devices
                        </p>
                    </div>
                    <BookButton />
                </div>
                <div className="hidden md:flex h-auto w-md rounded-r-lg">
                    <video
                        ref={videoRef}
                        loop
                        muted
                        playsInline
                        className="rounded-r-lg object-contain"
                    >
                        <source src={img} type="video/mp4" />
                    </video>
                </div>
            </div>

            {/* Services Section */}
            <div className="flex flex-wrap gap-6 justify-center">
                {services}
            </div>

            {/* Model Section */}
            <div className="flex flex-col items-center text-center space-y-6 w-full max-w-6xl">
                <h1 className="text-2xl text-[#2B6777] font-bold">
                    All kind of repairs. For real.
                </h1>
                <div className="flex flex-wrap gap-6 justify-center">
                    {modele}
                </div>
            </div>

            {/* CTA Section */}
            <div className="w-5/6 max-w-4xl flex flex-col items-center bg-[#BBBDBC] px-6 py-6 rounded-lg shadow-xl text-center">
                <h1 className="text-[#555555] font-bold text-2xl pb-4">
                    Get Your Mobile Device Repaired Today!
                </h1>
                <p className="text-[#FFFFFF] text-shadow-lg text-lg leading-relaxed">
                    We use only the highest quality parts and offer a wide range of repair services,
                    from simple screen replacements to complex motherboard repairs.
                    We also offer same-day repairs in most cases!
                </p>
                <BookButton />
            </div>

        </div>
    );
}

export default Home;

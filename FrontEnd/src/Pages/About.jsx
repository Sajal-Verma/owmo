import { aboutItms } from "../assets/data";

function About() {


    const aboutItme = aboutItms.map((data, index) =>
        <div key={index} className={`rounded-2xl p-6 shadow-md w-80 ${data.bg} md:w-[30vw]`}>
            <div className="mb-4">
                <img src={data.icon} alt={`${data.title} icon`} className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">{data.title}</h2>
            <ul className="text-sm space-y-2 text-gray-700">
                {data.points.map((line, idx) => (
                    <li key={idx} className="border-b border-gray-200 pb-1 last:border-none">
                        {line}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="w-full flex justify-center py-16 bg-[#F2F0EF]">
            <div className="w-5/6 max-w-4xl space-y-8 md:h-[150vh] flex flex-col flex-wrap">
                <div className="text-center p-8">
                    <h1 className="text-4xl font-bold text-gray-800">Our Values</h1>
                    <p className="text-gray-500 mt-2">What we love and stand for every day</p>
                </div>
                {aboutItme}
            </div>
        </div>
    );
} 

export default About;

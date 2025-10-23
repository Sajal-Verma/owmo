import { useState } from "react";
import { QA } from "../assets/data";
import Button from "../Componets/BookButton"; // assuming same button

function Faq() {
  const [show, setShow] = useState(null);

  const toggle = (index) => {
    setShow(show === index ? null : index);
  };

  const fas = QA.map((data, index) => (
    <div key={index} className="py-5">
      {/* Question Row */}
      <div className="flex items-center">
        <button
          onClick={() => toggle(index)}
          className="bg-[#D6F1A2] text-green-800 font-medium w-10 h-10 rounded-full flex items-center justify-center"
        >
          <span className="text-2xl">{show === index ? "-" : "+"}</span>
        </button>
        <h2 className="ml-4 text-lg md:text-xl text-[#00473C] font-semibold">
          {data.Q}
        </h2>
      </div>

      {/* Answer */}
      {show === index && (
        <p className="ml-14 mt-2 text-base md:text-lg text-[#00473C] leading-relaxed">
          {data.A}
        </p>
      )}
    </div>
  ));

  return (
    <div className="flex flex-col items-center px-4 py-10">
      {/* Heading */}
      <h1 className="text-[#00473C] text-2xl md:text-4xl font-semibold mb-10 text-center">
        Most Frequently Asked FAQ&apos;s
      </h1>

      {/* FAQ List */}
      <div className="divide-y w-full max-w-3xl">{fas}</div>

      {/* CTA Box */}
      <div className="flex flex-col items-center bg-[#BBBDBC] w-full max-w-4xl rounded-2xl shadow-xl mt-12 p-6 text-center space-y-4">
        <h1 className="text-xl md:text-3xl text-[#2B6777] font-bold text-shadow-lg">
          Still have questions or want to know more?
        </h1>
        <p className="text-sm md:text-base text-[#FFFFFF] text-shadow-lg leading-relaxed px-2 md:px-10">
          We use only the highest quality parts and offer a wide range of
          repair services, from simple screen replacements to complex
          motherboard repairs. We also offer same-day repairs in most cases!
        </p>
        <Button className="text-[#FFFFFF]" text="Contact Us" />
      </div>
    </div>
  );
}

export default Faq;

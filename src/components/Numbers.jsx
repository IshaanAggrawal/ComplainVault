    "use client";
    import React from "react";
    import CountUp from "react-countup";
    import { useInView } from "react-intersection-observer";

    function Numbers() {
    const [ref1, inView1] = useInView({ triggerOnce: true });
    const [ref2, inView2] = useInView({ triggerOnce: true });
    const [ref3, inView3] = useInView({ triggerOnce: true });

    return (
        <section className="py-16 text-center">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Let's Talk About Some Numbers
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
            <h1 className="text-6xl font-bold text-red-500">
                {inView1 && <CountUp start={0} end={1200} duration={3} />}+
            </h1>
            <p className="text-gray-300 mt-2 text-lg">File Complaints</p>
            <div ref={ref1}></div>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
            <h1 className="text-6xl font-bold text-green-500">
                {inView2 && <CountUp start={0} end={950} duration={3} />}+
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Solved Cases</p>
            <div ref={ref2}></div>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
            <h1 className="text-6xl font-bold text-purple-500">
                {inView3 && <CountUp start={0} end={150} duration={3} />}+
            </h1>
            <p className="text-gray-300 mt-2 text-lg">Authorities Connected</p>
            <div ref={ref3}></div>
            </div>
        </div>
        </section>
    );
    }

    export default Numbers;

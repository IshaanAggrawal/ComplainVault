    "use client";
    import { useState, useEffect, useRef } from "react";
    import FlowBlock from "@/components/FlowBlock";
    
    const blocks = [
        {
            idx:0,
            heading:'Complaint',
            icon:'/complaint.svg',
            text:'the user submits a complaint with detailed information, evidence, and, supporting documents through the platform.',
            fill:'#009b74ff',
        },
        {
            idx:1,
            heading:'Blockchain',
            icon:'/blockchain.svg',
            text:'The complaint is encrypted and stored securly on the blockchain, ensuring tamper-proof and permanent records.',
            fill:'#006352ff',
        },
        {
            idx:2,
            heading:'Investigation',
            icon:'/investigation.svg',
            text:'Authorities and relevant stakeholders review the complaint, analyze attached evidence, and initiate necessary actions.',
            fill:'#00556eff',
        },
        {
            idx:3,
            heading:'Resolution',
            icon:'/resolution.svg',
            text:'A clear Solutions or corrective action is provided. the user is updated in real-time with progress and outcomes.',
            fill:'#0066ffff',
        },
        {
            idx:4,
            heading:'Archiving',
            icon:'/archive.svg',
            text:'Once resolved, the complaint and all related actions are securely archived for future reference and transparency audits.',
            fill:'#0026ffff',
        }
    ]
    
    const Workflow = () => {
    
        const [isInView, setIsInView] = useState(false);
        const containerRef = useRef(null);
    
        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                },
                {
                    threshold: 0.5,
                }
            );
    
            if (containerRef.current) {
                observer.observe(containerRef.current);
            }
    
            return () => {
                // Clean up the observer when the component unmounts
                if (containerRef.current) {
                    observer.unobserve(containerRef.current);
                }
            };
        }, []);
    
    return (
        <section className="mt-10 py-16 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            How It Works?
        </h2>

        <p className="mt-6 max-w-2xl text-gray-400 text-lg">
            From filing a complaint to blockchain-backed resolution, here’s how our smart system ensures
            transparency, security, and trust.
        </p>

        
        <div className={`workflow-container ${isInView ? 'is-visible' : ''} mt-10 mb-30 px-10`} 
        ref={containerRef}
        style={{display:'flex',
        justifyContent:'center',
        alignItems:'top'}}>
            {blocks.map((block) => (
                <FlowBlock
                key={block.idx}
                style={{position:'relative', animationDelay: `${block.idx * 0.1}s`}}
                idx = {block.idx}
                heading = {block.heading}
                icon = {block.icon}
                text = {block.text}
                fill = {block.fill}
                topClass = {block.idx%2 === 0 ? 'top-block' : ''}
                />
            ))}
        </div>

        </section>
    );
    }

    export default Workflow;

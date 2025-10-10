    export default function Background({ children }) {
    return (
        <div>
        <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a1a] to-[#32087a] -z-10" />
        <div className="relative z-10">
            {children}
        </div>
        </div>
    );
    }

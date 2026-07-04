import { Link, useLocation } from "react-router-dom"

export default function Navbar(){
    const location = useLocation()
    return(
        <nav className="bg-white border-b border-[#ebebeb] px-10 h-14 flex items-center justify-between sticky top-0 z-50">

            <div className="flex items-center gap-2">
                <span className="text-base">🔒</span>
                <span className="text-[15px] font-semibold text-[#111] tracking-tight">
                    Secure Vision
                </span>
            </div>

            <div className="flex gap-1">
                {[
                { label: "Detection", path: "/" },
                { label: "Violations", path: "/violations" },
                ].map(({ label, path }) => (
                <Link
                    key={path}
                    to={path}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === path
                        ? "bg-[#f3f3f3] text-[#111]"
                        : "text-[#888] hover:text-[#111] hover:bg-[#f9f9f9]"
                    }`}
                >
                    {label}
                </Link>
                ))}
            </div>
        </nav>
    )
}
export default function Header() {
    return (
        <div className="items-center justify-between flex-wrap bg-[#2B2D42] p-6 fixed w-screen">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-semibold text-xl tracking-tight">Ani Improver</span>
            </div>
        </div>
    )
}
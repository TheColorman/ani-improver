import Link from 'next/link'

export default function Nav({ selected }: { selected: string }) {
    return (
        <div className="items-center justify-between flex-wrap bg-[#FBFBFB] absolute bottom-0 p-6 w-screen">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                <li>
                    {selected == "overview" ? (
                        <p className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white hover:cursor-pointer" aria-current="page">Overview</p>
                    ) : (
                        <Link href="/overview">
                            <p className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 hover:cursor-pointer">Overview</p>
                        </Link>
                    )}
                </li>
                <li>
                    {selected == "stats" ? (
                        <p className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white hover:cursor-pointer" aria-current="page">Stats</p>
                    ) : (
                        <Link href="/stats">
                            <p className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 hover:cursor-pointer">Stats</p>
                        </Link>
                    )}
                </li>
                <li>
                    {selected == "yourlists" ? (
                        <p className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white hover:cursor-pointer" aria-current="page">Your lists</p>
                    ) : (
                        <Link href="/yourlists">
                            <p className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 hover:cursor-pointer">Your lists</p>
                        </Link>
                    )}
                </li>
                <li>
                    {selected == "createlist" ? (
                        <p className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white hover:cursor-pointer" aria-current="page">Create list</p>
                    ) : (
                        <Link href="/createlist">
                            <p className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 hover:cursor-pointer">Create list</p>
                        </Link>
                    )}
                </li>
            </ul>
        </div>
    )
}
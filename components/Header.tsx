import useStorage from "../lib/useStorage"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  const { getItem } = useStorage()

  return (
    <div className="items-center justify-between flex bg-[#2B2D42] p-6 fixed w-screen">
      <Link href="/">
        <a className="flex items-center flex-shrink-0 text-white mr-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-semibold text-xl tracking-tight">Ani Improver</span>
        </a>
      </Link>
      <div className="flex items-center gap-2">
        <p className="text-xl text-white">
          {getItem("username")}
        </p>
        {getItem("username") && getItem("avatar") && (
          <Image
            src={getItem("avatar")}
            width={40}
            height={40}
            className="rounded"
            alt="avatar"
          />
        )}
      </div>
    </div>
  )
}
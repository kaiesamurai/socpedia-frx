import Link from "next/link";

import { HomeIcon, ModuleIcon } from "../Icon";

export default function LeftBar() {
  return (
    <div className="border-r-2 border-base-300 p-4 min-h-screen flex flex-col gap-2 sticky top-16">
      <Link href="/">
        <div className="px-4 py-2 gap-2 w-full h-12 flex items-center rounded-xl bg-primary/10 hover:bg-primary/50">
          <HomeIcon />
          Home
        </div>
      </Link>
      <Link href="/modules">
        <div className="px-4 py-2 gap-2 w-full h-12 flex items-center rounded-xl bg-primary/10 hover:bg-primary/50">
          <ModuleIcon />
          Modules
        </div>
      </Link>
    </div>
  )
}
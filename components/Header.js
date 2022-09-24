import Link from "next/link"
import { ConnectButton} from "web3uikit"


export default function Header() {
    return  (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
        <h1 className="py-4 px-4 font-bold text-3xl" >
            Carbon Credits Exchange
        </h1>
        <div className="flex flex-row items-center">
            <Link href="/">
                <a className="mr-4 p-6"> Home </a>
            </Link>
            <Link href="/ccHolder">
                <a className="mr-4 p-6"> Holder  </a>
            </Link>
            <Link href="/certifier">
                <a className="mr-4 p-6"> Certifier  </a>
            </Link>
            <Link href="/application">
                <a className="mr-4 p-6"> Apply  </a>
            </Link>
            <ConnectButton moralisAuth={false}/>
        </div>
    
    </nav>
    )
}
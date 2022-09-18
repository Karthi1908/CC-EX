import Link from "next/link"
import { ConnectButton} from "web3uikit"


export default function Header() {
    return  (
    <nav> 
        <Link href="/">
            <a>
                Carbon Credit Marketplace
            </a>
        </Link>
        <Link href="/">
            <a>
                Sell Carbon credits
            </a>
        </Link>
        <ConnectButton />
    </nav>
    )
}
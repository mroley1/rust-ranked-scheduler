import styles from "./header.module.scss";
import Link from 'next/link'

export default function Header() {
  return (
    <nav>
        <Link href="/login"><button>login</button></Link>
    </nav>
  );
}

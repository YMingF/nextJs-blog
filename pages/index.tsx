import Image from "next/image";
import { Inter } from "next/font/google";
import png from 'assets/1.png'
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  return (
   <main>
     <h1>测试而已</h1>
       <Link href='posts/test.js'>点击跳转到另一个页面</Link>
     <Image src={png} alt={'ss'}></Image>
   </main>
  );
}

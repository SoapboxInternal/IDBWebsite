import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Impact Driven Brands — Good brands. Greater impact.',description:'A CPG incubator bringing innovative social mission brands to retail and eCommerce. Explore Soapbox, Bushwick Kitchen, Goodnest, and Fresh Science.',icons:{icon:'/idb-logo-white.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}

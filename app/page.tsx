import {listBrands} from '../lib/brands';
import Portfolio from './portfolio';
export const dynamic='force-dynamic';
export default async function Home(){try{return <Portfolio brands={await listBrands()}/>;}catch(e){console.error(e);return <Portfolio brands={[]} unavailable/>;}}

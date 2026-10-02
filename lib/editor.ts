import {getChatGPTUser} from '../app/chatgpt-auth';
import {db} from './brands';
export async function isEditor(claim=false){
 const user=await getChatGPTUser();if(!user)return false;
 const d=db();
 // The initial administrator is established only within the owner-private Site.
 if(claim && (user.email.toLowerCase() === "daniel.doll@soapboxsoaps.com" || (process.env.NODE_ENV === "development" && user.userId === "local_seedy")))await d.prepare("INSERT OR IGNORE INTO settings (key,value) VALUES ('editor',?)").bind(user.userId).run();
 const row=await d.prepare("SELECT value FROM settings WHERE key='editor'").first<{value:string}>();
 return row?.value===user.userId;
}
export function sameOrigin(r:Request){const origin=r.headers.get('origin');return !!origin&&origin===new URL(r.url).origin;}

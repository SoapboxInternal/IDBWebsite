import {env} from 'cloudflare:workers';
import {isEditor,sameOrigin} from '../../../lib/editor';
export async function POST(r:Request){try{
 if(!sameOrigin(r)||!await isEditor())return Response.json({error:'Editor access required.'},{status:403});
 if(Number(r.headers.get('content-length')||0)>6*1024*1024)return Response.json({error:'Choose an image smaller than 5 MB.'},{status:413});
 const type=r.headers.get('content-type')||'';
 if(!['image/jpeg','image/png','image/webp'].includes(type))return Response.json({error:'Use a JPG, PNG, or WebP image.'},{status:400});
 const reader=r.body?.getReader();if(!reader)return Response.json({error:'Choose an image.'},{status:400});
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>5*1024*1024){await reader.cancel();return Response.json({error:'Choose an image smaller than 5 MB.'},{status:413});}chunks.push(value);}
 const a=new Uint8Array(size);let offset=0;for(const chunk of chunks){a.set(chunk,offset);offset+=chunk.length;}const bytes=a.buffer;
 const valid=type==='image/jpeg'?a[0]===255&&a[1]===216:type==='image/png'?a[0]===137&&a[1]===80&&a[2]===78&&a[3]===71:String.fromCharCode(...a.slice(0,4))==='RIFF'&&String.fromCharCode(...a.slice(8,12))==='WEBP';
 if(!valid)return Response.json({error:'That file is not a supported image.'},{status:400});
 if(!env.BUCKET)throw new Error('Image storage unavailable');
 const key=crypto.randomUUID();await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:type}});return Response.json({url:'/api/media/'+key});
 }catch(e){console.error(e);return Response.json({error:'Image upload failed. Please try again.'},{status:503});}}

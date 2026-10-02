import {listBrands,db,validateBrand} from '../../../lib/brands';
import {isEditor,sameOrigin} from '../../../lib/editor';
export const dynamic='force-dynamic';
export async function GET(r:Request){try{const all=new URL(r.url).searchParams.get('all')==='1';if(all&&!await isEditor())return Response.json({error:'Editor access required.'},{status:403});return Response.json(await listBrands(all),{headers:{'Cache-Control':'no-store'}});}catch(e){console.error(e);return Response.json({error:'Brands could not be loaded. Please try again.'},{status:503});}}
export async function POST(r:Request){return save(r,false);}
export async function PUT(r:Request){return save(r,true);}
async function save(r:Request,update:boolean){
 try{
 if(!sameOrigin(r)||!await isEditor())return Response.json({error:'Editor access required.'},{status:403});
 const x=validateBrand(await r.json());const d=db();
 if(update){
 if(typeof x.id!=='string'||!Number.isInteger(x.revision))throw new Error('Invalid brand.');
 const result=await d.prepare('UPDATE brands SET name=?,category=?,status=?,website=?,image=?,description=?,visible=?,position=?,revision=revision+1 WHERE id=? AND revision=?').bind(x.name,x.category,x.status,x.website,x.image,x.description,x.visible,x.position,x.id,x.revision).run();
 if(!result.meta.changes)return Response.json({error:'This brand changed in another window. Reload the manager before editing again.'},{status:409});
 }else{ x.id=crypto.randomUUID();await d.prepare('INSERT INTO brands (id,name,category,status,website,image,description,visible,position,revision) VALUES (?,?,?,?,?,?,?,?,?,1)').bind(x.id,x.name,x.category,x.status,x.website,x.image,x.description,x.visible,x.position).run();}
 return Response.json({ok:true,id:x.id});
 }catch(e){console.error(e);return Response.json({error:e instanceof Error?e.message:'Could not save. Please try again.'},{status:400});}
}

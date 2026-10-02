import { env } from 'cloudflare:workers';
export type Brand={id:string;name:string;category:string;status:string;website:string;image:string;description:string;visible:number;position:number;revision:number};
export const statuses=['In Market','Incubation','Acquired'];
export const initialBrands:Brand[]=[
 {id:'soapbox',name:'Soapbox',category:'Personal Care',status:'In Market',website:'https://www.soapboxsoaps.com',image:'/brands/soapbox.jpg',description:'',visible:1,position:0,revision:1},
 {id:'bushwick',name:'Bushwick Kitchen',category:'Food',status:'In Market',website:'https://www.bushwickkitchen.com',image:'/brands/bushwick.jpg',description:'',visible:1,position:1,revision:1},
 {id:'goodnest',name:'Goodnest',category:'Baby',status:'Acquired',website:'https://www.goodnest.com',image:'/brands/goodnest.jpg',description:'',visible:1,position:2,revision:1},
 {id:'fresh',name:'Fresh Science',category:'Personal Care',status:'Incubation',website:'https://www.freshscience.co',image:'/brands/fresh.jpg',description:'',visible:1,position:3,revision:1},
];
export function db(){if(!env.DB)throw new Error('Brand storage is unavailable.');return env.DB;}
export async function listBrands(all=false):Promise<Brand[]>{
 const d=db();
 await d.batch(initialBrands.map(b=>d.prepare('INSERT OR IGNORE INTO brands (id,name,category,status,website,image,description,visible,position,revision) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(...Object.values(b))));
 return (await d.prepare(`SELECT * FROM brands ${all?'':'WHERE visible=1'} ORDER BY position,name`).all<Brand>()).results;
}
export function validateBrand(x:any){
 for(const key of ['name','category','status','website','image','description']) if(typeof x[key]!=='string')throw new Error('Please complete all brand fields.');
 x.name=x.name.trim();x.category=x.category.trim();
 if(!x.name||x.name.length>100||!x.category||x.category.length>70||x.description.length>500)throw new Error('Check the brand name, category, and description lengths.');
 if(!statuses.includes(x.status))throw new Error('Choose a valid status.');
 if(x.website&&!/^https:\/\//i.test(x.website))throw new Error('Website must start with https://.');
 if(x.website){new URL(x.website);if(x.website.length>2000)throw new Error('Website address is too long.');}
 if(x.image&&!/^https:\/\//i.test(x.image)&&!/^\/(brands\/[^/]+|api\/media\/[a-zA-Z0-9.-]+)$/.test(x.image))throw new Error('Use an uploaded image or an https image address.');
 if(![0,1].includes(x.visible)||!Number.isInteger(x.position)||x.position<0||x.position>100000)throw new Error('Check visibility and display order.');
 return x as Brand;
}

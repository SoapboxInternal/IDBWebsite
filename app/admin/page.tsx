import {requireChatGPTUser} from '../chatgpt-auth';
import {isEditor} from '../../lib/editor';
import Manager from './manager';
export const dynamic='force-dynamic';
export default async function Admin(){await requireChatGPTUser('/admin');try{if(!await isEditor(true))return <main className="admin-body"><h1>Editor access required</h1><p>Only the site’s brand manager can make changes.</p><a href="/">Back to the site</a></main>;return <Manager/>;}catch(e){console.error(e);return <main className="admin-body"><h1>The brand manager is temporarily unavailable</h1><p>Your brands are safe. Please reload to try again.</p><a href="/">Back to the site</a></main>;}}

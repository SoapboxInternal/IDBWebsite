import test from 'node:test';
import assert from 'node:assert/strict';
import {authorizeEditorIdentity as authorize} from '../lib/editor-policy.ts';
function store(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { get: async key => values.get(key) ?? null, setIfAbsent: async (key, id) => { if (!values.has(key)) values.set(key, id); } };
}
test('both David addresses can independently register and subsequently edit', async () => {
  const s = store();
  for (const [index,email] of ['David@Soapbox.co','david.simnick@soapboxsoaps.com'].entries()) {
    const user = {userId:`david-${index}`,email};
    assert.equal(await authorize(user,s),false);
    assert.equal(await authorize(user,s,true),true);
    assert.equal(await authorize(user,s),true);
  }
});
test('existing owner access is preserved', async () => {
  assert.equal(await authorize({userId:'owner',email:'daniel.doll@soapboxsoaps.com'},store({editor:'owner'})),true);
});
test('anonymous and unlisted accounts cannot register or edit', async () => {
  const s = store();
  assert.equal(await authorize(null,s,true),false);
  assert.equal(await authorize({userId:'other',email:'other@soapboxsoaps.com'},s,true),false);
  assert.equal(await authorize({userId:'owner',email:'other@example.com'},store({editor:'owner'}),true),false);
});
test('a registered email cannot be rebound to a different identity', async () => {
  const s = store();
  assert.equal(await authorize({userId:'david',email:'david@soapbox.co'},s,true),true);
  assert.equal(await authorize({userId:'imposter',email:'david@soapbox.co'},s,true),false);
});
test('local preview identity is rejected in production', async () => {
  const s = store();const user = {userId:'local_seedy',email:'seedy@sites.test'};
  assert.equal(await authorize(user,s,true,true),true);
  assert.equal(await authorize(user,s,false,false),false);
});

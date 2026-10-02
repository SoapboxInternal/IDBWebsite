const ownerEmail = 'daniel.doll@soapboxsoaps.com';
const editorEmails = new Set([
  ownerEmail,
  'david@soapbox.co',
  'david.simnick@soapboxsoaps.com',
]);

type Identity = { userId: string; email: string };
type IdentityStore = {
  get(key: string): Promise<string | null>;
  setIfAbsent(key: string, userId: string): Promise<void>;
};

// Bind each explicitly allowed, authenticated email to its stable Site user ID.
export async function authorizeEditorIdentity(
  user: Identity | null,
  store: IdentityStore,
  claim = false,
  development = false,
): Promise<boolean> {
  if (!user) return false;
  const email = user.email.trim().toLowerCase();
  const localPreview = development && user.userId === 'local_seedy' && email === 'seedy@sites.test';
  if (!editorEmails.has(email) && !localPreview) return false;

  // Preserve the owner's identity registered before multiple editors were supported.
  if (email === ownerEmail && await store.get('editor') === user.userId) return true;

  const key = `editor-email:${email}`;
  if (claim) await store.setIfAbsent(key, user.userId);
  return await store.get(key) === user.userId;
}

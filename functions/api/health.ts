export const onRequestGet: PagesFunction = async () =>
  Response.json({ ok: true, ts: new Date().toISOString() });
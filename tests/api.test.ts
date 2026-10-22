import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, createApiClient, tokenIdentity } from '../src/api/client.ts';
import { resourcePath, services } from '../src/api/services.ts';
import { imageBase64, validateImageHeader } from '../src/api/evidence.ts';
import { validateRegistration } from '../src/api/authValidation.ts';
import type { Cadastro } from '../src/api/types.ts';

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });
test('anonymous requests never reach the API', async () => {
  let calls = 0; const client = createApiClient('http://localhost:8080', async () => { calls++; return json({}); });
  await assert.rejects(client.request('/acao'), (error: ApiError) => error.status === 401); assert.equal(calls, 0);
});
test('registration is public, omits Bearer and sends only the three permitted fields', async () => {
  const client = createApiClient('http://localhost:8080', async (url, init) => {
    assert.equal(url, 'http://localhost:8080/auth/cadastro'); assert.equal(init?.method, 'POST');
    assert.equal(new Headers(init?.headers).get('Authorization'), null);
    assert.deepEqual(JSON.parse(String(init?.body)), { nome: 'Pessoa API', email: 'pessoa@test.invalid', senha: ' Test-password-2026 ' });
    return json({ id: 101, nome: 'Pessoa API', email: 'pessoa@test.invalid', pontos: 0, resgatados: 0, versao: 0 }, 201);
  });
  client.setToken('must-not-be-forwarded');
  const input = { nome: ' Pessoa API ', email: ' PESSOA@test.invalid ', senha: ' Test-password-2026 ', confirmarSenha: 'never-sent', perfil: 'ADMIN', pontos: 999 };
  const result = await services(client).register(input as Cadastro); assert.equal(result.pontos, 0);
});
test('public login does not send a stale token and a failed login does not revoke an existing session', async () => {
  let expired = 0;
  const client = createApiClient('http://localhost:8080', async (url, init) => {
    if (String(url).endsWith('/auth/login')) { assert.equal(new Headers(init?.headers).get('Authorization'), null); return json({}, 401); }
    assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer valid-session'); return json([]);
  }, () => expired++);
  client.setToken('valid-session'); await assert.rejects(services(client).login({ email: 'pessoa@test.invalid', senha: 'wrong-password' }), (error: ApiError) => error.status === 401);
  assert.deepEqual(await client.request('/acao'), []); assert.equal(expired, 0);
});
test('public access is restricted to POST cadastro/login, never arbitrary protected routes', async () => {
  let calls = 0; const client = createApiClient('http://localhost:8080', async () => { calls++; return json({}); });
  await assert.rejects(client.request('/usuario', { method: 'POST', publicAuth: true }));
  await assert.rejects(client.request('/auth/cadastro', { method: 'GET', publicAuth: true }));
  await assert.rejects(client.request('/auth/logout', { method: 'POST', publicAuth: true })); assert.equal(calls, 0);
});
test('registration conflicts and cooldown errors are safe, with no automatic retry', async () => {
  for (const status of [409, 429, 503]) {
    let calls = 0; const client = createApiClient('http://localhost:8080', async () => { calls++; return json({ senha: 'DO_NOT_REFLECT_SECRET' }, status, { 'Retry-After': '900' }); });
    await assert.rejects(services(client).register({ nome: 'Pessoa', email: 'pessoa@test.invalid', senha: 'Test-password-2026' }), (error: ApiError) => error.status === status && !error.message.includes('DO_NOT_REFLECT_SECRET') && (status !== 429 || error.retryAfter === 900)); assert.equal(calls, 1);
  }
});
test('registration validation checks required fields, email, password confirmation and UTF-8 bytes', () => {
  const valid = { nome: 'Pessoa API', email: 'pessoa@test.invalid', senha: 'Test-password-2026', confirmarSenha: 'Test-password-2026' };
  assert.deepEqual(validateRegistration(valid), {});
  assert.ok(validateRegistration({ ...valid, nome: ' '.repeat(4) }).nome);
  assert.ok(validateRegistration({ ...valid, email: 'invalid' }).email);
  assert.ok(validateRegistration({ ...valid, email: 'x'.repeat(151) + '@test.invalid' }).email);
  assert.ok(validateRegistration({ ...valid, senha: 'short' }).senha);
  assert.ok(validateRegistration({ ...valid, confirmarSenha: 'different' }).confirmarSenha);
  assert.ok(validateRegistration({ ...valid, senha: '😀'.repeat(19), confirmarSenha: '😀'.repeat(19) }).senha);
  assert.deepEqual(validateRegistration({ ...valid, senha: 'a'.repeat(72), confirmarSenha: 'a'.repeat(72) }), {});
});
test('request uses the selected base, Bearer, no cookies or redirects', async () => {
  const client = createApiClient('http://localhost:8080/', async (url, init) => {
    assert.equal(url, 'http://localhost:8080/acao?page=0&size=20'); assert.equal(init?.credentials, 'omit'); assert.equal(init?.redirect, 'error');
    assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer test-token'); return json([]);
  }); client.setToken('test-token'); assert.deepEqual(await services(client).list('acao'), []);
});
test('401 clears the current token once and blocks subsequent requests', async () => {
  let requests = 0, expired = 0;
  const client = createApiClient('http://localhost:8080', async () => { requests++; return json({}, 401); }, () => expired++);
  client.setToken('expired'); await assert.rejects(client.request('/acao')); await assert.rejects(client.request('/acao'));
  assert.equal(requests, 1); assert.equal(expired, 1);
});
test('late 401 from the previous account does not clear a new session', async () => {
  let release: (value: Response) => void = () => {}; let expired = 0;
  const client = createApiClient('http://localhost:8080', () => new Promise(resolve => { release = resolve; }), () => expired++);
  client.setToken('old'); const pending = client.request('/acao'); client.setToken('new'); release(json({}, 401));
  await assert.rejects(pending); assert.equal(expired, 0);
});
test('204 does not try to parse JSON', async () => {
  const client = createApiClient('http://localhost:8080', async () => new Response(null, { status: 204 })); client.setToken('token');
  assert.equal(await services(client).logout(), undefined);
});
test('429 preserves Retry-After and hides provider/body details', async () => {
  const client = createApiClient('http://localhost:8080', async () => json({ mensagem: 'TOP_SECRET_SQL_AND_KEY' }, 429, { 'Retry-After': '60' })); client.setToken('token');
  await assert.rejects(client.request('/verificacoes'), (error: ApiError) => error.status === 429 && error.retryAfter === 60 && !error.message.includes('TOP_SECRET'));
});
test('no automatic retry, and repeated submissions preserve the idempotency key/body', async () => {
  const calls: RequestInit[] = [];
  const client = createApiClient('http://localhost:8080', async (_url, init) => { calls.push(init!); throw new Error('network'); }); client.setToken('token');
  const body = { acaoId: 701, descricao: 'Reciclagem', imagemBase64: 'base64', desafioId: '00000000-0000-4000-8000-000000000001' };
  await assert.rejects(services(client).submit(body, 'fixed-operation-key')); assert.equal(calls.length, 1);
  await assert.rejects(services(client).submit(body, 'fixed-operation-key')); assert.equal(calls.length, 2);
  assert.equal(calls[0].body, calls[1].body); assert.equal(new Headers(calls[0].headers).get('Idempotency-Key'), 'fixed-operation-key');
  assert.equal(JSON.parse(String(calls[0].body)).pontos, undefined); assert.equal(JSON.parse(String(calls[0].body)).usuarioId, undefined);
});
test('review/reprocess use the current version and never client points', async () => {
  const calls: { url: string; body: Record<string, unknown> }[] = [];
  const client = createApiClient('http://localhost:8080', async (url, init) => { calls.push({ url: String(url), body: JSON.parse(String(init?.body)) }); return json({}); }); client.setToken('token');
  const row = { id: 'operation', versao: 2 } as Parameters<ReturnType<typeof services>['review']>[0];
  await services(client).review(row, true, 'Revisão independente'); await services(client).reprocess(row);
  assert.deepEqual(calls[0].body, { aprovar: true, justificativa: 'Revisão independente', versao: 2 });
  assert.deepEqual(calls[1].body, { confirmarPossivelCobranca: true, versao: 2 });
});
test('compound identifiers and delete versions follow the backend contract', async () => {
  assert.equal(resourcePath('usuario-carta', { usuarioId: 101, cartaId: 401 }), '/usuario-carta/101/401');
  assert.equal(resourcePath('usuario-fragmento', { usuarioId: 101, raridade: 'RARA' }), '/usuario-fragmento/101/RARA');
  const client = createApiClient('http://localhost:8080', async (url, init) => { assert.equal(url, 'http://localhost:8080/acao/701?versao=3'); assert.equal(init?.method, 'DELETE'); return new Response(null, { status: 204 }); });
  client.setToken('token'); await services(client).delete('acao', { id: 701, versao: 3 });
});
test('evidence is fetched privately as a JPEG blob', async () => {
  const client = createApiClient('http://localhost:8080', async (_url, init) => { assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer token'); return new Response(new Uint8Array([1, 2, 3]), { headers: { 'Content-Type': 'image/jpeg' } }); });
  client.setToken('token'); const blob = await services(client).evidence('id'); assert.equal(blob.type, 'image/jpeg'); assert.equal(blob.size, 3);
});
test('rejects malformed JSON, unexpected MIME, oversized responses and arbitrary destinations', async () => {
  for (const response of [new Response('<html>bad</html>', { headers: { 'Content-Type': 'text/html' } }), new Response('{', { headers: { 'Content-Type': 'application/json' } }), new Response('x'.repeat(2_000_001), { headers: { 'Content-Type': 'application/json' } })]) {
    const client = createApiClient('http://localhost:8080', async () => response); client.setToken('token'); await assert.rejects(client.request('/acao'));
  }
  const client = createApiClient('http://localhost:8080', async () => { throw new Error('must not fetch'); }); client.setToken('token');
  for (const path of ['//evil.invalid', 'https://evil.invalid', '/../secret', '/foo\\bar']) await assert.rejects(client.request(path), /Rota inválida/);
  assert.throws(() => createApiClient('http://user:password@localhost:8080'));
});
test('token decoding requires current expiry and safe positive identity', () => {
  const jwt = (sub: unknown, exp: number) => 'header.' + Buffer.from(JSON.stringify({ sub, exp })).toString('base64url') + '.signature';
  assert.equal(tokenIdentity(jwt('101', Date.now() / 1000 + 300)).id, 101);
  assert.throws(() => tokenIdentity(jwt('101', 0))); assert.throws(() => tokenIdentity(jwt('9007199254740993', Date.now() / 1000 + 300)));
  assert.throws(() => tokenIdentity('not-a-token'));
});
test('PNG dimensions are bounded before raster decoding', async () => {
  const bytes = new Uint8Array(32); bytes.set([137, 80, 78, 71, 13, 10, 26, 10]); const view = new DataView(bytes.buffer); view.setUint32(16, 100000); view.setUint32(20, 100000);
  assert.throws(() => validateImageHeader(bytes));
  let decoded = false; const original = globalThis.createImageBitmap;
  globalThis.createImageBitmap = (() => { decoded = true; throw new Error('must not decode'); }) as typeof createImageBitmap;
  try { await assert.rejects(imageBase64(new File([bytes], 'bomb.png', { type: 'image/png' }))); assert.equal(decoded, false); }
  finally { globalThis.createImageBitmap = original; }
});
test('oversized and non-image evidence is rejected before sending', async () => {
  await assert.rejects(imageBase64(new File([new Uint8Array(524289)], 'big.png', { type: 'image/png' })));
  await assert.rejects(imageBase64(new File(['<svg/>'], 'bad.svg', { type: 'image/svg+xml' })));
  assert.throws(() => validateImageHeader(new Uint8Array([1, 2, 3])));
});
test('capture challenge uses the protected endpoint and sends only the selected action', async () => {
  const calls: RequestInit[] = [];
  const challenge = { id: '00000000-0000-4000-8000-000000000001', acaoId: 21, codigo: 'TEST22', expiraEm: '2026-10-22T18:00:00Z' };
  const client = createApiClient('http://localhost:8080', async (url, init) => {
    assert.equal(String(url), 'http://localhost:8080/verificacoes/desafio'); calls.push(init!);
    return new Response(JSON.stringify(challenge), { headers: { 'Content-Type': 'application/json' } });
  });
  client.setToken('session-token');
  assert.deepEqual(await services(client).challenge(21), challenge);
  assert.equal(calls[0].method, 'POST'); assert.deepEqual(JSON.parse(String(calls[0].body)), { acaoId: 21 });
  assert.equal(new Headers(calls[0].headers).get('Authorization'), 'Bearer session-token');
});

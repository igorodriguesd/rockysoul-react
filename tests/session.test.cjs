const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const key = 'rocky_auth_token';
const token = (expires = Date.now() / 1000 + 300) => 'header.' + Buffer.from(JSON.stringify({ sub: '101', exp: expires })).toString('base64url') + '.signature';
const profile = { id: 101, nome: 'Pessoa', email: 'pessoa@test.invalid', pontos: 20, resgatados: 0, versao: 0 };
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });

// Exercise the provider's real async code through render/effect/cleanup lifecycles,
// with deterministic storage and HTTP; no real credentials or network requests.
function harness(storage = new Map(), transport = async () => json({ usuario: profile, administrador: false })) {
  const slots = []; let cursor = 0; let state; const calls = []; const cache = {};
  const equal = (a, b) => a && b && a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
  const react = {
    createContext: () => ({ Provider: 'Provider' }),
    useState(initial) {
      const index = cursor++; if (!slots[index]) slots[index] = { value: typeof initial === 'function' ? initial() : initial };
      const slot = slots[index]; if (!slot.set) slot.set = next => { slot.value = typeof next === 'function' ? next(slot.value) : next; };
      return [slot.value, slot.set];
    },
    useRef(initial) { const index = cursor++; if (!slots[index]) slots[index] = { value: { current: initial } }; return slots[index].value; },
    useMemo(factory, deps) { const index = cursor++; if (!slots[index] || !equal(slots[index].deps, deps)) slots[index] = { value: factory(), deps }; return slots[index].value; },
    useCallback(callback, deps) { return react.useMemo(() => callback, deps); },
    useEffect(callback, deps) {
      const index = cursor++; const previous = slots[index];
      if (!previous || !equal(previous.deps, deps)) slots[index] = { effect: callback, deps, dirty: true, cleanup: previous?.cleanup };
    },
  };
  const fetcher = async (url, init) => { calls.push({ path: new URL(url).pathname, init }); return transport(url, init); };
  function load(relative) {
    if (cache[relative]) return cache[relative]; const exports = {}; cache[relative] = exports;
    const source = fs.readFileSync(path.join(root, 'src', relative), 'utf8').replaceAll('import.meta.env.VITE_API_BASE_URL', 'undefined');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, {
      exports, require(id) {
        if (id === 'react') return react;
        if (id === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }) };
        if (id.endsWith('/Toast')) return { showToast: () => {} };
        if (id.endsWith('/client')) return load('api/client.ts');
        if (id.endsWith('/services')) return load('api/services.ts'); throw Error(id);
      },
      fetch: fetcher, Response, Headers, Blob, DOMException, AbortController, URL, Date, Number, JSON, Error, Uint8Array, TextDecoder, setTimeout, clearTimeout, atob,
      localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) },
    });
    return exports;
  }
  const { ApiProvider } = load('context/ApiContext.tsx');
  const render = () => { cursor = 0; state = ApiProvider({ children: null }).props.value; return state; };
  const commit = () => { for (const slot of slots) if (slot?.effect && slot.dirty) { slot.cleanup?.(); slot.cleanup = slot.effect(); slot.dirty = false; } };
  const cleanup = () => { for (const slot of slots) if (slot?.effect) { slot.cleanup?.(); slot.cleanup = undefined; } };
  const replay = () => { for (const slot of slots) if (slot?.effect) slot.cleanup = slot.effect(); };
  const settle = async () => { for (let i = 0; i < 30; i++) { await new Promise(resolve => setImmediate(resolve)); render(); if (!state.connecting) return state; } throw Error('Session did not settle'); };
  render(); return { render, commit, cleanup, replay, settle, calls, storage };
}

test('login survives a reload without another password request', async () => {
  const storage = new Map(); const current = token();
  const first = harness(storage, async url => {
    assert.equal(new URL(url).pathname, '/auth/login');
    return json({ accessToken: current, tokenType: 'Bearer', expiresIn: 300, usuario: profile, administrador: false });
  });
  first.commit(); await first.render().login('pessoa@test.invalid', 'test-only'); assert.equal(storage.get(key), current);
  first.cleanup(); assert.equal(storage.get(key), current);
  const reloaded = harness(storage); assert.equal(reloaded.render().connecting, true);
  reloaded.commit(); assert.equal(storage.get(key), current);
  const state = await reloaded.settle(); assert.equal(state.user.id, 101); assert.equal(state.isAdmin, false);
  assert.deepEqual(reloaded.calls.map(call => call.path), ['/auth/sessao']);
  assert.equal(reloaded.calls[0].init.headers.Authorization, 'Bearer ' + current); reloaded.cleanup();
});

test('StrictMode cleanup and effect replay keep the credential and active Bearer', async () => {
  const current = token(); const storage = new Map([[key, current]]); const h = harness(storage, async url => new URL(url).pathname === '/acao' ? json([]) : json({ usuario: profile, administrador: true }));
  h.commit(); h.cleanup(); assert.equal(storage.get(key), current); h.replay();
  const state = await h.settle(); assert.equal(state.user.id, 101); assert.equal(state.isAdmin, true);
  await state.api.request('/acao'); assert.equal(h.calls.at(-1).init.headers.Authorization, 'Bearer ' + current);
  assert.equal(storage.get(key), current); h.cleanup();
});

test('temporary network failure preserves the saved session for a successful retry', async () => {
  let offline = true; const current = token(); const storage = new Map([[key, current]]);
  const h = harness(storage, async () => { if (offline) throw Error('offline'); return json({ usuario: profile, administrador: false }); });
  h.commit(); let state = await h.settle(); assert.equal(state.user, null); assert.ok(state.sessionError); assert.equal(storage.get(key), current);
  const count = h.calls.length; await assert.rejects(state.api.request('/acao')); assert.equal(h.calls.length, count);
  offline = false; await state.retrySession(); state = h.render(); assert.equal(state.user.id, 101); assert.equal(state.sessionError, null); h.cleanup();
});

test('expired token and server revocation clear the saved session instead of authenticating from storage', async () => {
  for (const expired of [true, false]) {
    const storage = new Map([[key, token(expired ? 0 : Date.now() / 1000 + 300)]]);
    const h = harness(storage, async () => json({}, 401)); h.commit(); const state = await h.settle();
    assert.equal(state.user, null); assert.equal(storage.has(key), false); assert.equal(state.sessionError, null); assert.equal(h.calls.length, expired ? 0 : 1); h.cleanup();
  }
});

test('a late restoration response cannot undo an explicit sign out', async () => {
  let finish; const storage = new Map([[key, token()]]);
  const h = harness(storage, () => new Promise(resolve => { finish = resolve; })); h.commit();
  h.render().disconnect(); finish(json({ usuario: profile, administrador: true }));
  const state = await h.settle(); assert.equal(state.user, null); assert.equal(state.isAdmin, false); assert.equal(storage.has(key), false); h.cleanup();
});

test('a profile belonging to another account cannot restore the session', async () => {
  const storage = new Map([[key, token()]]); const h = harness(storage, async () => json({ usuario: { ...profile, id: 202 }, administrador: true }));
  h.commit(); const state = await h.settle(); assert.equal(state.user, null); assert.equal(state.isAdmin, false); assert.equal(storage.has(key), false); h.cleanup();
});

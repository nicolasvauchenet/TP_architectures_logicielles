// - On teste l'API réelle => on pollue la base "festival.db" persistante
// - Les tests s'influencent et sont inter-dépendants

const BASE = "http://localhost:3000";

async function httpJson(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe("Démo : tests PAS isolés (volontaire)", () => {
  beforeAll(async () => {
    await sleep(250);
  });

  test("T1 - Crée un artiste puis liste => on voit l'artiste", async () => {
    const name = "Zarbi Trio";
    const create = await httpJson("POST", "/artists", { name });
    expect([201, 409]).toContain(create.status);

    const list = await httpJson("GET", "/artists");
    expect(list.status).toBe(200);
    // On s'attend à >= 1, mais on ne sait pas combien (base sale, exécutions précédentes)
    expect(Array.isArray(list.json)).toBe(true);
    expect(list.json.length).toBeGreaterThanOrEqual(1);
  });

  test("T2 - On voudrait un état propre… mais la DB est déjà polluée", async () => {
    const list = await httpJson("GET", "/artists");
    // "Pédagogique" : ici, on voudrait démontrer que le test pense l'état vide,
    // alors qu'il dépend en fait de T1 (et d'exécutions précédentes).
    // Ce test montre l'échec d'une hypothèse naïve d'isolation.
    expect(list.status).toBe(200);

    // => Cette assertion exprime l'intention pédagogique : "je veux un test indépendant".
    // Elle VA ÉCHOUER si T1 a tourné avant ou si la DB contient déjà des artistes.
    expect(list.json.length).toBe(0); // 💥 Flaky / faux : dépend de l'ordre et de l'historique
  });

  test("T3 - Collision de données sur la création d'un artiste déjà existant", async () => {
    const name = "Zarbi Trio";
    const create1 = await httpJson("POST", "/artists", { name });
    const create2 = await httpJson("POST", "/artists", { name });
    // Si create1 a fonctionné, create2 renverra 409 ; si l'artiste existait avant, create1 peut déjà renvoyer 409.
    // Le test n'est pas déterministe : c'est exactement le problème.
    expect([201, 409]).toContain(create1.status);
    expect([201, 409]).toContain(create2.status);
  });
});

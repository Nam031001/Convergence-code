// src/screens/item-ingredient.html 렌더링 (최종 확인 화면의 "재료추가/변경").
// 재료마다 기본/빼기/추가 중 하나를 고르는 건 이 화면 안의 상태 변화라 버튼이고,
// 나가는 이동(취소/확인)만 a 태그다. 확인의 href 에 새 선택(burgerMods/sideMods)을 실어 최종 확인 화면으로 돌려보낸다.
(function () {
  const S = window.KioskState;
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId");
  const variantId = params.get("variantId");
  const sideId = params.get("sideId");
  const drinkId = params.get("drinkId");
  const target = params.get("target") === "side" ? "side" : "burger";

  const found = S.findItem(itemId);
  if (!found || !window.VARIANT_OPTIONS[variantId] || !window.SIDE_OPTIONS[sideId] || !window.DRINK_OPTIONS[drinkId]) {
    location.href = "menu.html";
    return;
  }

  const { item } = found;
  const displayName = S.pickText(item.name, item.nameEn);
  const isEn = S.getLang() === "en";
  const baseName = isEn ? displayName.replace(/\s*Set$/i, "") : displayName.replace(/\s*세트$/, "");
  const sideOpt = window.SIDE_OPTIONS[sideId];
  document.getElementById("ingredient-subtitle").textContent =
    target === "burger" ? baseName : S.pickText(sideOpt.label, sideOpt.labelEn);

  // 지금 선택 상태. 다른 쪽(버거↔사이드) 값은 그대로 들고 다닌다.
  const mods = S.parseMods(params.get(target === "burger" ? "burgerMods" : "sideMods"));
  const otherKey = target === "burger" ? "sideMods" : "burgerMods";

  // 확인/취소가 돌아갈 최종 확인 화면 주소(수량·수정 중인 항목은 그대로 유지)
  const base =
    `item-review.html?itemId=${encodeURIComponent(itemId)}&variantId=${encodeURIComponent(variantId)}` +
    `&sideId=${encodeURIComponent(sideId)}&drinkId=${encodeURIComponent(drinkId)}`;
  const carryParams = new URLSearchParams(location.search);
  carryParams.delete(target === "burger" ? "burgerMods" : "sideMods");
  const carry = S.carryQuery(carryParams);

  const confirmBtn = document.getElementById("btn-confirm");
  const cancelBtn = document.getElementById("btn-cancel");
  const ownKey = target === "burger" ? "burgerMods" : "sideMods";

  cancelBtn.href = base + carry + (params.get(ownKey) ? `&${ownKey}=${encodeURIComponent(params.get(ownKey))}` : "");

  function updateConfirm() {
    const value = S.stringifyMods(mods);
    confirmBtn.href = base + carry + (value ? `&${ownKey}=${encodeURIComponent(value)}` : "");
  }

  const STATES = [
    { sign: "", key: "modDefault" },
    { sign: "-", key: "modRemove" },
    { sign: "+", key: "modAdd" },
  ];

  const listEl = document.getElementById("ingredient-list");
  window.INGREDIENT_OPTIONS[target].forEach((opt) => {
    const row = document.createElement("div");
    row.className = "ingredient-row";

    const name = document.createElement("span");
    name.className = "ingredient-row__name";
    name.textContent = S.pickText(opt.label, opt.labelEn);
    row.appendChild(name);

    const group = document.createElement("div");
    group.className = "ingredient-row__states";
    STATES.forEach((state) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ingredient-row__btn";
      let text = S.t(state.key);
      if (state.sign === "+" && opt.addPrice > 0) text += ` +${S.formatPrice(opt.addPrice)}`;
      btn.textContent = text;
      const isSelected = () => (mods[opt.id] || "") === state.sign;
      btn.classList.toggle("is-selected", isSelected());
      btn.addEventListener("click", () => {
        if (state.sign) mods[opt.id] = state.sign;
        else delete mods[opt.id];
        group.querySelectorAll(".ingredient-row__btn").forEach((b, i) => {
          b.classList.toggle("is-selected", (mods[opt.id] || "") === STATES[i].sign);
        });
        updateConfirm();
      });
      group.appendChild(btn);
    });
    row.appendChild(group);
    listEl.appendChild(row);
  });

  updateConfirm();
})();

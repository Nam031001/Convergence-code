// src/screens/item-review.html 렌더링.
// 줄(버거/사이드/음료) 구조와 버튼은 html 에 이미 있고, 여기서는 이름/가격을 채우고
// 수량에 맞춰 "장바구니 추가" 링크(href)를 계속 갱신한다.
// cartItemId 가 있으면 "새로 담기"가 아니라 "장바구니에 이미 있는 항목 수정"이다.
(function () {
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId");
  const variantId = params.get("variantId");
  const sideId = params.get("sideId");
  const drinkId = params.get("drinkId");
  const cartItemId = params.get("cartItemId");

  const found = window.KioskState.findItem(itemId);
  const variant = window.VARIANT_OPTIONS[variantId];
  const side = window.SIDE_OPTIONS[sideId];
  const drink = window.DRINK_OPTIONS[drinkId];

  if (!found || !variant || !side || !drink) {
    location.href = "menu.html";
    return;
  }

  const { item } = found;
  const isEn = window.KioskState.getLang() === "en";
  const displayName = window.KioskState.pickText(item.name, item.nameEn);
  const baseName = isEn ? displayName.replace(/\s*Set$/i, "") : displayName.replace(/\s*세트$/, "");
  const variantLabel = window.KioskState.pickText(variant.label, variant.labelEn);
  const sideLabel = window.KioskState.pickText(side.label, side.labelEn);
  const drinkLabel = window.KioskState.pickText(drink.label, drink.labelEn);
  const burgerMods = params.get("burgerMods") || "";
  const sideMods = params.get("sideMods") || "";
  const unitPrice =
    item.price +
    variant.priceDelta +
    side.priceDelta +
    drink.priceDelta +
    window.KioskState.modsPrice("burger", burgerMods) +
    window.KioskState.modsPrice("side", sideMods);

  document.getElementById("review-title").textContent = `${baseName} - ${variantLabel}`;
  document.getElementById("line-burger-name").textContent = baseName;
  document.getElementById("line-side-name").textContent = sideLabel;
  document.getElementById("line-drink-name").textContent = drinkLabel;

  const idParam = encodeURIComponent(item.id);
  const variantParam = encodeURIComponent(variantId);
  const sideParam = encodeURIComponent(sideId);
  const drinkParam = encodeURIComponent(drinkId);
  const editSuffix = cartItemId ? `&cartItemId=${encodeURIComponent(cartItemId)}` : "";
  const modsSuffix =
    (burgerMods ? `&burgerMods=${encodeURIComponent(burgerMods)}` : "") +
    (sideMods ? `&sideMods=${encodeURIComponent(sideMods)}` : "");

  // 재료 변경 요약(선택한 게 있을 때만 보임)
  [["burger", burgerMods], ["side", sideMods]].forEach(([kind, value]) => {
    const labels = window.KioskState.modLabels(kind, value);
    const el = document.getElementById(`line-${kind}-mods`);
    el.textContent = labels.join(", ");
    el.hidden = labels.length === 0;
  });

  // 수정/재료 변경 화면에 갔다가 "확인"하면 이 화면으로 돌아오므로, 지금 고른 값 전부와 수량을 같이 들려 보낸다.
  // (수량은 수정 화면 다녀온 뒤에도 유지되도록 링크를 만들 때마다 현재 값으로 갱신한다.)
  const currentSelection = () =>
    `itemId=${idParam}&variantId=${variantParam}&sideId=${sideParam}&drinkId=${drinkParam}`;
  document.getElementById("btn-cancel").href = cartItemId
    ? "cart.html"
    : `menu.html?category=${encodeURIComponent(found.category.id)}`;

  const addCartBtn = document.getElementById("btn-add-cart");
  addCartBtn.textContent = cartItemId ? window.KioskState.t("editComplete") : window.KioskState.t("addToCart");

  const priceEl = document.getElementById("review-price");
  const qtyEl = document.getElementById("qty-value");
  let quantity = Math.max(1, Number(params.get("qty") || 1));

  function updateDisplay() {
    priceEl.textContent = window.KioskState.formatPrice(unitPrice * quantity);
    qtyEl.textContent = String(quantity);
    const tail = `&qty=${quantity}${editSuffix}${modsSuffix}`;
    addCartBtn.href = `item-added.html?${currentSelection()}${tail}`;
    document.getElementById("btn-side-edit").href = `item-side.html?${currentSelection()}&from=review${tail}`;
    document.getElementById("btn-drink-edit").href = `item-drink.html?${currentSelection()}&from=review${tail}`;
    document.getElementById("btn-burger-ingredient").href =
      `item-ingredient.html?${currentSelection()}&target=burger${tail}`;
    document.getElementById("btn-side-ingredient").href =
      `item-ingredient.html?${currentSelection()}&target=side${tail}`;
  }
  updateDisplay();

  document.getElementById("qty-minus").addEventListener("click", () => {
    if (quantity > 1) quantity -= 1;
    updateDisplay();
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    quantity += 1;
    updateDisplay();
  });

  document.getElementById("btn-nutrition")?.addEventListener("click", () => {
    console.log("nutrition info clicked:", item.name);
  });
})();

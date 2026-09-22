// src/screens/item-added.html 렌더링.
// 여기 도착하는 순간(=버튼 클릭이 아니라 "도착"이라는 사건)에 장바구니에 실제로 담는다/수정한다.
// URL에 있는 값만으로 세 가지 경우를 모두 처리한다:
//   1) 카테고리에서 바로 담기: ?itemId=ID (단품 가격 그대로 1개)
//   2) 단품/세트/사이드/음료를 다 고른 뒤 새로 담기: ?itemId=&variantId=&sideId=&drinkId=&qty=
//   3) 장바구니에 이미 있는 항목 수정: 위 파라미터 + &cartItemId=
(function () {
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId");
  const found = window.KioskState.findItem(itemId);

  if (!found) {
    location.href = "menu.html";
    return;
  }

  const { item, category } = found;
  const variant = window.VARIANT_OPTIONS[params.get("variantId")];
  const side = window.SIDE_OPTIONS[params.get("sideId")];
  const drink = window.DRINK_OPTIONS[params.get("drinkId")];
  const quantity = Math.max(1, Number(params.get("qty") || 1));
  const cartItemId = params.get("cartItemId");

  const burgerMods = params.get("burgerMods") || "";
  const sideMods = params.get("sideMods") || "";

  const unitPrice =
    item.price +
    (variant ? variant.priceDelta : 0) +
    (side ? side.priceDelta : 0) +
    (drink ? drink.priceDelta : 0) +
    window.KioskState.modsPrice("burger", burgerMods) +
    window.KioskState.modsPrice("side", sideMods);

  // 수정하기 링크를 다시 만들려면 표시용 이름뿐 아니라 id 값도 같이 들고 있어야 한다.
  // 언어는 index.html 에서 한 번 고르면 세션 내내 안 바뀌므로, 지금 언어로 고른 표시 문구를 그대로 저장해둔다.
  const cartItem = {
    itemId: item.id,
    name: window.KioskState.pickText(item.name, item.nameEn),
    badge: item.badge || null,
    variantId: params.get("variantId") || null,
    variantLabel: variant ? window.KioskState.pickText(variant.label, variant.labelEn) : null,
    sideId: params.get("sideId") || null,
    sideLabel: side ? window.KioskState.pickText(side.label, side.labelEn) : null,
    drinkId: params.get("drinkId") || null,
    drinkLabel: drink ? window.KioskState.pickText(drink.label, drink.labelEn) : null,
    // 재료 변경: 수정하기 링크용 원본 값(mods)과 화면에 보여줄 문구(labels)를 같이 저장
    burgerMods,
    sideMods,
    burgerModLabels: window.KioskState.modLabels("burger", burgerMods),
    sideModLabels: window.KioskState.modLabels("side", sideMods),
    unitPrice,
    qty: quantity,
  };

  const cart = cartItemId
    ? window.KioskState.replaceCartItem(cartItemId, cartItem)
    : window.KioskState.addCartItem(cartItem);

  const total = unitPrice * quantity;
  document.getElementById("added-price").textContent = window.KioskState.formatPrice(total);
  document.querySelector(".added-toast__title").innerHTML = window.KioskState.t(
    cartItemId ? "addedTitleEdit" : "addedTitleNew"
  );

  // 잠시 보여준 뒤, 수정이었으면 장바구니로, 새로 담은 거였으면 원래 보던 카테고리로 돌아간다.
  setTimeout(() => {
    location.href = cartItemId ? "cart.html" : `menu.html?category=${encodeURIComponent(category.id)}`;
  }, 1500);

  void cart; // 합계는 다음 화면(장바구니/메뉴)에서 다시 계산해서 보여준다.
})();

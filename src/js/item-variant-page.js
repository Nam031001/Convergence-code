// kiosk/item-variant.html 렌더링. 카드 3장의 구조는 html 에 이미 있고,
// 여기서는 상품명에 맞춰 문구를 채우고 각 카드(a 태그)의 href를 완성한다.
(function () {
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId");
  const found = window.KioskState.findItem(itemId);

  if (!found) {
    location.href = "menu.html";
    return;
  }

  const { item, category } = found;
  const displayName = window.KioskState.pickText(item.name, item.nameEn);
  // 위에 상품명(step-title)이 이미 떠 있으니 옵션 라벨은 이름을 반복하지 않고
  // VARIANT_OPTIONS 그대로("단품"/"세트"/"큰 세트(L)")만 보여준다.
  const singleOpt = window.VARIANT_OPTIONS.single;
  const setOpt = window.VARIANT_OPTIONS.set;
  const setLOpt = window.VARIANT_OPTIONS["set-l"];
  const singleLabel = window.KioskState.pickText(singleOpt.label, singleOpt.labelEn);
  const setLabel = window.KioskState.pickText(setOpt.label, setOpt.labelEn);
  const setLLabel = window.KioskState.pickText(setLOpt.label, setLOpt.labelEn);

  // 단품/세트/큰 세트는 서로 다른 "완성된 가격"이라 델타(+/-)보다 실제 가격을 보여주는 쪽이
  // 헷갈리지 않는다. item.price 가 세트 가격인지 단품 가격인지는 카테고리마다 달라서
  // (버거 카테고리는 단품 가격) getVariantPrice 가 그 차이를 반영해서 계산해준다.
  document.getElementById("step-title").textContent = displayName;
  document.getElementById("single-group-label").textContent = window.KioskState.t("burgerSingleTitle");
  document.getElementById("single-card-label").textContent = singleLabel;
  document.getElementById("single-card-delta").textContent = window.KioskState.formatPrice(
    window.KioskState.getVariantPrice(category, item.price, "single")
  );
  document.getElementById("set-group-label").textContent = window.KioskState.t("burgerSetTitle");
  document.getElementById("set-card-label").textContent = setLabel;
  document.getElementById("set-card-delta").textContent = window.KioskState.formatPrice(
    window.KioskState.getVariantPrice(category, item.price, "set")
  );
  document.getElementById("set-l-card-label").textContent = setLLabel;
  document.getElementById("set-l-card-delta").textContent = window.KioskState.formatPrice(
    window.KioskState.getVariantPrice(category, item.price, "set-l")
  );

  const idParam = encodeURIComponent(item.id);
  document.getElementById("option-single").href = `item-added.html?itemId=${idParam}&variantId=single`;
  document.getElementById("option-set").href = `item-side.html?itemId=${idParam}&variantId=set`;
  document.getElementById("option-set-l").href = `item-side.html?itemId=${idParam}&variantId=set-l`;
  document.getElementById("btn-cancel-detail").href = `menu.html?category=${encodeURIComponent(category.id)}`;

  // 영양정보 버튼은 일단 각주 처리(주석)해놔서 DOM에 없을 수 있다.
  document.getElementById("btn-nutrition")?.addEventListener("click", () => {
    // TODO: 실제 영양정보 화면/모달 붙일 자리
    console.log("nutrition info clicked:", item.name);
  });

  window.KioskState.renderStepNav(document.getElementById("step-nav-list"), "variant", { itemId: item.id });
})();

// src/screens/item-side.html 렌더링.
// 카드 선택은 "다음 화면으로 이동"이 아니라 이 화면 안에서의 상태 변화라 버튼으로 두고,
// 실제 다음 화면 이동(확인/이전)만 a 태그로 구현한다. "확인"의 href는 선택된 카드에 맞춰 계속 갱신된다.
// cartItemId 가 있으면 "새로 담기"가 아니라 "장바구니에 이미 있는 항목 수정"이다.
(function () {
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId");
  const variantId = params.get("variantId");
  const cartItemId = params.get("cartItemId");
  const fromReview = params.get("from") === "review"; // 최종 확인 화면의 "수정"으로 들어온 경우
  const currentSideId = params.get("sideId");
  const currentDrinkId = params.get("drinkId");
  const found = window.KioskState.findItem(itemId);
  const variant = window.VARIANT_OPTIONS[variantId];

  if (!found || !variant) {
    location.href = "menu.html";
    return;
  }

  const { item, category } = found;
  document.getElementById("step-title").textContent = window.KioskState.pickText(item.name, item.nameEn);

  const idParam = encodeURIComponent(item.id);
  const variantParam = encodeURIComponent(variantId);
  // 수정 중인 장바구니 항목/재료 변경/수량은 화면을 넘나들어도 유지한다.
  const carry = window.KioskState.carryQuery(params);
  const reviewBase = () =>
    `item-review.html?itemId=${idParam}&variantId=${variantParam}` +
    `&sideId=${encodeURIComponent(currentSideId)}&drinkId=${encodeURIComponent(currentDrinkId)}`;

  // 취소: 이 상품 주문을 그만두고 목록으로(장바구니 항목 수정 중이면 장바구니로)
  document.getElementById("btn-cancel").href = cartItemId
    ? "cart.html"
    : `menu.html?category=${encodeURIComponent(category.id)}`;

  // 이전: 단품/세트 선택으로 돌아간다. 그 선택 자체가 없는 상품(추천메뉴/웰런치,
  // category.fixedVariant)은 이 화면이 첫 단계라 이전 버튼 자체를 감춘다.
  const btnPrev = document.getElementById("btn-prev");
  if (category.fixedVariant) {
    btnPrev.hidden = true;
  } else {
    btnPrev.href = `item-variant.html?itemId=${idParam}${carry}`;
  }

  // 사이드 카드를 누르는 것 자체가 선택 완료다: 카드는 다음 화면으로 가는 링크(a)다.
  // (최종 확인에서 "수정"으로 왔으면 음료 선택을 건너뛰고 최종 확인으로 돌아간다.)
  function hrefFor(card) {
    const sideParam = encodeURIComponent(card.dataset.id);
    if (fromReview) {
      // 사이드가 바뀌면 그 사이드용 재료 변경은 의미가 없어지므로 버린다.
      const carryParams = new URLSearchParams(location.search);
      if (card.dataset.id !== currentSideId) carryParams.delete("sideMods");
      return (
        `item-review.html?itemId=${idParam}&variantId=${variantParam}&sideId=${sideParam}` +
        `&drinkId=${encodeURIComponent(currentDrinkId)}` +
        window.KioskState.carryQuery(carryParams)
      );
    }
    // 수정 중이면 지금 고른 음료도 같이 넘겨서 음료 화면에서 미리 선택돼 있게 한다.
    return (
      `item-drink.html?itemId=${idParam}&variantId=${variantParam}&sideId=${sideParam}` +
      (currentDrinkId ? `&drinkId=${encodeURIComponent(currentDrinkId)}` : "") +
      carry
    );
  }

  document.querySelectorAll("#side-options .option-card").forEach((card) => {
    const option = window.SIDE_OPTIONS[card.dataset.id];
    if (option) {
      card.querySelector(".option-card__label").textContent = window.KioskState.pickText(
        option.label,
        option.labelEn
      );
      const deltaEl = card.querySelector(".option-card__delta");
      deltaEl.textContent = window.KioskState.formatDelta(option.priceDelta);
      deltaEl.hidden = !option.priceDelta;
    }
    card.href = hrefFor(card);
    // 이미 고른 사이드가 있으면(수정) 표시만 해 둔다.
    if (currentSideId && card.dataset.id === currentSideId) card.classList.add("is-selected");
  });

  document.getElementById("btn-nutrition")?.addEventListener("click", () => {
    console.log("nutrition info clicked:", item.name);
  });

  window.KioskState.renderStepNav(document.getElementById("step-nav-list"), "side", {
    itemId: item.id,
    variantId,
    cartItemId,
    variantLocked: !!category.fixedVariant,
  });
})();

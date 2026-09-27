// src/screens/item-drink.html 렌더링.
// 카드 선택/페이지 넘김은 이 화면 안에서의 상태 변화라 버튼으로 두고,
// 실제 다음 화면 이동(확인/이전)만 a 태그로 구현한다. "확인"의 href는 선택된 카드에 맞춰 계속 갱신된다.
// cartItemId 가 있으면 "새로 담기"가 아니라 "장바구니에 이미 있는 항목 수정"이다.
(function () {
  const params = new URLSearchParams(location.search);
  const itemId = params.get("itemId");
  const variantId = params.get("variantId");
  const sideId = params.get("sideId");
  const cartItemId = params.get("cartItemId");
  const fromReview = params.get("from") === "review"; // 최종 확인 화면의 "수정"으로 들어온 경우
  const currentDrinkId = params.get("drinkId");
  const found = window.KioskState.findItem(itemId);
  const variant = window.VARIANT_OPTIONS[variantId];
  const side = window.SIDE_OPTIONS[sideId];

  if (!found || !variant || !side) {
    location.href = "menu.html";
    return;
  }

  const { item, category } = found;
  document.getElementById("step-title").textContent = window.KioskState.pickText(item.name, item.nameEn);

  const idParam = encodeURIComponent(item.id);
  const variantParam = encodeURIComponent(variantId);
  const sideParam = encodeURIComponent(sideId);
  // 수정 중인 장바구니 항목/재료 변경/수량은 화면을 넘나들어도 유지한다.
  const carry = window.KioskState.carryQuery(params);

  // 돌아가기: 최종 확인의 "수정"으로 들어온 경우에만 보인다. "취소"는 전체 주문을
  // 그만두는 큰 동작이라, 그냥 음료를 안 바꾸고 되돌아가고 싶을 때 잘못 누르면
  // 위험하다 — 아무것도 안 바꾼 채 원래 있던 최종 확인 화면으로 그대로 돌아간다.
  const btnBack = document.getElementById("btn-back");
  const btnPrev = document.getElementById("btn-prev");  function reviewHref(drinkId) {
    return (
      `item-review.html?itemId=${idParam}&variantId=${variantParam}&sideId=${sideParam}` +
      `&drinkId=${encodeURIComponent(drinkId)}${carry}`
    );
  }

  if (fromReview) {
    btnBack.href = reviewHref(currentDrinkId);
  } else {
    btnBack.hidden = true;
  }

  // 이전: 사이드 선택으로 돌아간다. 지금 고른 음료도 같이 들고 가서, 사이드만 바꾸고
  // 다시 넘어오면 음료 선택이 그대로 남아있게 한다.
  // 최종 주문 확인(장바구니)의 "수정하기"로 들어온 경우엔 장바구니로 돌아간다.
  btnPrev.href = cartItemId
    ? "cart.html"
    : `item-side.html?itemId=${idParam}&variantId=${variantParam}&sideId=${sideParam}` +
      (currentDrinkId ? `&drinkId=${encodeURIComponent(currentDrinkId)}` : "") +
      carry;

  const cards = Array.from(document.querySelectorAll(".option-page .option-card"));

  // 수정으로 들어온 경우엔 사이드 화면과 똑같이 "돌아가기"만 남긴다.
  if (fromReview) {
    btnPrev.hidden = true;
  }

  // 음료 카드를 누르는 것 자체가 선택 완료다: 카드는 최종 확인 화면으로 가는 링크(a)다.
  cards.forEach((card) => {
    const option = window.DRINK_OPTIONS[card.dataset.id];
    if (option) {
      card.querySelector(".option-card__label").textContent = window.KioskState.pickText(
        option.label,
        option.labelEn
      );
      const deltaEl = card.querySelector(".option-card__delta");
      deltaEl.textContent = window.KioskState.formatDelta(option.priceDelta);
      deltaEl.hidden = !option.priceDelta;
    }
    // 최종 주문 확인(장바구니)의 "수정하기"로 왔으면 바로 저장 후 장바구니로 돌아간다.
    card.href =
      cartItemId && !fromReview
        ? `item-added.html?itemId=${idParam}&variantId=${variantParam}&sideId=${sideParam}` +
          `&drinkId=${encodeURIComponent(card.dataset.id)}${carry}`
        : reviewHref(card.dataset.id);
  });

  // ---------- 페이지 넘김 (음료 옵션이 많아 여러 페이지로 나뉨. 화면 이동이 아니라 같은 화면 안 상태) ----------
  let currentPage = 0;
  const pages = document.querySelectorAll(".option-page");
  const dotsEl = document.getElementById("drink-dots");
  const prevPageBtn = document.getElementById("drink-prev-page");
  const nextPageBtn = document.getElementById("drink-next-page");

  function renderPager() {
    pages.forEach((page, index) => page.classList.toggle("is-active", index === currentPage));

    dotsEl.innerHTML = "";
    pages.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.className = "menu-pager__dot" + (index === currentPage ? " is-active" : "");
      dotsEl.appendChild(dot);
    });

    prevPageBtn.disabled = currentPage === 0;
    nextPageBtn.disabled = currentPage >= pages.length - 1;
  }

  prevPageBtn.addEventListener("click", () => {
    currentPage -= 1;
    renderPager();
  });
  nextPageBtn.addEventListener("click", () => {
    currentPage += 1;
    renderPager();
  });
  renderPager();

  document.getElementById("btn-nutrition")?.addEventListener("click", () => {
    console.log("nutrition info clicked:", item.name);
  });

  window.KioskState.renderStepNav(document.getElementById("step-nav-list"), "drink", {
    itemId: item.id,
    variantId,
    sideId,
    cartItemId,
    variantLocked: !!category.fixedVariant,
  });
})();

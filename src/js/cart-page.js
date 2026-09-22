// src/screens/cart.html 렌더링 ("주문 확인").
// 지우기/수량 변경은 버튼 클릭이 아니라 "그 액션이 담긴 링크로 도착"하는 순간 처리하고,
// 처리 후에는 깨끗한 URL로 다시 이동해서 새로고침해도 같은 동작이 반복되지 않게 한다.
(function () {
  const THUMB_SVG = `
    <svg class="cart-item__thumb-icon" viewBox="0 0 48 48" fill="none">
      <path d="M6 20c0-6 8-11 18-11s18 5 18 11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="5" y="21" width="38" height="6" rx="3" fill="currentColor"/>
      <rect x="6" y="29" width="36" height="5" rx="2.5" fill="currentColor" opacity="0.55"/>
      <path d="M4 36c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4s-1.8 4-4 4H8c-2.2 0-4-1.8-4-4Z" fill="currentColor"/>
    </svg>`;

  const PAGE_SIZE = 3;
  const params = new URLSearchParams(location.search);
  const page = Math.max(0, Number(params.get("page") || 0));

  const removeId = params.get("remove");
  const incId = params.get("inc");
  const decId = params.get("dec");

  if (removeId) {
    window.KioskState.removeCartItem(removeId);
    location.replace(`cart.html?page=${page}`);
    return;
  }
  if (incId) {
    window.KioskState.updateCartItemQty(incId, 1);
    location.replace(`cart.html?page=${page}`);
    return;
  }
  if (decId) {
    window.KioskState.updateCartItemQty(decId, -1);
    location.replace(`cart.html?page=${page}`);
    return;
  }

  const cart = window.KioskState.getCart();
  const listEl = document.getElementById("cart-list");
  const pagerPrev = document.getElementById("cart-pager-prev");
  const pagerNext = document.getElementById("cart-pager-next");
  const dotsEl = document.getElementById("cart-pager-dots");
  const totalEl = document.getElementById("cart-summary-total");
  const completeBtn = document.getElementById("btn-complete");

  totalEl.textContent = window.KioskState.formatPrice(cart.total);

  if (cart.items.length === 0) {
    listEl.innerHTML = `<p class="cart-empty">${window.KioskState.t("emptyCart")}</p>`;
    completeBtn.removeAttribute("href");
    pagerPrev.classList.add("is-hidden");
    pagerNext.classList.add("is-hidden");
    dotsEl.classList.add("is-hidden");
    return;
  }

  const pageCount = Math.max(1, Math.ceil(cart.items.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * PAGE_SIZE;
  const pageItems = cart.items.slice(start, start + PAGE_SIZE);

  pageItems.forEach((it) => listEl.appendChild(buildCartItemEl(it, safePage)));

  // 메인 화면(menu.html)의 쪽넘김과 같은 배치: 화살표는 항상 보이고, 더 넘길 페이지가
  // 없는 쪽만 is-disabled 로 흐리게 표시한다(사라지는 게 아니라 자리는 그대로 차지).
  const hasPager = pageCount > 1;
  pagerPrev.classList.toggle("is-hidden", !hasPager);
  pagerNext.classList.toggle("is-hidden", !hasPager);
  dotsEl.classList.toggle("is-hidden", !hasPager);
  pagerPrev.classList.remove("is-disabled");
  pagerNext.classList.remove("is-disabled");

  if (safePage > 0) {
    pagerPrev.href = `cart.html?page=${safePage - 1}`;
  } else {
    pagerPrev.removeAttribute("href");
    pagerPrev.classList.add("is-disabled");
  }
  if (safePage < pageCount - 1) {
    pagerNext.href = `cart.html?page=${safePage + 1}`;
  } else {
    pagerNext.removeAttribute("href");
    pagerNext.classList.add("is-disabled");
  }

  dotsEl.innerHTML = "";
  for (let i = 0; i < pageCount; i++) {
    const dot = document.createElement("span");
    dot.className = "menu-pager__dot" + (i === safePage ? " is-active" : "");
    dotsEl.appendChild(dot);
  }

  function editHref(page, it) {
    const idParam = encodeURIComponent(it.itemId);
    // 수정하는 항목의 현재 선택(사이드/음료/재료 변경/수량)을 그대로 들고 가서 미리 선택된 상태로 열리게 한다.
    const keep =
      `&cartItemId=${encodeURIComponent(it.id)}` +
      (it.burgerMods ? `&burgerMods=${encodeURIComponent(it.burgerMods)}` : "") +
      (it.sideMods ? `&sideMods=${encodeURIComponent(it.sideMods)}` : "") +
      `&qty=${it.qty}`;
    if (page === "side") {
      return (
        `item-side.html?itemId=${idParam}&variantId=${encodeURIComponent(it.variantId)}` +
        `&sideId=${encodeURIComponent(it.sideId)}&drinkId=${encodeURIComponent(it.drinkId)}${keep}`
      );
    }
    return (
      `item-drink.html?itemId=${idParam}&variantId=${encodeURIComponent(it.variantId)}` +
      `&sideId=${encodeURIComponent(it.sideId)}&drinkId=${encodeURIComponent(it.drinkId)}${keep}`
    );
  }

  function buildCartItemEl(it, currentPage) {
    const el = document.createElement("div");
    el.className = "cart-item";

    const optionRows = [];
    const editLabel = window.KioskState.t("editLink");
    const modLines = [...(it.burgerModLabels || []), ...(it.sideModLabels || [])];
    if (modLines.length) {
      optionRows.push(`<p class="cart-item__mods">${modLines.join(", ")}</p>`);
    }
    if (it.sideLabel) {
      optionRows.push(`
        <div class="cart-item__option">
          <span class="cart-item__option-label">${it.sideLabel}</span>
          <a class="cart-item__edit" href="${editHref("side", it)}">${editLabel}</a>
        </div>`);
    }
    if (it.drinkLabel) {
      optionRows.push(`
        <div class="cart-item__option">
          <span class="cart-item__option-label">${it.drinkLabel}</span>
          <a class="cart-item__edit" href="${editHref("drink", it)}">${editLabel}</a>
        </div>`);
    }

    el.innerHTML = `
      <div class="cart-item__thumb" aria-hidden="true">
        ${it.badge ? `<span class="cart-item__badge">${it.badge === "new" ? "NEW" : it.badge}</span>` : ""}
        ${THUMB_SVG}
      </div>
      <div class="cart-item__body">
        <div class="cart-item__top">
          <p class="cart-item__name">${it.name}</p>
          <a class="cart-item__remove" href="cart.html?remove=${encodeURIComponent(it.id)}&page=${currentPage}">${window.KioskState.t("remove")}</a>
        </div>
        ${optionRows.join("")}
        <div class="cart-item__footer">
          <span class="cart-item__price">${window.KioskState.formatPrice(it.unitPrice * it.qty)}</span>
          <div class="cart-item__qty">
            <a class="cart-item__qty-btn" href="cart.html?dec=${encodeURIComponent(it.id)}&page=${currentPage}" aria-label="${window.KioskState.t("qtyMinus")}">−</a>
            <span class="cart-item__qty-value">${it.qty}</span>
            <a class="cart-item__qty-btn" href="cart.html?inc=${encodeURIComponent(it.id)}&page=${currentPage}" aria-label="${window.KioskState.t("qtyPlus")}">+</a>
          </div>
        </div>
      </div>
    `;
    return el;
  }
})();

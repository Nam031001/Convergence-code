// kiosk/menu.html 렌더링. 카테고리/페이지는 URL(?category=&page=)로 정해지고,
// 추천메뉴/웰런치/버거 카드는 실제 링크(<a href>)로 item-variant.html(단품/세트)로 이동하고,
// 나머지 카테고리 카드는 화면 이동 없이 이 페이지 위에 뜨는 빠른 담기 팝업을 연다.
(function () {
  const PAGE_SIZE = 6;
  const CATEGORIES_WITH_DETAIL = ["recommend", "welunch", "burger"];

  const params = new URLSearchParams(location.search);
  window.KioskState.getOrderType(); // orderType 을 세션에 기록해둔다(다른 화면에서 필요할 수 있음)

  const activeCategoryId = params.get("category") || "recommend";
  const currentPage = Math.max(0, Number(params.get("page") || 0));

  const category =
    window.MENU_CATEGORIES.find((c) => c.id === activeCategoryId) || window.MENU_CATEGORIES[0];

  document.getElementById("menu-title").textContent = window.KioskState.pickText(category.label, category.labelEn);
  window.KioskState.renderCategoryNav(document.getElementById("category-nav-list"), category.id);

  // ---------- 장바구니 미리보기 ----------
  // 페이지 이동 없이 지금 화면 하단에 담긴 항목/수량을 바로 보여준다.
  // 항목이 칸보다 많으면 ︿/﹀ 화살표로 이전/다음 항목이 보이도록 목록을 한 항목씩 넘긴다.
  const cartPreviewListEl = document.getElementById("cart-preview-list");
  const cartPrevBtn = document.getElementById("cart-preview-prev");
  const cartNextBtn = document.getElementById("cart-preview-next");

  // 수량 1개에서 "-"를 누르면 바로 빼지 않고 삭제 확인 팝업을 띄운다.
  // (빠른 담기 팝업과 같은 .quick-add-modal 틀을 재사용)
  const confirmRemoveModal = document.getElementById("confirm-remove-modal");
  let pendingRemoveItemId = null;

  function openConfirmRemove(itemId) {
    pendingRemoveItemId = itemId;
    confirmRemoveModal.hidden = false;
  }

  function closeConfirmRemove() {
    confirmRemoveModal.hidden = true;
    pendingRemoveItemId = null;
  }

  document.getElementById("confirm-remove-cancel").addEventListener("click", closeConfirmRemove);
  confirmRemoveModal.addEventListener("click", (e) => {
    if (e.target === confirmRemoveModal) closeConfirmRemove();
  });
  document.getElementById("confirm-remove-ok").addEventListener("click", () => {
    if (!pendingRemoveItemId) return;
    window.KioskState.removeCartItem(pendingRemoveItemId);
    closeConfirmRemove();
    renderCartPreview();
  });

  function updateCartPreviewNav() {
    const el = cartPreviewListEl;
    cartPrevBtn.disabled = el.scrollTop <= 1;
    cartNextBtn.disabled = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
  }

  function stepCartPreview(direction) {
    const el = cartPreviewListEl;
    const items = Array.from(el.querySelectorAll(".cart-preview__item"));
    const target =
      direction > 0
        ? items.find((item) => item.offsetTop > el.scrollTop + 2)
        : items.reverse().find((item) => item.offsetTop < el.scrollTop - 2);
    // 더 넘길 항목이 없어도 끝까지(아래는 마지막 항목 하단, 위는 맨 위) 마저 보여준다.
    const top = target ? target.offsetTop : direction > 0 ? el.scrollHeight : 0;
    el.scrollTo({ top, behavior: "smooth" });
    // 스크롤 이벤트에 더해, 애니메이션이 끝난 뒤에도 한 번 더 화살표 활성 상태를 맞춘다.
    updateCartPreviewNav();
    setTimeout(updateCartPreviewNav, 450);
  }

  function renderCartPreview() {
    window.KioskState.renderCartBar(document);

    const cart = window.KioskState.getCart();
    const prevScrollTop = cartPreviewListEl.scrollTop; // 수량을 바꿔도 보던 위치를 유지
    cartPreviewListEl.innerHTML = "";

    if (cart.items.length === 0) {
      updateCartPreviewNav();
      return;
    }

    cart.items.forEach((it) => {
      const row = document.createElement("div");
      row.className = "cart-preview__item";

      const modLines = [...(it.burgerModLabels || []), ...(it.sideModLabels || [])];
      const optionLines = [it.sideLabel, it.drinkLabel, modLines.join(", ")].filter(Boolean);
      row.innerHTML = `
        <div class="cart-preview__info">
          <p class="cart-preview__name">${it.name}</p>
          ${optionLines.map((label) => `<p class="cart-preview__option">${label}</p>`).join("")}
        </div>
        <div class="cart-preview__qty">
          <button class="cart-preview__qty-btn" type="button" aria-label="${window.KioskState.t("qtyMinus")}">−</button>
          <span class="cart-preview__qty-value">${it.qty}</span>
          <button class="cart-preview__qty-btn" type="button" aria-label="${window.KioskState.t("qtyPlus")}">+</button>
        </div>
      `;

      const [minusBtn, plusBtn] = row.querySelectorAll(".cart-preview__qty-btn");
      minusBtn.addEventListener("click", () => {
        if (it.qty > 1) {
          window.KioskState.updateCartItemQty(it.id, -1);
          renderCartPreview();
        } else {
          openConfirmRemove(it.id);
        }
      });
      plusBtn.addEventListener("click", () => {
        window.KioskState.updateCartItemQty(it.id, 1);
        renderCartPreview();
      });

      cartPreviewListEl.appendChild(row);
    });

    cartPreviewListEl.scrollTop = prevScrollTop;
    updateCartPreviewNav();
  }

  renderCartPreview();

  cartPrevBtn.addEventListener("click", () => stepCartPreview(-1));
  cartNextBtn.addEventListener("click", () => stepCartPreview(1));
  cartPreviewListEl.addEventListener("scroll", updateCartPreviewNav, { passive: true });

  function buildCard(item) {
    const isDetail = CATEGORIES_WITH_DETAIL.includes(category.id);
    const el = document.createElement(isDetail ? "a" : "button");
    el.className = "menu-card";
    if (isDetail) {
      el.href = `item-variant.html?itemId=${encodeURIComponent(item.id)}`;
    } else {
      el.type = "button";
      el.addEventListener("click", () => openQuickAddModal(item));
    }
    el.innerHTML = `
      <span class="menu-card__thumb" aria-hidden="true">
        ${item.badge ? `<span class="menu-card__badge">${item.badge === "new" ? "NEW" : item.badge}</span>` : ""}
        <svg class="menu-card__thumb-icon" viewBox="0 0 48 48" fill="none">
          <path d="M6 20c0-6 8-11 18-11s18 5 18 11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
          <rect x="5" y="21" width="38" height="6" rx="3" fill="currentColor"/>
          <rect x="6" y="29" width="36" height="5" rx="2.5" fill="currentColor" opacity="0.55"/>
          <path d="M4 36c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4s-1.8 4-4 4H8c-2.2 0-4-1.8-4-4Z" fill="currentColor"/>
        </svg>
      </span>
      <span class="menu-card__name">${window.KioskState.pickText(item.name, item.nameEn)}</span>
      <span class="menu-card__price">${item.price.toLocaleString()}<span class="menu-card__price-won">${window.KioskState.t("won")}</span></span>
    `;
    return el;
  }

  // ---------- 빠른 담기 팝업 ----------
  // 화면 이동이 아니라 이 화면 위에 뜨는 대화상자라서 버튼 + JS로 직접 처리한다.
  const modal = document.getElementById("quick-add-modal");
  const modalNameEl = document.getElementById("quick-add-name");
  const modalPriceEl = document.getElementById("quick-add-price");
  const modalQtyEl = document.getElementById("quick-add-qty-value");
  let modalItem = null;
  let modalQty = 1;

  function updateModalDisplay() {
    modalQtyEl.textContent = String(modalQty);
    modalPriceEl.textContent = window.KioskState.formatPrice(modalItem.price * modalQty);
    // 담기는 화면 이동이다: item-added.html 에 도착하는 순간 장바구니에 담고 "메뉴가 추가되었습니다"를 보여준 뒤 이 카테고리로 돌아온다.
    document.getElementById("quick-add-confirm").href =
      `item-added.html?itemId=${encodeURIComponent(modalItem.id)}&qty=${modalQty}`;
  }

  function openQuickAddModal(item) {
    modalItem = item;
    modalQty = 1;
    modalNameEl.textContent = window.KioskState.pickText(item.name, item.nameEn);
    updateModalDisplay();
    modal.hidden = false;
  }

  function closeQuickAddModal() {
    modal.hidden = true;
    modalItem = null;
  }

  document.getElementById("quick-add-qty-minus").addEventListener("click", () => {
    if (modalQty > 1) modalQty -= 1;
    updateModalDisplay();
  });
  document.getElementById("quick-add-qty-plus").addEventListener("click", () => {
    modalQty += 1;
    updateModalDisplay();
  });
  document.getElementById("quick-add-cancel").addEventListener("click", closeQuickAddModal);
  // 팝업 카드 바깥(어두운 배경)을 눌러도 취소와 같이 닫는다.
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeQuickAddModal();
  });
  document.getElementById("quick-add-nutrition")?.addEventListener("click", () => {
    // TODO: 실제 영양정보 화면/모달 붙일 자리
    console.log("nutrition info clicked:", modalItem && modalItem.name);
  });

  const pageCount = Math.max(1, Math.ceil(category.items.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount - 1);
  const start = safePage * PAGE_SIZE;
  const pageItems = category.items.slice(start, start + PAGE_SIZE);

  const gridEl = document.getElementById("menu-grid");
  pageItems.forEach((item) => gridEl.appendChild(buildCard(item)));

  const hasPager = pageCount > 1;
  const pagerPrev = document.getElementById("pager-prev");
  const pagerNext = document.getElementById("pager-next");
  const dotsEl = document.getElementById("menu-dots");

  pagerPrev.classList.toggle("is-hidden", !hasPager);
  pagerNext.classList.toggle("is-hidden", !hasPager);
  dotsEl.classList.toggle("is-hidden", !hasPager);

  if (safePage > 0) {
    pagerPrev.href = `menu.html?category=${encodeURIComponent(category.id)}&page=${safePage - 1}`;
  } else {
    pagerPrev.classList.add("is-disabled");
  }
  if (safePage < pageCount - 1) {
    pagerNext.href = `menu.html?category=${encodeURIComponent(category.id)}&page=${safePage + 1}`;
  } else {
    pagerNext.classList.add("is-disabled");
  }

  for (let i = 0; i < pageCount; i++) {
    const dot = document.createElement("span");
    dot.className = "menu-pager__dot" + (i === safePage ? " is-active" : "");
    dotsEl.appendChild(dot);
  }

  // 스크롤 버튼은 화면 구성에 따라 없을 수도 있어(주석 처리 등) 있을 때만 연결한다.
  document.getElementById("scroll-up")?.addEventListener("click", () => {
    document.getElementById("menu-scroll-area").scrollBy({ top: -280, behavior: "smooth" });
  });
  document.getElementById("scroll-down")?.addEventListener("click", () => {
    document.getElementById("menu-scroll-area").scrollBy({ top: 280, behavior: "smooth" });
  });

  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      // TODO: 다국어 지원 붙일 자리
      console.log("language toggle clicked");
    });
  }

  // 처음으로 돌아가면 새 손님의 새 주문이 시작되는 것이므로 담겨있던 장바구니를 비운다.
  // 실제 이동(href)은 그대로 두고, 이동 직전에 정리만 해준다.
  document.getElementById("btn-home")?.addEventListener("click", () => {
    window.KioskState.clearCart();
  });
})();

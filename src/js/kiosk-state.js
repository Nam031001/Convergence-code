// 모든 kiosk 페이지가 공유하는 상태(주문 방식·장바구니·접근성 설정)와
// 사이드바 링크 렌더링 유틸. 화면 이동은 실제 페이지 이동(<a href>)이므로,
// 예전처럼 JS 메모리에 상태를 두면 페이지가 바뀔 때 사라진다 — 그래서 sessionStorage에 둔다.
window.KioskState = (function () {
  const ORDER_TYPE_KEY = "kiosk.orderType";
  const CART_ITEMS_KEY = "kiosk.cartItems";
  const CONTRAST_KEY = "kiosk.highContrast";
  const LOW_STANCE_KEY = "kiosk.lowStance";
  const LANG_KEY = "kiosk.lang";

  // ---------- 언어(ENG 버튼) ----------
  // index.html 에서 한 번 고르면 sessionStorage 에 저장되고, 이후 페이지 이동을 통해
  // 메뉴/옵션 이름 등에 계속 반영된다("ko" | "en").
  function getLang() {
    return sessionStorage.getItem(LANG_KEY) || "ko";
  }

  function setLang(lang) {
    sessionStorage.setItem(LANG_KEY, lang);
    return lang;
  }

  function toggleLang() {
    return setLang(getLang() === "en" ? "ko" : "en");
  }

  // 한국어/영어 텍스트 쌍에서 현재 언어에 맞는 쪽을 고른다. 영어 표기가 없으면 한국어로 대체.
  function pickText(ko, en) {
    return getLang() === "en" && en ? en : ko;
  }

  // ---------- 화면 전반의 고정 문구(버튼/제목/안내 등) ----------
  // 메뉴/옵션 이름처럼 데이터에 딸린 게 아니라 화면에 박혀있는 문구들의 유일한 기준.
  const UI_STRINGS = {
    pageTitle: { ko: "맥도날드 키오스크", en: "McDonald's Kiosk" },
    logoAlt: { ko: "맥도날드 로고", en: "McDonald's logo" },
    bannerAlt: {
      ko: "더블 맥스파이시 상하이 버거 - 버거의 맛과 크기를 더블로 높였다!",
      en: "Double McSpicy Shanghai Burger - doubled the taste and size of a burger!",
    },
    dineIn: { ko: "매장", en: "Dine In" },
    takeout: { ko: "포장", en: "Takeout" },
    home: { ko: "처음으로", en: "Home" },
    confirmHome: {
      ko: "처음 화면으로 돌아가시겠습니까?<br>담긴 메뉴가 모두 삭제됩니다.",
      en: "Go back to the start screen?<br>Everything in your cart will be cleared.",
    },
    orderNow: { ko: "주문하기", en: "Order Now" },
    won: { ko: "원", en: "won" },
    nutrition: { ko: "영양정보", en: "Nutrition Info" },
    cancel: { ko: "취소", en: "Cancel" },
    confirm: { ko: "확인", en: "Confirm" },
    prev: { ko: "이전", en: "Previous" },
    addToCart: { ko: "장바구니 추가", en: "Add to Cart" },
    editComplete: { ko: "수정 완료", en: "Update" },
    edit: { ko: "수정", en: "Edit" },
    editLink: { ko: "수정하기", en: "Edit" },
    remove: { ko: "지우기", en: "Remove" },
    confirmRemove: { ko: "삭제하시겠습니까?", en: "Remove this item?" },
    ingredientEdit: { ko: "재료추가/변경", en: "Add/Change Ingredients" },
    qtyMinus: { ko: "수량 줄이기", en: "Decrease quantity" },
    qtyPlus: { ko: "수량 늘리기", en: "Increase quantity" },
    prevMenuPage: { ko: "이전 메뉴", en: "Previous items" },
    nextMenuPage: { ko: "다음 메뉴", en: "Next items" },
    prevPage: { ko: "이전 페이지", en: "Previous page" },
    nextPage: { ko: "다음 페이지", en: "Next page" },
    emptyCart: { ko: "담긴 메뉴가 없습니다.", en: "Your cart is empty." },
    lowStanceSoon: { ko: "낮은 자세 기능은 아직 준비중입니다.", en: "Low stance mode is coming soon." },
    orderSummaryTitle: { ko: "주문 확인", en: "Order Summary" },
    totalLabel: { ko: "합계", en: "Total" },
    orderCompleteBtn: { ko: "결제하기", en: "Pay" }, // 실제로는 결제 화면(payment.html)으로 넘어가는 버튼이라 "주문완료"는 부정확했다.
    addMoreBtn: { ko: "메뉴 추가", en: "Add More" }, // cart.html 전용. 실제로는 menu.html 로 돌아가는 버튼이라 공용 "cancel" 대신 따로 둔다.
    helpTitle: { ko: "도움 기능", en: "Help" },
    helpQuestion: { ko: "도움이 필요하신가요?", en: "Need help?" },
    helpDescLine1: { ko: "화면 앞에서 잠시만 기다려주세요.", en: "Please wait in front of the screen for a moment." },
    helpDescLine2: { ko: "매장 직원이 도와드리러 오겠습니다.", en: "A staff member will come to assist you." },
    backToMenu: { ko: "메뉴로 돌아가기", en: "Back to Menu" },
    addedTitleNew: {
      ko: "주문 내역에<br>메뉴가 추가되었습니다.",
      en: "Your item has been<br>added to the order.",
    },
    addedTitleEdit: {
      ko: "장바구니 항목이<br>수정되었습니다.",
      en: "Your cart item has<br>been updated.",
    },
    paymentCompleteTitle: { ko: "결제가 완료되었습니다.", en: "Payment complete." },
    paymentSelectTitle: { ko: "결제방법 선택", en: "Select Payment Method" },
    paymentSelectDesc: { ko: "결제방법을 선택해주세요", en: "Please choose a payment method" },
    paymentMobileVoucher: { ko: "모바일 상품권", en: "Mobile Voucher" },
    paymentCard: { ko: "카드 결제", en: "Card Payment" },
    paymentEasyPay: { ko: "간편 결제", en: "Easy Pay" },
    ingredientTitle: { ko: "재료 추가/변경", en: "Customize Ingredients" },
    ingredientBurger: { ko: "버거", en: "Burger" },
    ingredientSide: { ko: "사이드", en: "Side" },
    modDefault: { ko: "기본", en: "Regular" },
    modRemove: { ko: "빼기", en: "No" },
    modAdd: { ko: "추가", en: "Extra" },
    burgerSingleTitle: { ko: "햄버거 단품", en: "Burger Single" },
    burgerSetTitle: { ko: "햄버거 세트", en: "Burger Set" },
    drinkSelectTitle: { ko: "음료 선택", en: "Select Drink" },
    sideSelectTitle: { ko: "사이드(곁들임) 메뉴 선택", en: "Select a Side" },
  };

  // key 하나로 UI_STRINGS 에서 현재 언어에 맞는 문구를 바로 꺼낸다.
  function t(key) {
    const entry = UI_STRINGS[key];
    return entry ? pickText(entry.ko, entry.en) : key;
  }

  // 화면마다 다른 "숫자원" 조합을 한곳에서 통일한다(영어는 숫자와 word 사이 띄어쓰기가 필요).
  function formatPrice(amount) {
    return `${amount.toLocaleString()}${getLang() === "en" ? " " : ""}${t("won")}`;
  }

  // 삭제 확인 팝업에 "어떤 메뉴"를 지우는지 이름을 넣어준다. 한국어는 을/를 받침 여부를
  // 매번 맞추기보다 이름을 줄 바꿔 따로 보여주는 쪽이 실수가 없다.
  function confirmRemoveMessage(name) {
    return getLang() === "en" ? `Remove "${name}"?` : `${name}<br>${t("confirmRemove")}`;
  }

  // 단품/세트/사이드/음료 카드에 붙는 추가 금액 표시. 0원이면 아무것도 안 보여준다
  // (기본값이라 굳이 "+0원"을 보여줄 필요가 없음). 양수는 +, 음수는 toLocaleString이
  // 알아서 붙이는 - 를 그대로 쓴다.
  function formatDelta(amount) {
    if (!amount) return "";
    const sign = amount > 0 ? "+" : "";
    return `${sign}${amount.toLocaleString()}${getLang() === "en" ? " " : ""}${t("won")}`;
  }

  // 단품/세트/큰세트 최종 가격. item.price 의 의미가 카테고리마다 다르다 —
  // 추천메뉴/웰런치는 이름이 "~세트"라 price 가 세트 가격이고, 버거처럼
  // category.priceBase === "single" 인 곳은 이름에 "세트"가 없는 만큼 price 가 단품 가격이다.
  // 그 차이를 여기 한 곳에서만 반영해서, 화면마다 직접 item.price + delta 를 계산하다가
  // 카테고리별 기준이 다르다는 걸 놓치는 실수(단품을 더 깎아버리는 등)를 막는다.
  function getVariantPrice(category, basePrice, variantId) {
    const opt = window.VARIANT_OPTIONS[variantId];
    if (!opt) return basePrice;
    if (category && category.priceBase === "single") {
      const comboPremium = -window.VARIANT_OPTIONS.single.priceDelta; // 단품→세트로 갈 때 붙는 사이드+음료 값
      const setLExtra = window.VARIANT_OPTIONS["set-l"].priceDelta; // 세트 대비 큰세트 추가금
      if (variantId === "single") return basePrice;
      if (variantId === "set") return basePrice + comboPremium;
      if (variantId === "set-l") return basePrice + comboPremium + setLExtra;
      return basePrice;
    }
    return basePrice + opt.priceDelta;
  }

  // 마크업에 박힌 고정 문구는 data-i18n(텍스트)/data-i18n-html(줄바꿈 등 포함)/
  // data-i18n-aria(aria-label)/data-i18n-alt(이미지 alt)로 표시해두면 여기서 한 번에 번역한다.
  // 페이지 스크립트가 이름/가격처럼 데이터로 채우는 부분은 각자 pickText/t 로 직접 처리한다.
  function applyStaticI18n() {
    document.title = t("pageTitle");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      el.setAttribute("alt", t(el.getAttribute("data-i18n-alt")));
    });
  }

  function getOrderType() {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("orderType");
    if (fromUrl) {
      sessionStorage.setItem(ORDER_TYPE_KEY, fromUrl);
      return fromUrl;
    }
    return sessionStorage.getItem(ORDER_TYPE_KEY) || "";
  }

  // ---------- 장바구니 (항목 배열) ----------
  // cartItem: { id, itemId, name, badge?, variantId?, variantLabel?, sideId?, sideLabel?,
  //             drinkId?, drinkLabel?, unitPrice, qty }
  // id/label 쌍으로 둔 이유: 화면엔 label(사람이 읽는 이름)을 보여주고,
  // "수정하기" 링크는 id로 다시 만들어야 해서 둘 다 저장해둔다.
  function getCartItems() {
    try {
      return JSON.parse(sessionStorage.getItem(CART_ITEMS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveCartItems(items) {
    sessionStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
  }

  function getCart() {
    const items = getCartItems();
    const total = items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
    const count = items.reduce((sum, it) => sum + it.qty, 0);
    return { total, count, items };
  }

  function addCartItem(cartItem) {
    const items = getCartItems();
    const id = `c${Date.now()}${Math.floor(Math.random() * 1000)}`;
    items.push({ ...cartItem, id });
    saveCartItems(items);
    return getCart();
  }

  // cartItemId 가 있으면 그 항목을 새 내용으로 통째로 바꾸고(수정), 없으면 새로 추가한다.
  function replaceCartItem(cartItemId, cartItem) {
    const items = getCartItems();
    const idx = items.findIndex((it) => it.id === cartItemId);
    if (idx >= 0) {
      items[idx] = { ...cartItem, id: cartItemId };
    } else {
      items.push({ ...cartItem, id: cartItemId || `c${Date.now()}` });
    }
    saveCartItems(items);
    return getCart();
  }

  function removeCartItem(cartItemId) {
    saveCartItems(getCartItems().filter((it) => it.id !== cartItemId));
    return getCart();
  }

  function updateCartItemQty(cartItemId, delta) {
    const items = getCartItems();
    const item = items.find((it) => it.id === cartItemId);
    if (item) item.qty = Math.max(1, item.qty + delta);
    saveCartItems(items);
    return getCart();
  }

  function clearCart() {
    saveCartItems([]);
  }

  function findItem(itemId) {
    for (const category of window.MENU_CATEGORIES) {
      const item = category.items.find((i) => i.id === itemId);
      if (item) return { item, category };
    }
    return null;
  }

  function applyPreferences() {
    if (sessionStorage.getItem(CONTRAST_KEY) === "1") document.body.classList.add("high-contrast");
    if (sessionStorage.getItem(LOW_STANCE_KEY) === "1") document.body.classList.add("low-stance");
  }

  function toggleContrast() {
    const on = document.body.classList.toggle("high-contrast");
    sessionStorage.setItem(CONTRAST_KEY, on ? "1" : "0");
    return on;
  }

  function toggleLowStance() {
    const on = document.body.classList.toggle("low-stance");
    sessionStorage.setItem(LOW_STANCE_KEY, on ? "1" : "0");
    return on;
  }

  // ---------- 토스트 메시지 ----------
  // 어느 화면에서든 바로 쓸 수 있게 마크업 없이 JS로 엘리먼트를 만들어 body에 붙인다.
  let toastTimer = null;
  function showToast(message) {
    let toastEl = document.querySelector(".kiosk-toast");
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "kiosk-toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.remove("is-visible");
    // 강제 리플로우: 연속 클릭 시에도 트랜지션이 다시 걸리게 한다.
    void toastEl.offsetWidth;
    toastEl.classList.add("is-visible");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-visible");
    }, 1800);
  }

  // ---------- 사이드바(카테고리 nav / 단계 nav) 공용 렌더링 ----------
  // 카테고리 항목은 실제 다른 화면으로 이동하는 링크(<a>)이고,
  // 고대비는 화면 이동이 아니라 "이 화면의 설정을 켠다/끈다"라서 버튼으로 남겨둔다.
  // 낮은 자세는 아직 구현 전이라 누르면 준비중 토스트만 띄운다.
  // 도움 기능/고대비 모드/낮은 자세는 카테고리·단계 목록과 섞이지 않도록
  // 같은 목록(container)이 아니라 사이드바 하단에 고정된 별도 nav(.category-nav__utility)에 넣는다.
  function appendUtilityNav(container) {
    const utilityContainer = container.parentElement.querySelector(".category-nav__utility") || container;
    utilityContainer.innerHTML = "";

    window.UTILITY_NAV_ITEMS.forEach((util) => {
      // "도움 기능"은 실제 다른 화면(help.html)으로 가는 거라 a 태그로,
      // 고대비/낮은 자세는 화면 이동이 아니라 이 화면 자체의 상태만 바꾸는 거라 버튼으로 둔다.
      if (util.id === "help") {
        const a = document.createElement("a");
        a.className = "category-nav__item category-nav__item--utility";
        a.textContent = pickText(util.label, util.labelEn);
        // 지금 보던 화면(단품/세트 고르던 중이었다면 그 선택까지 포함한 URL)을 같이 들고 가서,
        // help.html 의 "메뉴로 돌아가기"가 늘 menu.html 첫 화면이 아니라 원래 있던 자리로
        // 돌아가게 한다. index.html/help.html 자체에서 도움 기능을 눌렀을 땐 돌아갈 "진행 중인
        // 선택"이 없으므로 return 없이 그냥 help.html 로 보낸다.
        const here = location.pathname.split("/").pop();
        if (here && here !== "help.html") {
          a.href = `help.html?return=${encodeURIComponent(here + location.search)}`;
        } else {
          a.href = "help.html";
        }
        utilityContainer.appendChild(a);
        return;
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "category-nav__item category-nav__item--utility";
      btn.textContent = pickText(util.label, util.labelEn);

      if (util.id === "contrast") {
        if (document.body.classList.contains("high-contrast")) btn.classList.add("is-active");
        btn.addEventListener("click", () => {
          btn.classList.toggle("is-active", toggleContrast());
        });
      } else if (util.id === "low-stance") {
        btn.addEventListener("click", () => {
          showToast(t("lowStanceSoon"));
        });
      }

      utilityContainer.appendChild(btn);
    });
  }

  function renderCategoryNav(container, activeCategoryId) {
    container.innerHTML = "";
    window.MENU_CATEGORIES.forEach((category) => {
      const a = document.createElement("a");
      a.className = "category-nav__item";
      a.textContent = pickText(category.label, category.labelEn);
      a.href = `menu.html?category=${encodeURIComponent(category.id)}`;
      if (category.id === activeCategoryId) a.classList.add("is-active");
      container.appendChild(a);
    });
    appendUtilityNav(container);
  }

  const ITEM_STEPS = [
    { id: "variant", label: "단품/세트", labelEn: "Single/Set" },
    { id: "side", label: "사이드 선택", labelEn: "Side" },
    { id: "drink", label: "음료 선택", labelEn: "Drink" },
  ];

  function stepHref(stepId, ctx) {
    const itemId = encodeURIComponent(ctx.itemId);
    const editSuffix = ctx.cartItemId ? `&cartItemId=${encodeURIComponent(ctx.cartItemId)}` : "";
    // 추천메뉴/웰런치처럼 단품/세트 선택 자체를 건너뛰는 상품은 이 단계로 못 돌아가게
    // 막는다(사이드바에서 다시 눌러서 "세트"였던 걸 "단품"으로 바꿔버리는 걸 방지).
    if (stepId === "variant") return ctx.variantLocked ? null : `item-variant.html?itemId=${itemId}`;
    if (stepId === "side") {
      if (!ctx.variantId) return null;
      return `item-side.html?itemId=${itemId}&variantId=${encodeURIComponent(ctx.variantId)}${editSuffix}`;
    }
    if (stepId === "drink") {
      if (!ctx.variantId || !ctx.sideId) return null;
      return (
        `item-drink.html?itemId=${itemId}&variantId=${encodeURIComponent(ctx.variantId)}` +
        `&sideId=${encodeURIComponent(ctx.sideId)}${editSuffix}`
      );
    }
    return null;
  }

  // currentStepId: "variant" | "side" | "drink"
  // ctx: { itemId, variantId?, sideId?, cartItemId? } - 지금까지 정해진 선택값.
  function renderStepNav(container, currentStepId, ctx) {
    container.innerHTML = "";
    ITEM_STEPS.forEach((step) => {
      const href = stepHref(step.id, ctx);
      const el = document.createElement(href ? "a" : "span");
      el.className = "category-nav__item category-nav__item--step";
      el.textContent = pickText(step.label, step.labelEn);
      if (href) el.href = href;
      if (step.id === currentStepId) el.classList.add("is-active");
      if (!href) el.classList.add("is-disabled");
      container.appendChild(el);
    });
    appendUtilityNav(container);
  }

  function renderCartBar(root) {
    const cart = getCart();
    const totalEl = root.querySelector("#cart-total");
    const orderBtn = root.querySelector("#btn-order");
    if (totalEl) totalEl.textContent = cart.total.toLocaleString();
    if (orderBtn) {
      orderBtn.classList.toggle("is-enabled", cart.count > 0);
      if (cart.count > 0) orderBtn.href = "cart.html";
      else orderBtn.removeAttribute("href");
    }
  }

  // ---------- 재료 변경(mods) ----------
  // 화면 이동이 실제 페이지 이동이라 선택은 URL 값으로 들고 다닌다.
  // 형식: "lettuce-,cheese+" (id 뒤에 - 는 빼기, + 는 추가). 안 고른 재료는 기본.
  function parseMods(str) {
    const mods = {};
    (str || "").split(",").forEach((token) => {
      const sign = token.slice(-1);
      const id = token.slice(0, -1);
      if (id && (sign === "-" || sign === "+")) mods[id] = sign;
    });
    return mods;
  }

  function stringifyMods(mods) {
    return Object.keys(mods)
      .map((id) => id + mods[id])
      .join(",");
  }

  // 화면에 보여줄 문구 목록. 예) ["양상추 빼기", "치즈 추가"]
  // kind: "burger"(공용 목록) | "side"(sideId별로 목록이 다름 — 코울슬로엔 감자튀김용
  // 소금/케첩/머스타드가 안 맞아서 SIDE_OPTIONS 의 id 별로 따로 둔다. kind가 "side"면
  // sideId 가 있어야 목록을 찾을 수 있다).
  function ingredientOptionsFor(kind, sideId) {
    if (kind === "burger") return window.INGREDIENT_OPTIONS.burger;
    return window.INGREDIENT_OPTIONS.side[sideId] || [];
  }

  function modLabels(kind, str, sideId) {
    const mods = parseMods(str);
    const isEn = getLang() === "en";
    return ingredientOptionsFor(kind, sideId)
      .filter((opt) => mods[opt.id])
      .map((opt) => {
        const name = pickText(opt.label, opt.labelEn);
        if (isEn) return mods[opt.id] === "-" ? `No ${name}` : `Extra ${name}`;
        return `${name} ${mods[opt.id] === "-" ? "빼기" : "추가"}`;
      });
  }

  function modsPrice(kind, str, sideId) {
    const mods = parseMods(str);
    return ingredientOptionsFor(kind, sideId).reduce(
      (sum, opt) => sum + (mods[opt.id] === "+" ? opt.addPrice : 0),
      0
    );
  }

  // 화면을 넘나들어도 유지해야 하는 값(수정 중인 장바구니 항목, 재료 변경, 수량)을 링크 뒤에 붙일 조각으로 만든다.
  function carryQuery(params) {
    return ["cartItemId", "burgerMods", "sideMods", "qty"]
      .filter((key) => params.get(key))
      .map((key) => `&${key}=${encodeURIComponent(params.get(key))}`)
      .join("");
  }

  // data-home 이 붙은 "처음으로" 버튼: 첫 화면(index.html)으로 이동하고, 담아둔 장바구니는 비운다.
  // 장바구니에 뭔가 담겨있으면(잃을 게 있으면) 바로 비우지 않고 확인 팝업(#confirm-home-modal,
  // 이 화면에 마크업이 있는 경우)을 한 번 거친다. 헤더에 붙은 버튼처럼 잘못 누르기 쉬운
  // 자리에서 확인 없이 장바구니가 통째로 비는 걸 막기 위함. 장바구니가 비어있으면(잃을 게
  // 없으면) 그냥 바로 이동한다.
  function wireHomeButtons() {
    const depth = location.pathname.includes("/src/screens/") ? "../../" : "";
    const homeEls = document.querySelectorAll("[data-home]");
    if (!homeEls.length) return;
    const target = `${depth}index.html`;
    homeEls.forEach((el) => {
      el.href = target;
    });

    const modal = document.getElementById("confirm-home-modal");
    if (!modal) {
      // 이 화면에 확인 팝업 마크업이 없으면(예외 대비) 예전처럼 바로 비우고 이동한다.
      homeEls.forEach((el) => el.addEventListener("click", clearCart));
      return;
    }

    function goHome() {
      clearCart();
      location.href = target;
    }
    function closeModal() {
      modal.hidden = true;
    }

    homeEls.forEach((el) => {
      el.addEventListener("click", (e) => {
        if (getCart().count === 0) return; // 빈 장바구니면 확인 없이 바로 이동
        e.preventDefault();
        modal.hidden = false;
      });
    });
    document.getElementById("confirm-home-cancel")?.addEventListener("click", closeModal);
    // 팝업 카드 바깥(어두운 배경)을 눌러도 취소와 같이 닫는다.
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.getElementById("confirm-home-ok")?.addEventListener("click", goHome);
  }

  // ---------- 무입력 자동 복귀 ----------
  // 첫 화면(index.html)을 뺀 모든 화면에서 IDLE_MS 동안 입력이 없으면 초기화하고 첫 화면으로 돌아간다.
  
  const IDLE_MS = 30 * 1000;

  function startIdleReturn() {
    if (!location.pathname.includes("/src/screens/")) return;

    let timer = null;
    function goHome() {
      clearCart();
      sessionStorage.removeItem(LANG_KEY);
      location.replace("../../index.html");
    }
    function reset() {
      clearTimeout(timer);
      timer = setTimeout(goHome, IDLE_MS);
    }

    ["pointerdown", "pointermove", "touchstart", "touchmove", "keydown", "wheel", "scroll"].forEach((type) =>
      document.addEventListener(type, reset, { passive: true, capture: true })
    );
    reset();
  }

  return {
    getOrderType,
    getLang,
    setLang,
    toggleLang,
    pickText,
    t,
    formatPrice,
    formatDelta,
    getVariantPrice,
    confirmRemoveMessage,
    applyStaticI18n,
    startIdleReturn,
    wireHomeButtons,
    parseMods,
    stringifyMods,
    modLabels,
    modsPrice,
    carryQuery,
    getCart,
    addCartItem,
    replaceCartItem,
    removeCartItem,
    updateCartItemQty,
    clearCart,
    findItem,
    applyPreferences,
    toggleContrast,
    toggleLowStance,
    showToast,
    renderCategoryNav,
    renderStepNav,
    renderCartBar,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.KioskState.applyPreferences();
  window.KioskState.applyStaticI18n();
  // 무입력 자동 복귀는 잠시 꺼둠(다시 켜려면 아래 줄의 // 를 지운다)
  // window.KioskState.startIdleReturn();
  window.KioskState.wireHomeButtons();
});

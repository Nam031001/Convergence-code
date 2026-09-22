// 키오스크 전체(메뉴/단품·세트/사이드/음료 선택)가 공유하는 더미 데이터. 실제 메뉴/가격/이미지로 교체될 자리.
// nameEn/labelEn: ENG 버튼(언어 전환) 눌렀을 때 보여줄 영문 표기.
window.MENU_CATEGORIES = [
  {
    id: "recommend",
    label: "추천메뉴",
    labelEn: "Recommended",
    items: [
      { id: "r1", name: "진주 고추 크림치즈 비프 버거 세트", nameEn: "Jinju Chili Cream Cheese Beef Burger Set", price: 6800 },
      { id: "r2", name: "더블 맥스파이시 상하이 버거 세트", nameEn: "Double McSpicy Shanghai Burger Set", price: 6800 },
      { id: "r3", name: "1955 버거 세트", nameEn: "1955 Burger Set", price: 6800 },
      { id: "r4", name: "쿼터파운드 치즈 세트", nameEn: "Quarter Pounder Cheese Set", price: 6800 },
      { id: "r5", name: "더블 쿼터파운드 치즈세트", nameEn: "Double Quarter Pounder Cheese Set", price: 6800 },
      { id: "r6", name: "맥치킨 모짜렐라 세트", nameEn: "McChicken Mozzarella Set", price: 6800 },
      { id: "r7", name: "빅맥 세트", nameEn: "Big Mac Set", price: 6500 },
      { id: "r8", name: "상하이 버거 세트", nameEn: "Shanghai Burger Set", price: 6200 },
      { id: "r9", name: "베이컨 토마토 디럭스 세트", nameEn: "Bacon Tomato Deluxe Set", price: 7200 },
      { id: "r10", name: "에그 불고기 버거 세트", nameEn: "Egg Bulgogi Burger Set", price: 5900 },
      { id: "r11", name: "맥스파이시 상하이 버거 세트", nameEn: "McSpicy Shanghai Burger Set", price: 6200 },
      { id: "r12", name: "더블 불고기 버거 세트", nameEn: "Double Bulgogi Burger Set", price: 6900 },
      { id: "r13", name: "치즈버거 세트", nameEn: "Cheeseburger Set", price: 5200 },
      { id: "r14", name: "더블 치즈버거 세트", nameEn: "Double Cheeseburger Set", price: 6200 },
      { id: "r15", name: "1955 베이컨 세트", nameEn: "1955 Bacon Set", price: 6900 },
      { id: "r16", name: "골든 모짜렐라 세트", nameEn: "Golden Mozzarella Set", price: 6700 },
      { id: "r17", name: "상하이 스파이시 콤보", nameEn: "Shanghai Spicy Combo", price: 6400 },
      { id: "r18", name: "맥크리스피 클래식 세트", nameEn: "McCrispy Classic Set", price: 6600 },
    ],
  },
  {
    id: "welunch",
    label: "웰런치",
    labelEn: "WeLunch",
    items: [
      { id: "w1", name: "웰런치 불고기 버거 세트", nameEn: "WeLunch Bulgogi Burger Set", price: 5900 },
      { id: "w2", name: "웰런치 치즈버거 세트", nameEn: "WeLunch Cheeseburger Set", price: 5500 },
      { id: "w3", name: "웰런치 상하이 버거 세트", nameEn: "WeLunch Shanghai Burger Set", price: 6100 },
      { id: "w4", name: "웰런치 맥치킨 세트", nameEn: "WeLunch McChicken Set", price: 5700 },
    ],
  },
  {
    id: "burger",
    label: "버거",
    labelEn: "Burgers",
    items: [
      { id: "b1", name: "빅맥", nameEn: "Big Mac", price: 5500 },
      { id: "b2", name: "상하이 버거", nameEn: "Shanghai Burger", price: 5200 },
      { id: "b3", name: "맥스파이시 상하이 버거", nameEn: "McSpicy Shanghai Burger", price: 5200 },
      { id: "b4", name: "더블 맥스파이시 상하이 버거", nameEn: "Double McSpicy Shanghai Burger", price: 6100, badge: "new" },
      { id: "b5", name: "쿼터파운드 치즈버거", nameEn: "Quarter Pounder Cheeseburger", price: 5800 },
      { id: "b6", name: "치즈버거", nameEn: "Cheeseburger", price: 3900 },
      { id: "b7", name: "1955 버거", nameEn: "1955 Burger", price: 5900 },
    ],
  },
  {
    id: "snack",
    label: "해피스낵",
    labelEn: "Happy Snack",
    items: [
      { id: "s1", name: "맥너겟 4조각", nameEn: "Chicken McNuggets (4pc)", price: 3400 },
      { id: "s2", name: "맥스파이시 치킨텐더 2조각", nameEn: "McSpicy Chicken Tenders (2pc)", price: 3900 },
      { id: "s3", name: "해피밀 너겟", nameEn: "Happy Meal Nuggets", price: 4900 },
    ],
  },
  {
    id: "side",
    label: "사이드",
    labelEn: "Sides",
    items: [
      { id: "sd1", name: "맥도날드 후렌치 후라이 (미디엄)", nameEn: "McDonald's French Fries (Medium)", price: 2500 },
      { id: "sd2", name: "맥도날드 후렌치 후라이 (라지)", nameEn: "McDonald's French Fries (Large)", price: 2900 },
      { id: "sd3", name: "코울슬로", nameEn: "Coleslaw", price: 2200 },
    ],
  },
  {
    id: "coffee",
    label: "커피",
    labelEn: "Coffee",
    items: [
      { id: "c1", name: "아메리카노", nameEn: "Americano", price: 2200 },
      { id: "c2", name: "카페라떼", nameEn: "Caffè Latte", price: 2900 },
      { id: "c3", name: "바닐라라떼", nameEn: "Vanilla Latte", price: 3400 },
    ],
  },
  {
    id: "dessert",
    label: "디저트",
    labelEn: "Desserts",
    items: [
      { id: "d1", name: "소프트콘", nameEn: "Soft Serve Cone", price: 1200 },
      { id: "d2", name: "맥플러리 오레오", nameEn: "McFlurry Oreo", price: 3900 },
      { id: "d3", name: "애플파이", nameEn: "Apple Pie", price: 1700 },
    ],
  },
  {
    id: "drink",
    label: "음료",
    labelEn: "Drinks",
    items: [
      { id: "dr1", name: "코카콜라", nameEn: "Coca-Cola", price: 2200 },
      { id: "dr2", name: "스프라이트", nameEn: "Sprite", price: 2200 },
      { id: "dr3", name: "오렌지주스", nameEn: "Orange Juice", price: 2500 },
    ],
  },
];

window.UTILITY_NAV_ITEMS = [
  { id: "help", label: "도움 기능", labelEn: "Help" },
  { id: "contrast", label: "고대비 모드", labelEn: "High Contrast" },
  { id: "low-stance", label: "낮은 자세", labelEn: "Low Stance" },
];

// 단품/세트/사이드/음료 옵션의 유일한 기준(single source of truth).
// 각 화면은 URL의 id 값만 주고받고, 이름/가격은 항상 여기서 찾아온다.
window.VARIANT_OPTIONS = {
  single: { label: "단품", labelEn: "Single", priceDelta: -1500 },
  set: { label: "세트", labelEn: "Set", priceDelta: 0 },
  "set-l": { label: "큰 세트(L)", labelEn: "Large Set (L)", priceDelta: 900 },
};

window.SIDE_OPTIONS = {
  fries: { label: "감자튀김", labelEn: "French Fries", priceDelta: 0 },
  coleslaw: { label: "코울슬로", labelEn: "Coleslaw", priceDelta: 0 },
  "fries-l": { label: "큰 감자튀김(L)", labelEn: "Large French Fries (L)", priceDelta: 900 },
};

window.DRINK_OPTIONS = {
  cola: { label: "코카-콜라", labelEn: "Coca-Cola", priceDelta: 0 },
  sprite: { label: "스프라이트(사이다)", labelEn: "Sprite", priceDelta: 0 },
  orange: { label: "오렌지 주스", labelEn: "Orange Juice", priceDelta: 500 },
  water: { label: "생수", labelEn: "Water", priceDelta: 0 },
  americano: { label: "아메리카노", labelEn: "Americano", priceDelta: 500 },
  latte: { label: "카페라떼", labelEn: "Caffè Latte", priceDelta: 700 },
  fanta: { label: "환타", labelEn: "Fanta", priceDelta: 0 },
  zerocola: { label: "제로콜라", labelEn: "Coke Zero", priceDelta: 0 },
  shake: { label: "딸기 쉐이크", labelEn: "Strawberry Shake", priceDelta: 600 },
  icetea: { label: "아이스티", labelEn: "Iced Tea", priceDelta: 0 },
};

// 최종 확인 화면의 "재료추가/변경"에서 고르는 재료. 각 재료는 기본 / 빼기(-) / 추가(+) 중 하나.
// addPrice: "추가"를 골랐을 때 붙는 금액(더미).
window.INGREDIENT_OPTIONS = {
  burger: [
    { id: "lettuce", label: "양상추", labelEn: "Lettuce", addPrice: 300 },
    { id: "tomato", label: "토마토", labelEn: "Tomato", addPrice: 300 },
    { id: "onion", label: "양파", labelEn: "Onion", addPrice: 0 },
    { id: "pickle", label: "피클", labelEn: "Pickle", addPrice: 0 },
    { id: "cheese", label: "치즈", labelEn: "Cheese", addPrice: 500 },
    { id: "sauce", label: "소스", labelEn: "Sauce", addPrice: 0 },
  ],
  side: [
    { id: "salt", label: "소금", labelEn: "Salt", addPrice: 0 },
    { id: "ketchup", label: "케첩", labelEn: "Ketchup", addPrice: 0 },
    { id: "mustard", label: "머스타드 소스", labelEn: "Mustard Sauce", addPrice: 300 },
  ],
};

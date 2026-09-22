// index.html: 매장/포장은 실제 링크(<a href="kiosk/menu.html?orderType=...">)로 이동하므로
// 여기서는 화면 이동과 무관한 것(언어 버튼 자리)만 남는다.
(function () {
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    // 버튼엔 항상 "지금 누르면 바뀔 언어"를 보여준다: 한국어 상태면 ENG, 영어 상태면 한국어.
    const syncLabel = () => {
      langToggle.textContent = window.KioskState.getLang() === "en" ? "한국어" : "ENG";
    };
    syncLabel();
    langToggle.addEventListener("click", () => {
      window.KioskState.toggleLang();
      syncLabel();
    });
  }
})();

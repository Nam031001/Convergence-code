// 공용 터치 키오스크에서 오작동을 막는 공통 가드.
// index.html, kiosk.html 등 모든 화면에서 공유한다.
(function () {
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // 두 손가락 핀치 줌 방지 (viewport meta 의 user-scalable=no 를 보완)
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false }
  );

  // 빠르게 두 번 탭했을 때 브라우저 확대되는 것 방지
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    },
    { passive: false }
  );
})();

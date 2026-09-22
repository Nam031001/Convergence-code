// src/screens/order-complete.html 렌더링.
// 도착하는 순간 장바구니를 비우고(결제 완료됐으니 다음 손님을 위해 초기화),
// 잠시 보여준 뒤 처음 화면(주문 방식 선택)으로 자동 복귀한다.
(function () {
  window.KioskState.clearCart();

  // "결제가 완료되었습니다" 위에 뜨는 체크(verify) 로띠 애니메이션.
  // https://lottiefiles.com/free-animation/verify-xN1Kv85LKd 에서 받은 JSON.
  if (window.lottie) {
    window.lottie.loadAnimation({
      container: document.getElementById("order-complete-lottie"),
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "../../asset/Verify.json",
    });
  }

  // 완료 효과음. 자동재생은 브라우저가 막을 수 있어(정책상 무음 상태에서만 허용되는 경우가
  // 있음) 재생이 거부돼도 화면 흐름에는 영향 없게 catch 로 조용히 넘어간다.
  const completeSound = new Audio("../../asset/completeSound.mp3");
  completeSound.play().catch(() => {});

  setTimeout(() => {
    location.href = "../../index.html";
  }, 3000);
})();

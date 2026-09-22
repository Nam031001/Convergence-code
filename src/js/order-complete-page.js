// src/screens/order-complete.html 렌더링.
// 도착하는 순간 장바구니를 비우고(결제 완료됐으니 다음 손님을 위해 초기화),
// 잠시 보여준 뒤 처음 화면(주문 방식 선택)으로 자동 복귀한다.
(function () {
  window.KioskState.clearCart();

  setTimeout(() => {
    location.href = "../../index.html";
  }, 3000);
})();

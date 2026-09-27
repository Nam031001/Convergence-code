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

  // 완료 효과음. 스트리밍 재생은 기기가 느리면(로띠 애니메이션과 동시에 로딩) 끊겨서,
  // 파일을 끝까지 받아 디코딩한 뒤 재생한다. 원본이 앞부분은 클리핑(최대 음량)되고 끝이
  // 소리가 남은 채 잘려 있어서, 음량을 살짝 낮추고 마지막 0.25초를 페이드아웃해 뚝 끊기지 않게 한다.
  // 자동재생이 막히면 화면 흐름에는 영향 없게 조용히 넘어간다.
  const SOUND_URL = "../../asset/completeSound.mp3";
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let played = false;
  function playFallback() {
    if (played) return;
    played = true;
    new Audio(SOUND_URL).play().catch(() => {});
  }
  if (AudioCtx) {
    const ctx = new AudioCtx();
    // 기기에서 디코딩이 1초 안에 안 끝나면 예전 방식으로라도 재생한다.
    setTimeout(playFallback, 1000);
    fetch(SOUND_URL)
      .then((res) => res.arrayBuffer())
      .then((data) => new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)))
      .then((buffer) => ctx.resume().then(() => buffer))
      .then((buffer) => {
        if (played) return;
        if (ctx.state !== "running") return playFallback();
        played = true;
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        source.connect(gain).connect(ctx.destination);
        const now = ctx.currentTime;
        const end = now + buffer.duration;
        const fade = Math.min(0.25, buffer.duration / 2);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.setValueAtTime(0.8, end - fade);
        gain.gain.linearRampToValueAtTime(0.0001, end);
        source.start(now);
      })
      .catch(playFallback);
  } else {
    playFallback();
  }

  setTimeout(() => {
    location.href = "../../index.html";
  }, 3000);
})();

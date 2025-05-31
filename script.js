document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#444";
  ctx.fillRect(0, 0, 400, 400);
  ctx.fillStyle = "white";
  ctx.font = "24px sans-serif";
  ctx.fillText("Плитки появятся тут", 80, 200);

  let codes = { available: [], used: [] };

  document.getElementById("uploadCodes").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      codes = JSON.parse(reader.result);
      alert("Коды загружены!");
      if (codes.available.length > 0) {
        const promo = codes.available.shift();
        codes.used.push(promo);
        alert("🎉 Победа! Ваш промокод: " + promo);
      } else {
        alert("Коды закончились!");
      }
    };
    reader.readAsText(file);
  });
});

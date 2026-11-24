/* Movimento do site: topo que ganha borda ao rolar, partes que aparecem ao entrar na tela
   e o preço da abertura que conta até o valor. Tudo respeita "reduzir movimento". */
(function () {
  "use strict";

  var raiz = document.documentElement;
  var reduzido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Topo */
  var topo = document.querySelector(".topo");
  function aoRolar() { if (topo) topo.classList.toggle("rolou", window.scrollY > 8); }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  /* Aparecer ao rolar */
  var alvos = Array.prototype.slice.call(document.querySelectorAll(".revelar, .saidas .placa-plano"));
  function mostrarTudo() { alvos.forEach(function (el) { el.classList.add("visivel"); }); }
  if (reduzido || !("IntersectionObserver" in window)) {
    mostrarTudo();
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      var fila = entradas.filter(function (e) { return e.isIntersecting; });
      fila.forEach(function (e, i) {
        e.target.style.transitionDelay = Math.min(i * 70, 350) + "ms";
        e.target.classList.add("visivel");
        obs.unobserve(e.target);
        setTimeout(function () { e.target.style.transitionDelay = ""; }, 1200);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    alvos.forEach(function (el) { obs.observe(el); });
    /* Segurança: nada fica escondido se algo falhar. */
    setTimeout(mostrarTudo, 4000);
  }

  /* Preço que conta até o valor */
  var preco = document.querySelector("[data-contar]");
  if (preco && !reduzido && window.requestAnimationFrame) {
    var alvo = parseFloat(preco.getAttribute("data-contar"));
    var formato = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    var inicio = null, duracao = 1400;
    preco.textContent = "R$ " + formato.format(0);
    function passo(t) {
      if (inicio === null) inicio = t;
      var p = Math.min((t - inicio) / duracao, 1);
      var suave = 1 - Math.pow(1 - p, 4);
      preco.textContent = "R$ " + formato.format(alvo * suave);
      if (p < 1) requestAnimationFrame(passo);
    }
    setTimeout(function () { requestAnimationFrame(passo); }, 350);
  }

  raiz.classList.add("movimento-pronto");
})();

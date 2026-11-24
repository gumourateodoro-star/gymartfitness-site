/* Gym ArtFitness — placas dos planos, régua de 24 horas e hora de agora. */
(function () {
  "use strict";

  var G = window.GYM;
  if (!G) return;

  var SETA = '<svg aria-hidden="true"><use href="#seta"/></svg>';

  /* Hora atual em São Sebastião do Caí (Brasília), sem depender do fuso do aparelho. */
  function agoraNoCai() {
    var partes = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false
    }).formatToParts(new Date());
    var v = {};
    partes.forEach(function (p) { v[p.type] = p.value; });
    var hora = parseInt(v.hour, 10) % 24;
    var minuto = parseInt(v.minute, 10);
    var dia = (v.weekday || "").toLowerCase().replace(".", "");
    var fimDeSemana = dia.indexOf("sáb") === 0 || dia.indexOf("sab") === 0 || dia.indexOf("dom") === 0;
    return { hora: hora, minuto: minuto, texto: v.hour + ":" + v.minute, fimDeSemana: fimDeSemana };
  }

  function escapar(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Estado de cada célula da régua: "", "aceso", "meio" (primeira metade) ou "meio fim" (segunda). */
  function celulas(plano) {
    var out = [];
    for (var h = 0; h < 24; h++) {
      var classe = "";
      plano.horas.forEach(function (f) {
        var ini = f[0], fim = f[1];
        if (h >= ini && h + 1 <= fim) classe = "aceso";
        else if (!classe && h < fim && h + 1 > ini) {
          classe = ini > h ? "meio fim" : "meio";
        }
      });
      out.push(classe);
    }
    return out;
  }

  function podeAgora(plano, agora) {
    if ((plano.dias === "seg-sex" || plano.dias === "a-confirmar") && agora.fimDeSemana) return false;
    var t = agora.hora + agora.minuto / 60;
    return plano.horas.some(function (f) { return t >= f[0] && t < f[1]; });
  }

  function regua(plano, agora, compacta) {
    var cel = celulas(plano).map(function (c, h) {
      var cls = c + (h === agora.hora ? " agora" : "");
      return '<span class="' + cls.trim() + '"></span>';
    }).join("");
    var marcas = compacta ? "" :
      '<div class="regua-marcas" aria-hidden="true"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div>';
    var estado = "";
    if (!compacta) {
      var dias = plano.dias === "seg-sex" ? " (segunda a sexta)" : "";
      var rotulo = "Agora (" + agora.texto + "): ";
      var texto = plano.dias === "a-confirmar" && agora.fimDeSemana ? rotulo + "fim de semana, confirma com a equipe"
        : podeAgora(plano, agora) ? rotulo + "pode treinar" : rotulo + "fora do horário" + dias;
      estado = '<p class="regua-estado">' + texto + "</p>";
    }
    return '<div class="regua" role="img" aria-label="Horário de acesso: ' + escapar(plano.acesso) + '">' +
      '<div class="regua-celulas">' + cel + "</div>" + marcas + estado + "</div>";
  }

  function linkFechamento(plano) {
    return "matricula.html?plano=" + encodeURIComponent(plano.id);
  }

  function placa(plano, agora) {
    var preco =
      '<div class="preco"><span class="rs">R$</span><strong>' + plano.valor + '</strong><span class="unidade">' + escapar(plano.unidade) + "</span></div>";
    var detalhe = plano.detalhe ? '<p class="detalhe">' + escapar(plano.detalhe) + "</p>" : "";
    var selo = plano.destaque ? '<span class="selo-menor">Menor valor</span>' : "";
    var cta = '<a class="saida-link" href="' + linkFechamento(plano) + '">Assinar ' + escapar(plano.nome) + " " + SETA + "</a>";
    if (plano.destaque) {
      return '<article class="placa-plano principal" aria-labelledby="p-' + plano.id + '">' +
        '<div class="colunas"><div class="topo-placa"><h3 id="p-' + plano.id + '">Plano ' + escapar(plano.nome) + "</h3>" + selo + "</div>" +
        preco + '<p class="acesso">' + escapar(plano.acesso) + "</p>" + detalhe + "</div>" +
        '<div class="colunas">' + regua(plano, agora) + cta + "</div></article>";
    }
    var reduzido = plano.dias !== "todos" ? " reduzido" : "";
    return '<article class="placa-plano' + reduzido + '" aria-labelledby="p-' + plano.id + '">' +
      '<div class="topo-placa"><h3 id="p-' + plano.id + '">' + escapar(plano.nome) + "</h3>" + selo + "</div>" +
      preco +
      '<div><p class="acesso">' + escapar(plano.acesso) + "</p>" + detalhe + "</div>" +
      regua(plano, agora) + cta + "</article>";
  }

  function linhaTabela(plano, agora) {
    return "<tr><th scope=\"row\">" + escapar(plano.nome) + "</th>" +
      '<td class="valor">R$ ' + plano.valor + (plano.unidade.indexOf("pessoa") > -1 ? " por pessoa" : "") + "</td>" +
      "<td>" + escapar(plano.acesso) + "</td>" +
      '<td class="mini">' + regua(plano, agora, true) + "</td>" +
      '<td><a href="' + linkFechamento(plano) + '">Assinar</a></td></tr>';
  }

function textoSelo(agora) { return "Agora " + agora.texto + ' <span class="sep" aria-hidden="true">·</span> aberto'; }

  function montar() {
    var agora = agoraNoCai();
    var lista = document.getElementById("lista-planos");
    var tabela = document.getElementById("tabela-planos");
    if (lista) {
      var integrais = G.planos.filter(function (p) { return p.dias === "todos"; });
      var reduzidos = G.planos.filter(function (p) { return p.dias !== "todos"; });
      lista.innerHTML = integrais.map(function (p) { return placa(p, agora); }).join("") +
        (reduzidos.length ? '<h3 class="grupo-planos">Horário reduzido</h3>' : "") +
        reduzidos.map(function (p) { return placa(p, agora); }).join("");
    }
    if (tabela) tabela.innerHTML = G.planos.map(function (p) { return linhaTabela(p, agora); }).join("");

    var selo = document.getElementById("agora");
    if (selo) {
      selo.innerHTML = textoSelo(agora);
      selo.hidden = false;
    }
    return agora;
  }

  /* O único movimento autoral: quando os planos entram na tela, as réguas acendem hora a hora. */
  function acenderAoVer() {
    var reduzido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var lista = document.getElementById("lista-planos");
    if (!lista || reduzido || !("IntersectionObserver" in window)) return;
    var reguas = lista.querySelectorAll(".regua");
    reguas.forEach(function (r) { r.classList.add("apagando"); });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        var cel = e.target.querySelectorAll(".regua-celulas span");
        e.target.classList.remove("apagando");
        cel.forEach(function (c, i) {
          if (!c.classList.contains("aceso") && !c.classList.contains("meio")) return;
          c.style.transitionDelay = (i * 28) + "ms";
          c.style.backgroundColor = "transparent";
          requestAnimationFrame(function () { requestAnimationFrame(function () { c.style.backgroundColor = ""; }); });
        });
      });
    }, { threshold: 0.4 });
    reguas.forEach(function (r) { obs.observe(r); });
    /* Segurança: se algo falhar, nada fica apagado depois de 2,5 s. */
    setTimeout(function () { reguas.forEach(function (r) { r.classList.remove("apagando"); }); }, 2500);
  }

  montar();
  acenderAoVer();
  setInterval(function () {
    var selo = document.getElementById("agora");
    if (selo) selo.innerHTML = textoSelo(agoraNoCai());
  }, 30000);

  window.GYM.util = { agoraNoCai: agoraNoCai, regua: regua, escapar: escapar, podeAgora: podeAgora };
})();

/* Página de fechamento: plano escolhido (vem do ?plano= do botão do site ou do WhatsApp),
   dados da pessoa e conclusão. Nada é enviado a servidor: os dados só vão na mensagem
   de WhatsApp que a própria pessoa envia. Quando o plano tiver linkPagamento (planos.js),
   o botão passa a levar ao pagamento online. */
(function () {
  "use strict";

  var G = window.GYM;
  if (!G || !G.util) return;
  var U = G.util;

  var form = document.getElementById("form-matricula");
  var opcoes = document.getElementById("opcoes-plano");
  var resumo = document.getElementById("resumo");
  var botao = document.getElementById("botao-concluir");
  var aviso = document.getElementById("aviso-pagamento");

  var porId = {};
  G.planos.forEach(function (p) { porId[p.id] = p; });

  var pedido = new URLSearchParams(location.search).get("plano");
  var atual = porId[pedido] ? pedido : "anual";

  opcoes.innerHTML = G.planos.map(function (p) {
    return '<div class="opcao-plano"><input type="radio" name="plano" id="op-' + p.id + '" value="' + p.id + '"' +
      (p.id === atual ? " checked" : "") + '><label for="op-' + p.id + '"><strong>' + U.escapar(p.nome) +
      "</strong><span>R$ " + p.valor + " " + U.escapar(p.unidade) + "</span></label></div>";
  }).join("");

  function desenharResumo() {
    var p = porId[atual];
    var agora = U.agoraNoCai();
    resumo.innerHTML =
      '<div class="placa-plano">' +
      '<div class="topo-placa"><h2 class="placa-titulo" style="font-size:1.6rem">Plano ' + U.escapar(p.nome) + "</h2></div>" +
      '<div class="preco"><span class="rs">R$</span><strong>' + p.valor + '</strong><span class="unidade">' + U.escapar(p.unidade) + "</span></div>" +
      U.regua(p, agora) +
      "<dl>" +
      "<div><dt>Acesso</dt><dd>" + U.escapar(p.acesso) + "</dd></div>" +
      "<div><dt>Mensalidade</dt><dd>R$ " + p.valor + "</dd></div>" +
      "<div><dt>Taxa de inscrição</dt><dd>" + G.taxaInscricao + "</dd></div>" +
      "</dl>" +
      '<p class="detalhe">' + (p.detalhe ? U.escapar(p.detalhe) + " " : "") +
      "A taxa vale para novos alunos. Forma de pagamento e demais condições a equipe confirma com você.</p>" +
      "</div>";

    var online = !!p.linkPagamento;
    aviso.hidden = online;
    botao.innerHTML = (online ? "Ir para o pagamento" : "Concluir pelo WhatsApp") +
      ' <svg aria-hidden="true"><use href="#seta"/></svg>';
    history.replaceState(null, "", "?plano=" + encodeURIComponent(atual));
  }

  opcoes.addEventListener("change", function (e) {
    if (e.target && e.target.name === "plano") { atual = e.target.value; desenharResumo(); }
  });

  function soDigitos(t) { return (t || "").replace(/\D/g, ""); }

  function marcar(campo, erroId, ok) {
    document.getElementById(erroId).hidden = ok;
    if (campo) campo.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = document.getElementById("nome");
    var whats = document.getElementById("whats");
    var email = document.getElementById("email");
    var aceite = document.getElementById("aceite");

    var d = soDigitos(whats.value);
    var okNome = marcar(nome, "erro-nome", nome.value.trim().length >= 3);
    var okWhats = marcar(whats, "erro-whats", d.length >= 10 && d.length <= 13);
    var okAceite = marcar(null, "erro-aceite", aceite.checked);
    if (!(okNome && okWhats && okAceite)) {
      (!okNome ? nome : !okWhats ? whats : aceite).focus();
      return;
    }

    var p = porId[atual];
    if (p.linkPagamento) {
      window.location.href = p.linkPagamento;
      return;
    }
    var linhas = [
      "Oi! Quero fazer a matrícula pelo site.",
      "Plano: " + p.nome + " (R$ " + p.valor + " " + p.unidade + ")",
      "Nome: " + nome.value.trim(),
      "WhatsApp: " + whats.value.trim()
    ];
    if (email.value.trim()) linhas.push("E-mail: " + email.value.trim());
    window.location.href = "https://wa.me/" + G.whatsapp + "?text=" + encodeURIComponent(linhas.join("\n"));
  });

  desenharResumo();
})();

/*
 * Planos da Gym ArtFitness — fonte única do site.
 * Valores confirmados pela academia em 11/11/2026 (nota "Planos e Preços" do cofre).
 * O atendente do WhatsApp tem a mesma tabela em agent/planos.py: mudou aqui, muda lá.
 *
 * horas: faixas de acesso no dia, em horas (13.5 = 13h30). dias: "todos", "seg-sex" ou "a-confirmar" (dias ainda não confirmados pela academia).
 * linkPagamento: link de assinatura do Asaas de cada plano. AGORA SÃO LINKS DE TESTE
 * (sandbox, pagamento simulado). Trocar pelos links da conta oficial antes de valer.
 * Com null, a matrícula termina pelo WhatsApp.
 */
window.GYM = {
  whatsapp: "5551997557538",
  whatsappLegivel: "(51) 99755-7538",
  taxaInscricao: "R$ 15",
  planos: [
    {
      id: "anual", nome: "Anual", valor: "99,99", unidade: "/mês",
      horas: [[0, 24]], dias: "todos", acesso: "24h, todos os dias",
      detalhe: "O menor valor por mês.", destaque: true, linkPagamento: "https://sandbox.asaas.com/000/c/r2qw2g3ismsg9lca"
    },
    {
      id: "semestral", nome: "Semestral", valor: "109,99", unidade: "/mês",
      horas: [[0, 24]], dias: "todos", acesso: "24h, todos os dias",
      detalhe: "", linkPagamento: "https://sandbox.asaas.com/000/c/elt4w6dkmozmmsqr"
    },
    {
      id: "trimestral", nome: "Trimestral", valor: "119,99", unidade: "/mês",
      horas: [[0, 24]], dias: "todos", acesso: "24h, todos os dias",
      detalhe: "", linkPagamento: "https://sandbox.asaas.com/000/c/3sc4873xg38ctq58"
    },
    {
      id: "mensal-24h", nome: "24h Mensal", valor: "145,00", unidade: "/mês",
      horas: [[0, 24]], dias: "todos", acesso: "24h, todos os dias",
      detalhe: "Treine na hora que puder, de manhã cedo ou de madrugada.", linkPagamento: "https://sandbox.asaas.com/000/c/vaq9mc7205s1tuez"
    },
    {
      id: "familia-casal", nome: "Família ou Casal", valor: "135,00", unidade: "/mês por pessoa",
      horas: [[0, 24]], dias: "todos", acesso: "24h, todos os dias",
      detalhe: "Treinar junto fica mais fácil.", linkPagamento: "https://sandbox.asaas.com/000/c/pjchyhdgut090rsi"
    },
    {
      id: "five", nome: "Five", valor: "135,00", unidade: "/mês",
      horas: [[7, 22]], dias: "seg-sex", acesso: "Segunda a sexta, das 7h às 22h",
      detalhe: "Sem fechar ao meio-dia.", linkPagamento: "https://sandbox.asaas.com/000/c/wb06mgookrt216qb"
    },
    {
      id: "semi-personal", nome: "Semi-personal", valor: "259,00", unidade: "/mês",
      horas: [[7, 22]], dias: "seg-sex", acesso: "Segunda a sexta, das 7h às 22h",
      detalhe: "Treino com professor em grupo de 3 a 4 alunos, 3 vezes por semana.", linkPagamento: "https://sandbox.asaas.com/000/c/uocgi4cwd4c6h3hg"
    },
    {
      id: "estudante", nome: "Estudante", valor: "120,00", unidade: "/mês",
      horas: [[8, 11.5], [13.5, 16.5]], dias: "a-confirmar", acesso: "Das 8h às 11h30 e das 13h30 às 16h30",
      detalhe: "Para quem estuda em instituição de ensino de São Sebastião do Caí.", linkPagamento: "https://sandbox.asaas.com/000/c/xoo75jclgcnk4rz0"
    }
  ]
};

// Demo estática do Edifica: liga os botões principais às telas capturadas
// e avisa que as demais ações estão desligadas (não há servidor por trás).
(function () {
  var pagina = location.pathname.split("/").pop() || "index.html";
  var txt = function (el) { return (el.textContent || "").replace(/\s+/g, " ").trim(); };
  var ir = function (f) { location.href = f; };

  function aviso(msg) {
    var t = document.getElementById("demo-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "demo-toast";
      t.setAttribute("role", "status");
      t.style.cssText = "position:fixed;left:50%;bottom:72px;transform:translateX(-50%);z-index:2147483647;background:#0b1222;color:#e8edf6;border:2px solid #3ad1e6;padding:8px 14px;font:600 13px 'Segoe UI',system-ui,sans-serif;box-shadow:4px 4px 0 #05080f;transition:opacity .2s";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.style.opacity = "0"; }, 2200);
  }

  // botão -> tela; devolve true se tratou
  function destino(btn) {
    var s = txt(btn);
    if (s === "Dashboard Folha") return ir("dashboard-folha.html"), true;
    if (s === "Dashboard Diário") return ir("index.html"), true;
    if (s === "Dashboard Gestão") return ir("dashboard-gestao.html"), true;
    if (/Novo Diário/.test(s)) return ir("diario-editar.html"), true;
    if (s === "Voltar" || /^Voltar$/.test(s)) return ir(/^folha-/.test(pagina) ? "folha.html" : "diarios.html"), true;
    var linha = btn.closest("tr");
    if (s === "Abrir" && pagina === "diarios.html" && linha) {
      var st = txt(linha);
      return ir(/Em preenchimento/.test(st) ? "diario-editar.html" : /Aguardando/.test(st) ? "diario-aguardando.html" : "diario-aprovado.html"), true;
    }
    if ((s === "Ver" || s === "Visualizar") && pagina === "folha.html" && linha) {
      return ir(/Outubro/.test(txt(linha)) ? "folha-outubro.html" : "folha-setembro.html"), true;
    }
    return false;
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-demo-off]");
    var b = e.target.closest("button, [role=button], select, input[type=checkbox], label");
    if (a) { e.preventDefault(); aviso("Esta tela não faz parte da demonstração."); return; }
    if (!b || b.closest("#demo-banner")) return;
    if (b.tagName === "BUTTON" && destino(b)) { e.preventDefault(); return; }
    e.preventDefault();
    aviso("Demonstração com dados fictícios: ações e filtros estão desligados.");
  }, true);

  // linhas da lista de diários e de folhas também abrem a tela correspondente
  if (pagina === "folha.html") {
    document.querySelectorAll("tbody tr").forEach(function (tr) {
      tr.style.cursor = "pointer";
      tr.addEventListener("click", function (e) {
        if (e.target.closest("button")) return;
        ir(/Outubro/.test(txt(tr)) ? "folha-outubro.html" : "folha-setembro.html");
      });
    });
  }
})();

import type { CSSProperties, ReactNode } from "react";
import ClientEnhancements from "@/components/ClientEnhancements";
import CursorReticle from "@/components/CursorReticle";

type CSSVars = CSSProperties & Record<string, string>;

/* ---------- ícones (logos + diferenciais) ---------- */

const LogoCube = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
    <path d="M4 7.5 12 12l8-4.5M12 12v9" />
  </svg>
);
const LogoBuildings = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M4 21V8l5-3v16" />
    <path d="M9 21V9l6 3v9" />
    <path d="M15 21v-6l4 2v4" />
    <path d="M3 21h18" />
  </svg>
);
const LogoDoc = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4" />
    <path d="M9 12h6M9 15h6M9 18h4" />
  </svg>
);

const IconWorkflow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" />
    <path d="M6 8.5v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-2M12 15.5v-2" />
  </svg>
);
const IconLink = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 15 15 9" /><path d="M10.5 6l1-1a4 4 0 0 1 6 6l-1 1" /><path d="M13.5 18l-1 1a4 4 0 0 1-6-6l1-1" />
  </svg>
);
const IconLayers = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="M3 13l9 5 9-5" />
  </svg>
);
const IconGauge = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 18a8 8 0 1 1 16 0" /><path d="M12 18l4-5" />
  </svg>
);
const IconSync = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" />
  </svg>
);
const IconLock = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);
const IconCheck = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
);
const IconKey = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="12" r="3.5" /><path d="M11.5 12H21l-2.5 2.5M18.5 12l-1.5 1.5" />
  </svg>
);

/* ---------- dados dos projetos ---------- */

type Diff = { icon: ReactNode; title: string; text: string };
type CaseData = {
  code: string;
  name: string;
  sub: string;
  brand: string;
  sBg: string;
  logo: ReactNode;
  monitor: ReactNode;
  /** tela do monitor na proporção do SVG (2.108:1) em vez de 16/10 */
  wide?: boolean;
  phone: ReactNode;
  /** tela do celular na proporção do print (em vez de 9/18.5) */
  phoneFit?: boolean;
  /** métricas de impacto do projeto (bloco "Impacto" + tooltip "i") */
  stats?: {
    headline: { value: string; label: string }[];
    detail?: { title: string; rows: { value: string; label: string }[] };
  };
  diffs: Diff[];
  flow: string[];
  /** stacks principais exibidas no rodapé (mesma quantidade em todos os cards) */
  stack: string[];
  /** total de tecnologias notáveis do projeto (para o chip "+N") */
  stackTotal?: number;
  /** ordem de exibição do card */
  order?: number;
  result: string;
};

const projetos: CaseData[] = [
  {
    code: "A-01 · Auditoria de projetos",
    name: "Audit BIM",
    order: 3,
    sub: "Auditoria de projetos BIM, da planilha ao sistema",
    brand: "#7180ff",
    sBg: "#f5f5f7",
    logo: LogoCube,
    monitor: (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="screenimg" src="/audit-desktop.svg" alt="Audit BIM · execução da auditoria" />
    ),
    phoneFit: true,
    phone: (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="screenimg" src="/audit-mobile.svg" alt="Audit BIM · app mobile" />
    ),
    diffs: [
      { icon: IconWorkflow, title: "Apontamentos em cadeia", text: "Audita a disciplina inteira e trata as não conformidades em bloco, sem voltar à planilha item a item." },
      { icon: IconLink, title: "Stand-by + Construflow", text: "A auditoria só conclui quando cada NC tem o ID do Construflow e a evidência vinculados." },
      { icon: IconLayers, title: "Modelo dimensional", text: "Esquema estrela com 16 tabelas e snapshots por auditoria: mudar o template não altera auditorias antigas." },
      { icon: IconGauge, title: "Score materializado", text: "Indicadores de conformidade calculados por trigger, com leitura instantânea no dashboard." },
    ],
    flow: [
      "Agenda auditoria por obra/fase/disciplina",
      "Gera o checklist a partir do template",
      "Executa e classifica cada item",
      "Abre apontamentos em cadeia",
      "Stand-by: vincula IDs do Construflow",
      "Conclui e gera relatório + indicadores",
    ],
    stack: ["Next.js 15", "Supabase", "Prisma", "TanStack Query", "Zustand", "Recharts"],
    stackTotal: 25,
    result: "Fim da planilha: auditoria rastreável de ponta a ponta",
  },
  {
    code: "A-02 · Gestão de obras",
    name: "Edifica",
    order: 1,
    sub: "Diário de obra e folha, integrados ao ERP",
    stats: {
      headline: [
        { value: "R$ 2M+", label: "em folha geridos" },
        { value: "7", label: "obras integradas" },
        { value: "2.628", label: "pageviews / mês" },
      ],
      detail: {
        title: "Como foi em julho",
        rows: [
          { value: "2.628", label: "pageviews" },
          { value: "239", label: "sessões" },
          { value: "25", label: "visitantes únicos" },
        ],
      },
    },
    brand: "#1e3a5f",
    sBg: "#f4f6f8",
    logo: LogoBuildings,
    wide: true,
    monitor: (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="screenimg" src="/edifica-capa.svg" alt="Edifica · capa do sistema" />
    ),
    phoneFit: true,
    phone: (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="screenimg" src="/edifica-mobile.svg" alt="Edifica · app mobile" />
    ),
    diffs: [
      { icon: IconSync, title: "Sync de 2 ERPs", text: "Colaboradores (UAU) e equipamentos (ALMOB) sincronizados com roteamento por empresa e upsert idempotente." },
      { icon: IconLock, title: "Controle de acesso", text: "Grupos × módulos com matriz ler/editar/excluir/aprovar e visão de obras por perfil." },
      { icon: IconCheck, title: "Folha com dupla aprovação", text: "Planejamento e Coordenação aprovam em duas pernas antes do envio em lote ao ERP." },
      { icon: IconWorkflow, title: "Migração n8n → código", text: "Automações de sync que viviam no n8n foram portadas para código versionado e testado." },
    ],
    flow: [
      "Diário preenchido no campo (mobile)",
      "Sync de colaboradores e equipamentos",
      "Calcula a folha por frente",
      "Dupla aprovação: Planej. + Coord.",
      "Envia lançamentos ao ERP UAU",
    ],
    stack: ["Next.js 15", "React 19", "Supabase", "Prisma", "ERP UAU", "TanStack Query"],
    stackTotal: 28,
    result: "Da frente de obra ao ERP, sem digitação dupla",
  },
  {
    code: "A-03 · Gestão do SGQ",
    name: "Databook",
    order: 2,
    sub: "Documentação técnica e laudos rastreáveis",
    brand: "#4E77A8",
    sBg: "#eef2f6",
    logo: LogoDoc,
    wide: true,
    monitor: (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="screenimg" src="/databook-desktop.svg" alt="Databook · dashboard" />
    ),
    phoneFit: true,
    phone: (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="screenimg" src="/databook-mobile.svg" alt="Databook · app mobile" />
    ),
    diffs: [
      { icon: IconLayers, title: "Evidências versionadas", text: "Cada envio de laudo gera revisão (R-00, R-01…) sem sobrescrever; histórico preservado." },
      { icon: IconCheck, title: "Aprovação do SGQ", text: "Máquina de estados com reprovação motivada e imutabilidade após aprovar." },
      { icon: IconLock, title: "Matriz de permissões", text: "Seis papéis aplicados na UI e no dado, com RLS no Postgres e trilha de auditoria." },
      { icon: IconKey, title: "SSO Microsoft", text: "Login corporativo via Azure AD, primeiro acesso por convite e sessão por perfil." },
    ],
    flow: [
      "SGQ cadastra padrões e mestres",
      "Engenheiro planeja os ensaios da obra",
      "Operador executa e anexa o PDF",
      "Gera revisão do laudo (R-00, R-01…)",
      "SGQ aprova ou reprova com motivo",
      "Arquiva, notifica e trava edição",
    ],
    stack: ["Next.js 15", "React 19", "Supabase (RLS)", "Azure AD (SSO)", "PostHog", "TypeScript"],
    stackTotal: 12,
    result: "Documentação técnica auditável, sem SharePoint",
  },
];

function ProjectCase({ c }: { c: CaseData }) {
  return (
    <article className="case2 reveal" style={{ "--b": c.brand, "--s-bg": c.sBg } as CSSVars}>
      <div className="c2top">
        <span className="logo">{c.logo}</span>
        <div className="who">
          <h3>{c.name}</h3>
          <span className="sub">{c.sub}</span>
        </div>
      </div>
      <div className="showcase">
        <div className="monitor">
          <div className="bezel"><div className={c.wide ? "screen wide" : "screen"}>{c.monitor}</div></div>
          <div className="stand" /><div className="stand2" />
        </div>
        <div className="phone2"><div className="pbody"><div className={c.phoneFit ? "phscreen fit" : "phscreen"}>{c.phone}</div></div></div>
      </div>
      <div className="c2detail">
        {c.stats ? (
          <div className="impact">
            <div className="ihead">
              <span className="t">Impacto</span>
              {c.stats.detail ? (
                <span className="info">
                  <button type="button" aria-label={c.stats.detail.title}>i</button>
                  <span className="tip" role="tooltip">
                    <span className="tt">{c.stats.detail.title}</span>
                    {c.stats.detail.rows.map((r) => (
                      <span className="tr" key={r.label}><b>{r.value}</b><span>{r.label}</span></span>
                    ))}
                  </span>
                </span>
              ) : null}
            </div>
            <div className="stat-row">
              {c.stats.headline.map((s) => (
                <div className="stat" key={s.label}><b>{s.value}</b><span>{s.label}</span></div>
              ))}
            </div>
          </div>
        ) : null}
        <div>
          <div className="lab">Diferenciais</div>
          <div className="diffs">
            {c.diffs.map((d, i) => (
              <div className="diff" key={i}>
                <span className="ic">{d.icon}</span>
                <div><b>{d.title}</b><p>{d.text}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="lab">Fluxo</div>
          <div className="flowline">
            {c.flow.map((s, i) => (
              <div className="step" key={i}>
                <div className="n">{String(i + 1).padStart(2, "0")}</div>
                <div className="s">{s}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="c2foot">
          <div className="tags">
            {c.stack.map((t) => <span className="tag" key={t}>{t}</span>)}
            {c.stackTotal && c.stackTotal > c.stack.length ? (
              <span className="tag more">+{c.stackTotal - c.stack.length}</span>
            ) : null}
          </div>
          <span className="result">{c.result}</span>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <div className="page">
      <div className="blueprint" aria-hidden="true" />

      <header className="nav">
        <div className="nav-in">
          <nav className="links">
            <a href="#topo">início</a>
            <a href="#sobre">sobre</a>
            <a href="#stack">stack</a>
            <a href="#projetos">projetos</a>
            <a href="#contato">contato</a>
          </nav>
        </div>
      </header>

      <div className="wrap">
        <section className="hero" id="topo">
          <span className="crosshair" style={{ left: "-8px", top: "60px" }} />
          <div className="hero-grid">
            <div className="hero-text">
              <span className="eyebrow reveal">Desenvolvedor Full-stack</span>
              <h1 className="name reveal">Raphael Martins<span className="dot">.</span></h1>
              <p className="role reveal">Desenvolvo aplicações web para a construção civil, do banco de dados ao produto no ar.</p>
              <div className="identity reveal">
                <span className="fact">20 anos</span>
                <span className="fact">Goiânia, GO</span>
                <span className="status"><span className="d" />Disponível para novos projetos</span>
              </div>
            </div>
            <figure className="photo reveal">
              <div className="ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="flip" src="/perfil.jpg" alt="Raphael Martins" />
                <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
              </div>
            </figure>
          </div>
        </section>

        <section id="sobre">
          <div className="shead"><span className="no">01</span><h2>Sobre</h2></div>
          <div className="about reveal">
            <div>
              <p>Sou <strong>Raphael Martins</strong>, desenvolvedor full-stack com foco em aplicações web para a construção civil. Busco transformar processos manuais e planilhas em <strong>soluções digitais bem pensadas, que realmente rodam em produção</strong>.</p>
              <p>Trabalho <strong>dentro de uma incorporadora</strong>, o que muda o jogo: em vez de receber requisito pronto, vivo o problema de obra de perto, junto com quem sofre com ele, e desenho, construo e coloco a solução no ar de ponta a ponta.</p>
              <p>Essa proximidade com quem usa o sistema <strong>moldou minha atenção a fluxos operacionais reais, integração com sistemas legados e rastreabilidade</strong>; perspectivas que carrego para o código, do banco de dados ao produto final.</p>
            </div>
            <div className="aside">
              <div className="row"><span className="k">Idade</span><span className="v">20 anos</span></div>
              <div className="row"><span className="k">Localização</span><span className="v">Goiânia, GO</span></div>
              <div className="row"><span className="k">Foco</span><span className="v">Full-stack / Product</span></div>
              <div className="row"><span className="k">Setor</span><span className="v">Construção · Incorporação</span></div>
              <div className="row"><span className="k">Entrega</span><span className="v">Vercel · CI/CD</span></div>
            </div>
          </div>
        </section>

        <section id="stack">
          <div className="shead"><span className="no">02</span><h2>Stack</h2></div>
          <div className="stack">
            <div className="col reveal"><h3>Full-stack</h3><ul><li>Next.js 15 (App Router)</li><li>React 19 · TypeScript</li><li>Tailwind · shadcn/Radix</li><li>TanStack Query · Zod</li></ul></div>
            <div className="col reveal"><h3>Dados</h3><ul><li>Supabase · Postgres</li><li>Prisma · RLS</li><li>Edge Functions (Deno)</li><li>Modelagem dimensional</li></ul></div>
            <div className="col reveal"><h3>Integrações</h3><ul><li>ERP UAU (folha)</li><li>Construflow</li><li>Azure AD / SSO</li><li>Microsoft Graph API</li></ul></div>
            <div className="col reveal"><h3>Qualidade &amp; Entrega</h3><ul><li>Sentry · PostHog</li><li>Vercel · CI (Actions)</li><li>Conventional Commits</li><li>Release Please</li></ul></div>
          </div>
        </section>

        <section id="projetos">
          <div className="shead"><span className="no">03</span><h2>Projetos</h2></div>
          <div className="cases">
            {[...projetos]
              .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
              .map((c) => <ProjectCase c={c} key={c.name} />)}
          </div>
        </section>

        <section id="contato">
          <div className="shead"><span className="no">04</span><h2>Contato</h2></div>
          <div className="contact reveal">
            <h2>Bora construir algo que sai do papel?</h2>
            <p>Aberto a conversas sobre produtos internos, integrações e sistemas para engenharia e construção.</p>
            <div className="cbtns">
              <a className="btn pri" href="https://www.linkedin.com/in/raphael-martins-47604a381" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="btn" href="mailto:raphaelmartinns54@gmail.com">E-mail</a>
              <a className="btn" href="https://wa.me/5562998387048" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
        </section>

        <footer>
          <span>© 2026 · Raphael Martins</span>
          <span>Desenhado como prancha técnica · sem dados internos</span>
        </footer>
      </div>

      <ClientEnhancements />
      <CursorReticle />
    </div>
  );
}

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDown, Download, ExternalLink, Menu, X } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import portrait from '@assets/Myphotonew_1786758109439.png';
import veloxImage from '@assets/CEO_Dashboard_1786758099805.png';
import electronicsImage from '@assets/Electronics_Dashboard_Overview_1786758099804.png';
import churnImage from '@assets/Customer_Retention_Dashboard_1786758099804.png';
import resumePdf from '@assets/Sahil-Darji-Resume_1786758215241.pdf';

const queryClient = new QueryClient();

type Project = {
  key: string;
  cat: string;
  title: string;
  image: string;
  alt: string;
  metrics: string[];
  metricLabel: string;
  description: string;
  stack: string;
  question: string;
  finding: string;
  build: string;
  data: string;
  links: { label: string; href: string }[];
};

const projects: Project[] = [
  {
    key: 'velox',
    cat: 'Business Intelligence · Power BI',
    title: 'Project VELOX',
    image: veloxImage,
    alt: 'VELOX executive Power BI dashboard showing health index KPIs and trend charts',
    metrics: ['17-table semantic model', '5 stakeholder dashboards', 'Dedicated tooltip pages'],
    metricLabel: '17 tables · 5 dashboards · 1 semantic model',
    description:
      "A 5-dashboard BI platform for a food-delivery business, built stakeholder-first: separate views for the CEO, ops, customer/revenue, restaurant success, and financial leakage — so each role sees only the KPIs they'd act on.",
    stack: 'Power BI · DAX · Data Modeling · Power Query',
    question:
      "A food-delivery platform's leadership can see individual metrics, but not which business area is actually the weakest right now, or which restaurants/zones need intervention first.",
    finding:
      'Splitting the report by stakeholder responsibility — instead of one giant dashboard — meant each composite score (Executive Health Index, Zone Stability Index, Discount Dependency Score) could point directly at an owner. The financial leakage view specifically separates discount exposure from cancellation exposure, because they need different fixes.',
    build:
      'Star-schema semantic model (17 tables: orders, customers, restaurants, riders, promotions, geography, calendar) built over synthetic food-delivery data I generated myself to mimic realistic operational patterns. 150+ DAX measures for KPIs, dynamic scoring, time intelligence, alert banners, and report-page tooltips.',
    data:
      'Synthetic dataset generated to mirror realistic food-delivery operations — built this way so I could design the semantic model and scoring logic without waiting on a real dataset with the right shape.',
    links: [{ label: 'GitHub', href: 'https://github.com/darji-sahil/project-velox' }],
  },
  {
    key: 'electronics',
    cat: 'Data Analytics · Power BI',
    title: 'Electronics Distribution Analytics',
    image: electronicsImage,
    alt: 'Electronics distribution Power BI dashboard showing sales, cost and profit trends',
    metrics: ['Star schema model', 'Field-parameter measure selector', 'Top/bottom-4 category views'],
    metricLabel: 'Star schema · field parameters · bookmarks',
    description:
      'Sales, cost, profit and shipment analysis for an electronics distributor — built to let a regional manager flip between top and bottom performing categories/cities without opening a second report.',
    stack: 'Power BI · DAX · Power Query · Data Modeling',
    question:
      "A distributor needs to see, at a glance, which product categories and which cities are actually profitable versus just high-revenue — the two aren't the same thing.",
    finding:
      'Separating Top-4 and Bottom-4 categories by profit (not revenue) surfaces categories that look fine on a sales chart but are quietly losing money. Adding a field-parameter measure selector let one visual switch between Sales / Costs / Shipments / Profit without duplicating four separate charts.',
    build:
      'Shipments fact table joined to Products, Locations, People and Calendar dimensions in a star schema. DAX measures for profit %, low-unit-shipment %, and month-over-month growth; Power Query for cleanup; bookmarks and dynamic tooltips for drill-down without leaving the page.',
    data: 'CSV-based distribution dataset covering products, shipments and regional sales.',
    links: [
      { label: 'GitHub', href: 'https://github.com/darji-sahil/electronics-distribution-analytics-dashboard' },
    ],
  },
  {
    key: 'churn',
    cat: 'Machine Learning · Analytics',
    title: 'Customer Retention Intelligence System',
    image: churnImage,
    alt: 'Customer retention prediction app screenshot with churn risk inputs',
    metrics: ['ROC-AUC 0.83', 'Recall 48% → 80%', 'SHAP explainability'],
    metricLabel: 'ROC-AUC 0.83 · recall 48%→80%',
    description:
      'A churn model on the Telco customer dataset. Baseline models missed half the customers who actually churned — rebalancing the training data traded some precision for recall, which is the trade the business actually wants.',
    stack: 'Python · scikit-learn · XGBoost · SHAP · Streamlit',
    question:
      'Which customers are actually about to churn, and which factors — contract type, tenure, pricing, service gaps — are driving that risk, in language a retention team can act on?',
    finding:
      'The baseline Logistic Regression model only caught about 48% of customers who actually churned — meaning it missed roughly half of them, which is the worst failure mode for a retention tool. Rebalancing the training classes lifted recall to 80% for a modest drop in precision — the right trade for this problem, since a missed churner costs more than a false alarm. SHAP confirmed the drivers: month-to-month contracts, low tenure, higher monthly charges, and missing tech support / online security all push risk up.',
    build:
      'Logistic Regression, Random Forest and XGBoost compared on ROC-AUC and F1; class-balancing applied to fix the recall problem; SHAP for both global feature importance and per-customer explanations; Streamlit front-end for live what-if predictions.',
    data:
      "IBM's public Telco Customer Churn dataset (~7,000 customers) — a standard benchmark dataset, used here to prove out the full modeling-to-deployment pipeline end to end.",
    links: [
      { label: 'GitHub', href: 'https://github.com/darji-sahil/churn-retention-intelligence-system' },
      { label: 'Live Demo', href: 'https://churn-retention-system.streamlit.app/' },
    ],
  },
];

const navItems = [
  ['Home', '#hero'],
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Education', '#education'],
  ['Contact', '#contact'],
];

function Header({ onNavigate }: { onNavigate: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('#hero');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(`#${entry.target.id}`)),
      { rootMargin: '-38% 0px -55% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const go = () => {
    setMenuOpen(false);
    onNavigate();
  };

  return (
    <header className="site-header">
      <nav className="wrap nav" aria-label="Primary navigation">
        <a className="brand" href="#hero" onClick={go} data-testid="link-brand">Sahil Darji</a>
        <div className="nav-right">
          <div className="navlinks">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className={active === href ? 'active' : ''}
                onClick={go}
                data-testid={`link-nav-${label.toLowerCase()}`}
              >
                {label}
              </a>
            ))}
          </div>
          <a
            className="resume-btn"
            href={resumePdf}
            download="Sahil-Darji-Resume.pdf"
            data-testid="link-resume-navbar"
          >
            <Download aria-hidden="true" /> Resume
          </a>
          <button
            className="navtoggle"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map(([label, href]) => (
          <a key={href} href={href} onClick={go} data-testid={`link-mobile-${label.toLowerCase()}`}>
            {label}
          </a>
        ))}
      </div>
    </header>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow reveal">{children}</div>;
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  const activate = () => onOpen(project);
  const keyboardActivate = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  };
  return (
    <div
      className="proj-card reveal"
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={keyboardActivate}
      aria-label={`Open ${project.title} case study`}
      data-testid={`card-project-${project.key}`}
    >
      <div className="proj-thumb">
        <img src={project.image} alt={project.alt} loading="lazy" data-testid={`img-project-${project.key}`} />
      </div>
      <div className="proj-body">
        <div className="proj-cat">{project.cat}</div>
        <h3>{project.title}</h3>
        <div className="proj-metric">{project.metricLabel}</div>
        <p>{project.description}</p>
        <div className="proj-more"><span>Open case study →</span><span>{project.key === 'churn' ? 'Python · SHAP' : 'Power BI'}</span></div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    previousFocus.current = document.activeElement as HTMLElement;
    document.body.classList.add('modal-open');
    closeRef.current?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modal-open');
      previousFocus.current?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;
  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      data-testid="modal-overlay"
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-testid="modal-case-study">
        <div className="modal-chrome">
          <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Close case study" data-testid="button-close-modal">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="modal-imgcol">
          <img src={project.image} alt={project.alt} data-testid={`img-modal-${project.key}`} />
        </div>
        <div className="modal-content">
          <div className="modal-cat">{project.cat}</div>
          <h3 id="modal-title">{project.title}</h3>
          <div className="modal-metrics">{project.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div>
          <div className="modal-section"><div className="lbl">Stack</div><p>{project.stack}</p></div>
          <div className="modal-section"><div className="lbl">Business question</div><p>{project.question}</p></div>
          <div className="modal-section"><div className="lbl">What I found</div><p>{project.finding}</p></div>
          <div className="modal-section"><div className="lbl">How it was built</div><p>{project.build}</p></div>
          <div className="modal-section"><div className="lbl">Data source</div><p>{project.data}</p></div>
          <div className="modal-links">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" data-testid={`link-project-${project.key}-${link.label.toLowerCase().replace(' ', '-')}`}>
                {link.label} <ExternalLink aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('in')),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    setRevealed(true);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header onNavigate={() => undefined} />
      <main>
        <section id="hero" className="hero">
          <div className="wrap hero-grid">
            <div className={revealed ? 'reveal in' : 'reveal'}>
              <h1>I turn messy business<br />data into the next decision.</h1>
              <p className="lede">Data analyst focused on Power BI, SQL and Python. Three shipped projects, real evaluation numbers, no filler metrics.</p>
              <div className="cta-row">
                <a href="#projects" className="btn primary" data-testid="link-view-projects">View Projects <ArrowDown aria-hidden="true" /></a>
                <a href={resumePdf} download="Sahil-Darji-Resume.pdf" className="btn ghost" data-testid="link-resume-hero">Download Resume <Download aria-hidden="true" /></a>
              </div>
              <div className="status" data-testid="status-open-to-roles"><span className="dot" /> Open to Data Analyst &amp; BI roles</div>
            </div>
            <div className={revealed ? 'portrait-frame reveal in' : 'portrait-frame reveal'}>
              <div className="portrait-imgbox"><img src={portrait} alt="Portrait of Sahil Darji" data-testid="img-portrait" /></div>
              <div className="portrait-cap"><span>Sahil Darji</span><span>Mumbai, India</span></div>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="wrap about-grid">
            <div className="about-copy reveal">
              <SectionEyebrow>About</SectionEyebrow>
              <h2>I don't build dashboards.<br />I build the question they answer.</h2>
              <p>I'm a final-year <strong>B.Tech Artificial Intelligence &amp; Data Science</strong> student (KJSIT, Mumbai) focused on data analytics and business intelligence. My work spans SQL, Power BI, Excel, Python, and DAX — and every project I ship starts from a business question, not a chart type.</p>
              <p>During my finance internship at <strong>Yodaplus Technologies</strong>, I built AI-powered financial analysis workflows using CrewAI across six industries — that's where I learned that a dashboard nobody trusts is worse than no dashboard at all.</p>
              <p>I'm looking for Data Analyst or BI roles where I can sit close to the decision, not just the dataset.</p>
            </div>
            <div className="approach-box reveal">
              <div className="tag">How I actually work</div>
              <p>I don't start in Power BI. I start by writing down the decision someone needs to make and what would change their mind. Then I check whether the data can actually answer that — half the time the first version of a "dashboard" I build is just a scratch query to check if the insight is real before I model it. If a metric can't survive "so what would we do differently," I cut it.</p>
              <div className="sign">— what "Data Analyst" means to me</div>
            </div>
          </div>
        </section>

        <section id="skills">
          <div className="wrap">
            <div className="section-heading skills-heading">
              <SectionEyebrow>Skills</SectionEyebrow>
              <h2 className="reveal">Where I'm sharp, and where I'm still building.</h2>
            </div>
            <div className="skill-cols reveal">
              <SkillColumn level="Daily use" title="BI & Analytics" subtitle="Used across my dashboard and analytics work." items={['SQL (MySQL) — joins, subqueries, CTEs, window functions', 'Power BI — semantic modeling, star schema', 'DAX — KPIs, time intelligence, dynamic scoring', 'Power Query, Excel', 'Data cleaning & modeling']} />
              <SkillColumn level="Project-level" title="Programming & ML" subtitle="Applied in the churn model and internship work." items={['Python — Pandas, NumPy', 'scikit-learn — Logistic Regression, Random Forest, XGBoost', 'SHAP — model explainability', 'Streamlit — deployment', 'Tableau']} />
              <SkillColumn level="Working knowledge" title="Tools & AI Workflows" subtitle="From coursework and the Yodaplus internship." items={['CrewAI — multi-agent task design', 'Prompt engineering & evaluation criteria', 'Git & GitHub', 'Linux fundamentals', 'Business communication']} />
            </div>
          </div>
        </section>

        <section id="experience">
          <div className="wrap">
            <SectionEyebrow>Experience</SectionEyebrow>
            <div className="exp-row reveal">
              <div><div className="exp-date">Jun 2025 – Aug 2025</div><div className="exp-loc">Mumbai, India</div></div>
              <div className="exp-role">
                <h3>Finance Intern</h3><div className="company">Yodaplus Technologies Pvt. Ltd.</div>
                <ul>
                  <li>Built AI-powered financial analysis workflows on the CrewAI multi-agent framework, deployed across FMCG, IT, logistics, pharma, energy, and manufacturing use cases.</li>
                  <li>Designed the task logic, prompts, and evaluation criteria each agent used — this is what actually moved output quality, not the framework itself.</li>
                  <li>Adapted the same pipeline for US and Indian financial markets, since region-specific reporting norms and currency logic broke the first version.</li>
                  <li>Worked directly with product and engineering to turn ambiguous "make it smarter" feedback into concrete prompt and workflow changes.</li>
                </ul>
                <div className="tagrow">{['CrewAI', 'Financial Analysis', 'Prompt Engineering', 'Python', 'Data Analysis', 'Business Communication'].map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="wrap">
            <div className="proj-head reveal"><SectionEyebrow>Selected Work</SectionEyebrow><h2>Three projects. Each one had a real finding, not just a finished chart.</h2></div>
            <div className="proj-grid">{projects.map((project) => <ProjectCard key={project.key} project={project} onOpen={setSelectedProject} />)}</div>
          </div>
        </section>

        <section id="education">
          <div className="wrap">
            <div className="section-heading"><SectionEyebrow>Education &amp; Certifications</SectionEyebrow><h2 className="reveal">Formal training, plus proof I sought out more.</h2></div>
            <div className="edu-grid reveal">
              <div className="edu-card"><div className="tag">Pursuing · Expected 2027</div><h3>K J Somaiya Institute of Technology</h3><div className="sub">B.E., Artificial Intelligence &amp; Data Science — Honours in Blockchain Technology</div><div className="stat-inline"><span>CGPA <b>8.99 / 10</b></span></div></div>
              <div className="edu-card"><div className="tag">Certifications</div><h3>Applied learning</h3><ul className="cert-list">{['Deloitte Australia — Data Analytics Job Simulation', 'Data Analyst — Big 4 Ready', 'Data Analyst — Skill Certification', 'Power BI Workshop', 'Git & GitHub', 'Linux Fundamentals', 'CrewAI'].map((cert) => <li key={cert}>{cert}</li>)}</ul></div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="wrap contact-grid">
            <div className="reveal"><SectionEyebrow>Contact</SectionEyebrow><h2>Let's talk about a<br />Data Analyst role.</h2><p>Open to Data Analyst and Business Intelligence roles — happy to walk through any of the projects above in more depth, including the parts that didn't work on the first try.</p></div>
            <div className="contact-list reveal">
              <div className="contact-row"><span className="k">Email</span><a className="v" href="mailto:sahildarji030@gmail.com" data-testid="link-contact-email">sahildarji030@gmail.com</a></div>
              <div className="contact-row"><span className="k">LinkedIn</span><a className="v" href="https://www.linkedin.com/in/sahil-darji-568352340/" target="_blank" rel="noopener noreferrer" data-testid="link-contact-linkedin">Connect</a></div>
              <div className="contact-row"><span className="k">GitHub</span><a className="v" href="https://github.com/darji-sahil" target="_blank" rel="noopener noreferrer" data-testid="link-contact-github">View repos</a></div>
            </div>
          </div>
        </section>
      </main>
      <footer><div className="wrap footer-row"><div>Sahil Darji — Data Analyst · Business Intelligence</div><div className="footer-links"><a href="mailto:sahildarji030@gmail.com">Email</a><a href="https://www.linkedin.com/in/sahil-darji-568352340/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/darji-sahil" target="_blank" rel="noopener noreferrer">GitHub</a></div></div></footer>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}

function SkillColumn({ level, title, subtitle, items }: { level: string; title: string; subtitle: string; items: string[] }) {
  return <div className="skill-col"><div className="skill-head"><div className="lvl">{level}</div><h3>{title}</h3><p>{subtitle}</p></div><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Portfolio} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;

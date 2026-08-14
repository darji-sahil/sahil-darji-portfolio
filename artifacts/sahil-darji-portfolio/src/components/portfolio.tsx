import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import {
  ArrowDownRight,
  ChevronRight,
  Download,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import portraitPath from '@assets/Myphoto_1786686114750.png';
import veloxPath from '@assets/VELOX_Executive_BI_thumbnail_1786686114749.png';
import electronicsPath from '@assets/Electronics_Distribution_thumbnail_1786686114748.png';
import retentionPath from '@assets/image_1786690007537.png';

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tools: string[];
  overview: string;
  github: string;
  liveDemo?: string;
};

const navItems = [
  ['home', 'Home'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['education', 'Education'],
  ['contact', 'Contact'],
];

const projects: Project[] = [
  {
    id: 'velox',
    title: 'Project VELOX',
    category: 'Business Intelligence / Power BI',
    description: 'A five-page Power BI business intelligence platform with a unified semantic model, 150+ reusable DAX measures, and executive, operations, customer, restaurant and financial dashboards.',
    image: veloxPath,
    tools: ['Power BI', 'DAX', 'Data Modeling', 'Business Intelligence'],
    overview: 'A five-page Power BI business intelligence platform spanning Executive, Operations, Customer, Restaurant and Financial Intelligence. It uses a unified semantic model and 150+ reusable DAX measures for executive KPIs, dynamic scoring, time intelligence, alert engines, drill-through tooltips and contextual decision support.',
    github: 'https://github.com/darji-sahil/project-velox',
  },
  {
    id: 'electronics',
    title: 'Electronics Distribution Analytics',
    category: 'Data Analytics / Power BI',
    description: 'Interactive analytics dashboard built to analyze sales, costs, shipments, profitability, product performance and regional business trends.',
    image: electronicsPath,
    tools: ['Power BI', 'DAX', 'Excel', 'Data Analysis', 'Data Visualization'],
    overview: 'An interactive analytics dashboard for exploring sales, costs, shipments, profitability, product performance and regional business trends. The experience brings operational and commercial analysis into a single Power BI view using DAX, Excel and data visualization.',
    github: 'https://github.com/darji-sahil/electronics-distribution-analytics-dashboard',
  },
  {
    id: 'retention',
    title: 'AI-Powered Customer Retention Intelligence System',
    category: 'Machine Learning / Analytics',
    description: 'Machine learning solution designed to predict customer churn risk and provide interpretable insights into customer behavior using classification models and SHAP.',
    image: retentionPath,
    tools: ['Python', 'Pandas', 'scikit-learn', 'SHAP', 'Streamlit', 'Machine Learning'],
    overview: 'An end-to-end customer retention intelligence system that predicts churn risk and explains customer behavior. It combines preprocessing, feature engineering, classification models, SHAP interpretability and a Streamlit interface for real-time predictions.',
    github: 'https://github.com/darji-sahil/churn-retention-intelligence-system',
    liveDemo: 'https://churn-retention-system.streamlit.app/',
  },
];

function usePortfolioNavigation() {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = navItems.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-18% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return { active, scrolled, scrollTo };
}

function Reveal({ children, className = '', delay = '' }: { children: ReactNode; className?: string; delay?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${delay} ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

function Navbar({ active, scrolled, scrollTo }: { active: string; scrolled: boolean; scrollTo: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const move = (id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  };
  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-wide nav-inner">
        <button className="brand" onClick={() => move('home')} data-testid="button-brand" aria-label="Go to home">
          <span className="brand-mark">SD</span><span>Sahil Darji</span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <button key={id} className={`nav-link ${active === id ? 'active' : ''}`} onClick={() => move(id)} data-testid={`button-nav-${id}`}>
              {label}
            </button>
          ))}
        </nav>
        <a className="resume-link" href="/Sahil-Darji-Resume.pdf" download data-testid="link-resume-nav">
          Resume <Download size={13} />
        </a>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-nav" data-testid="button-mobile-menu">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        {menuOpen && (
          <nav id="mobile-nav" className="mobile-menu" aria-label="Mobile navigation">
            {navItems.map(([id, label]) => (
              <button key={id} className={active === id ? 'active' : ''} onClick={() => move(id)} data-testid={`button-mobile-nav-${id}`}>{label}</button>
            ))}
            <a href="/Sahil-Darji-Resume.pdf" download onClick={() => setMenuOpen(false)} data-testid="link-resume-mobile">Download Resume</a>
          </nav>
        )}
      </div>
    </header>
  );
}

function Hero({ scrollTo }: { scrollTo: (id: string) => void }) {
  const metrics = [['3+', 'Featured Projects'], ['1+', 'Internship'], ['8.99/10', 'CGPA'], ['150+', 'Reusable DAX Measures']];
  return (
    <section id="home" className="hero">
      <div className="container-wide">
        <div className="hero-grid">
          <div>
            <Reveal><div className="eyebrow">Data Analyst <span aria-hidden="true">•</span> Business Intelligence</div></Reveal>
            <Reveal delay="stagger-1"><h1>Turning Complex Data Into <em>Clear Business Decisions.</em></h1></Reveal>
            <Reveal delay="stagger-2"><p className="hero-copy">I build analytical solutions with SQL, Power BI, Excel and Python — turning complex data into dashboards, measurable insights, and decision-ready business intelligence.</p></Reveal>
            <Reveal delay="stagger-3">
              <div className="hero-actions">
                <button className="button-primary" onClick={() => scrollTo('projects')} data-testid="button-view-work">View My Work <ArrowDownRight size={15} /></button>
                <a className="button-secondary" href="/Sahil-Darji-Resume.pdf" download data-testid="link-download-resume">Download Resume <Download size={14} /></a>
              </div>
              <div className="hero-note"><span className="status-dot" /> Open to analytics-focused opportunities</div>
            </Reveal>
          </div>
          <Reveal delay="stagger-2">
            <div className="portrait-wrap">
              <div className="portrait-frame">
                <img src={portraitPath} alt="Sahil Darji, Data Analyst and Business Intelligence professional" />
                <div className="portrait-caption">MUMBAI / INDIA</div>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay="stagger-3">
          <div className="metrics" aria-label="Professional highlights">
            {metrics.map(([value, label], index) => <div className="metric" key={label} data-testid={`metric-${index}`}><div className="metric-value">{value}</div><div className="metric-label">{label}</div></div>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="section-heading"><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

function About() {
  const bring = ['Data Analysis', 'Business Intelligence', 'Dashboard Development', 'SQL & Data Modeling', 'Data Visualization', 'Problem Solving'];
  return (
    <section id="about" className="section">
      <div className="container-wide">
        <Reveal><SectionHeading eyebrow="01 / About" title="A practical lens on complex data." description="The goal is not more charts. It is a clearer next decision." /></Reveal>
        <div className="about-grid">
          <Reveal delay="stagger-1">
            <div className="about-copy">
              <p>I’m a B.Tech Artificial Intelligence &amp; Data Science student focused on Data Analytics and Business Intelligence. My work centers on transforming raw data into structured analysis, interactive dashboards, and insights that explain what is happening in a business and why.</p>
              <p>My core toolkit includes SQL, Power BI, Excel, Python, Pandas, NumPy, DAX and data visualization. Through projects and my Finance Internship at Yodaplus Technologies, I’ve worked across business intelligence, financial analysis, AI-powered analytical workflows, and data-driven problem solving.</p>
              <p>I’m particularly interested in Data Analyst and Business Intelligence roles where I can combine analytical thinking, technical skills, and business context to turn data into useful decisions.</p>
              <div className="bring-grid">{bring.map((item) => <div className="bring-item" key={item}>{item}</div>)}</div>
            </div>
          </Reveal>
          <Reveal delay="stagger-2">
            <div className="signal-card">
              <h3>THE WORKING SIGNAL</h3>
              <div className="signal-lines">
                <div className="signal-line"><span>Raw data</span><span>→ structure</span></div>
                <div className="signal-line"><span>Structure</span><span>→ analysis</span></div>
                <div className="signal-line"><span>Analysis</span><span>→ insight</span></div>
                <div className="signal-line"><span>Insight</span><span>→ action</span></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const groups = [
    ['01', 'Core Analytics', ['SQL', 'MySQL', 'Power BI', 'Tableau', 'Microsoft Excel', 'DAX', 'Power Query', 'Data Analysis', 'Data Visualization', 'Dashboard Development', 'Data Cleaning', 'Data Modeling']],
    ['02', 'Programming & Data', ['Python', 'Pandas', 'NumPy', 'scikit-learn']],
    ['03', 'AI / Tools', ['Machine Learning', 'CrewAI', 'SHAP', 'Streamlit', 'Git', 'GitHub', 'Linux']],
  ];
  return (
    <section id="skills" className="section">
      <div className="container-wide">
        <Reveal><SectionHeading eyebrow="02 / Skills" title="The toolkit behind the insight." description="A working stack across analytics, data products, and AI-powered workflows." /></Reveal>
        <div className="skills-grid">{groups.map(([index, title, skills], groupIndex) => <Reveal key={title as string} delay={`stagger-${groupIndex + 1}`}><div className="skill-card"><div className="skill-index">{index}</div><h3>{title}</h3><div className="skill-list">{(skills as string[]).map((skill) => <span className="skill-pill" key={skill}>{skill}</span>)}</div></div></Reveal>)}</div>
      </div>
    </section>
  );
}

function Experience() {
  const bullets = [
    'Developed AI-powered financial analysis workflows using the CrewAI multi-agent framework across FMCG, IT, logistics, pharma, energy, and manufacturing domains.',
    'Designed multi-agent task logic, prompts, and evaluation criteria to improve output quality and consistency.',
    'Adapted AI solutions for US and Indian financial markets to generate domain-specific insights.',
    'Collaborated cross-functionally with product and engineering teams to refine AI-driven financial tools.',
  ];
  const tags = ['CrewAI', 'Financial Analysis', 'Business Communication', 'Python', 'Data Analysis', 'Prompt Engineering'];
  return (
    <section id="experience" className="section">
      <div className="container-wide">
        <Reveal><SectionHeading eyebrow="03 / Experience" title="Where analysis meets the product." /></Reveal>
        <Reveal delay="stagger-1">
          <div className="experience-card">
            <div className="experience-meta"><strong>Jun 2025 – Aug 2025</strong>Mumbai, India</div>
            <div className="experience-body">
              <h3>Finance Intern</h3><div className="company">Yodaplus Technologies Pvt. Ltd.</div>
              <ul>{bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              <div className="tag-row">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Projects({ onOpen }: { onOpen: (project: Project) => void }) {
  return (
    <section id="projects" className="section projects-section">
      <div className="container-wide">
        <Reveal><div className="projects-heading"><SectionHeading eyebrow="04 / Selected work" title="Dashboards that answer the next question." description="A selection of analytical systems built to move from information to understanding." /></div></Reveal>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={`stagger-${(index % 3) + 1}`}>
              <article className="project-card" role="button" tabIndex={0} onClick={() => onOpen(project)} onKeyDown={(event: KeyboardEvent<HTMLElement>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(project); } }} data-testid={`card-project-${project.id}`} aria-label={`View details for ${project.title}`}>
                <div className="project-image"><img src={project.image} alt={`${project.title} dashboard thumbnail`} loading={index === 0 ? 'eager' : 'lazy'} /></div>
                <div className="project-info"><div className="project-category">{project.category}</div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tools.slice(0, 4).map((tool) => <span className="tag" key={tool}>{tool}</span>)}</div><div className="project-actions"><div className="project-cta">View Case Study <ChevronRight size={15} /></div><div className="project-external-links"><a className="project-link" href={project.github} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`Open ${project.title} on GitHub`}>GitHub <ExternalLink size={13} /></a>{project.liveDemo && <a className="project-link" href={project.liveDemo} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} aria-label={`Open live demo for ${project.title}`}>Live Demo <ExternalLink size={13} /></a>}</div></div></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <section id="education" className="section">
      <div className="container-wide">
        <Reveal><SectionHeading eyebrow="05 / Education" title="A foundation in systems, analysis, and applied learning." /></Reveal>
        <div className="credentials-grid">
          <Reveal delay="stagger-1">
            <div className="credential-card">
              <div className="credential-label">Education / Pursuing</div>
              <h3>K J Somaiya Institute of Technology</h3>
              <p>Bachelor of Engineering<br />Artificial Intelligence &amp; Data Science</p>
              <div className="credential-meta"><span>CGPA <strong>8.99/10</strong></span><span>Status <strong>Pursuing</strong></span></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="container-wide">
        <Reveal>
          <div className="contact-block">
            <div><div className="eyebrow">06 / Contact</div><h2>Let's turn data into something useful.</h2><p>I'm open to Data Analyst, Business Intelligence and analytics-focused opportunities.</p></div>
              <div className="contact-links">
              <a className="contact-link" href="mailto:sahildarji030@gmail.com" data-testid="link-email"><span>Email</span><span>sahildarji030@gmail.com</span></a>
              <a className="contact-link" href="https://www.linkedin.com/in/sahil-darji-568352340/" target="_blank" rel="noreferrer" data-testid="link-linkedin"><span>LinkedIn</span><span className="contact-value">Connect <ExternalLink size={13} /></span></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="footer"><div className="container-wide footer-inner"><div><span className="footer-name">Sahil Darji</span><span style={{ marginLeft: 12 }}>Data Analyst | Business Intelligence</span></div><div className="footer-links"><span>© 2026 Sahil Darji</span><a href="mailto:sahildarji030@gmail.com" data-testid="link-footer-email">Email</a><a href="https://www.linkedin.com/in/sahil-darji-568352340/" target="_blank" rel="noreferrer" data-testid="link-footer-linkedin">LinkedIn</a><a href="https://github.com/darji-sahil" target="_blank" rel="noreferrer" data-testid="link-footer-github">GitHub</a></div></div></footer>;
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKeyDown); };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" tabIndex={-1} ref={dialogRef}>
        <div className="modal-top"><div><div className="eyebrow">{project.category}</div><h2 id="project-modal-title">{project.title}</h2></div><button className="modal-close" onClick={onClose} aria-label="Close project details" data-testid="button-close-project-modal"><X size={17} /></button></div>
        <div className="modal-content">
          <div className="modal-image"><img src={project.image} alt={`${project.title} full dashboard view`} /></div>
          <div className="detail-list">
            <div className="detail-item"><h4>Overview</h4><p>{project.overview}</p></div>
            <div className="detail-item"><h4>Tools</h4><div className="modal-tools">{project.tools.map((tool) => <span className="tag" key={tool}>{tool}</span>)}</div></div>
            <div className="detail-item modal-actions"><a className="project-link" href={project.github} target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} /></a>{project.liveDemo && <a className="project-link" href={project.liveDemo} target="_blank" rel="noreferrer">Live Demo <ExternalLink size={13} /></a>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Portfolio() {
  const { active, scrolled, scrollTo } = usePortfolioNavigation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  return (
    <div className="site-shell">
      <Navbar active={active} scrolled={scrolled} scrollTo={scrollTo} />
      <main>
        <Hero scrollTo={scrollTo} />
        <About />
        <Skills />
        <Experience />
        <Projects onOpen={setSelectedProject} />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
}
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  MessageCircle,
  Menu,
  Code,
  Database,
  FileSpreadsheet,
  GraduationCap,
  BarChart3,
} from "lucide-react"
import { BackToTopButton } from "@/components/back-to-top"
import { SkillCard } from "@/components/skill-card"
import { ServiceCard } from "@/components/service-card"
import { AnimatedSection } from "@/components/animated-section"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl md:text-2xl text-primary">Gabriel Florêncio</div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm font-medium transition-colors hover:text-primary">
              Sobre
            </a>
            <a href="#skills" className="text-sm font-medium transition-colors hover:text-primary">
              Habilidades
            </a>
            <a href="#services" className="text-sm font-medium transition-colors hover:text-primary">
              Serviços
            </a>
            <a href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contato
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 flex flex-col items-center text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
              Desenvolvedor RPA & Analista BI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[700px] mx-auto mb-8">
              Transformando dados em insights e processos em automações
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="#contact">Entre em contato</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#services">Ver serviços</a>
              </Button>
            </div>
          </AnimatedSection>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 md:py-16">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8 text-center">Sobre</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  <img
                    src="/images/gabriel-profile.jpg"
                    alt="Gabriel Florêncio - Desenvolvedor RPA e Analista BI"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Gabriel Florêncio</h3>
                <p className="text-muted-foreground mb-6">
                  Desenvolvedor de RPA e analista de Business Intelligence com experiência em automações utilizando
                  Python, Power Automate, Selenium e desenvolvimento de dashboards com Power BI e Looker Studio.
                  Apaixonado por tecnologia, artes marciais e cultura geek.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">RPA</Badge>
                  <Badge variant="secondary">Business Intelligence</Badge>
                  <Badge variant="secondary">Automação</Badge>
                  <Badge variant="secondary">Data Analytics</Badge>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900 rounded-xl">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8 text-center">Habilidades</h2>

            <Tabs defaultValue="languages" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="languages">Linguagens</TabsTrigger>
                <TabsTrigger value="tools">Ferramentas</TabsTrigger>
                <TabsTrigger value="automation">Automação</TabsTrigger>
                <TabsTrigger value="methodologies">Metodologias</TabsTrigger>
              </TabsList>

              <TabsContent value="languages" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <SkillCard name="Python" level="Avançado" />
                  <SkillCard name="SQL" level="Avançado" />
                  <SkillCard name="C#" level="Intermediário" />
                  <SkillCard name="NoSQL" level="Intermediário" />
                  <SkillCard name="VBA" level="Intermediário" />
                  <SkillCard name="R" level="Básico" />
                </div>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SkillCard name="Power BI" level="Avançado" />
                  <SkillCard name="Jupyter" level="Avançado" />
                  <SkillCard name="Looker Studio" level="Intermediário" />
                  <SkillCard name="Git" level="Intermediário" />
                </div>
              </TabsContent>

              <TabsContent value="automation" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SkillCard name="Power Automate" level="Avançado" />
                  <SkillCard name="Selenium" level="Avançado" />
                  <SkillCard name="Automation Anywhere" level="Básico" />
                </div>
              </TabsContent>

              <TabsContent value="methodologies" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SkillCard name="Data Storytelling" level="Avançado" />
                  <SkillCard name="ETL com Python" level="Avançado" />
                  <SkillCard name="Agile" level="Intermediário" />
                  <SkillCard name="Data Solution Architecture" level="Avançado" />
                </div>
              </TabsContent>
            </Tabs>
          </AnimatedSection>
        </section>

        {/* Services Section */}
        <section id="services" className="py-12 md:py-16">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8 text-center">Serviços</h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Ofereço soluções completas em automação, análise de dados e business intelligence para otimizar seus
              processos e decisões estratégicas.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <ServiceCard
                title="Desenvolvimento em Python"
                description="Soluções robustas e escaláveis para análise de dados e automação de processos."
                icon={<Code className="h-6 w-6" />}
                services={[
                  "Análise de Dados",
                  "ETL (Extract, Transform, Load)",
                  "Automação de Processos",
                  "Web Scraping",
                  "Consultoria em Processos e Dados",
                ]}
              />
              <ServiceCard
                title="Serviços em Banco de Dados"
                description="Consultoria especializada em modelagem, otimização e gestão de dados."
                icon={<Database className="h-6 w-6" />}
                services={[
                  "Consultoria e Modelagem de Dados",
                  "Desenvolvimento e Otimização em SQL",
                  "Implementação de Processos ETL",
                  "Automação e Geração de Relatórios",
                ]}
              />
              <ServiceCard
                title="Business Intelligence com Excel e VBA"
                description="Transforme suas planilhas em ferramentas inteligentes de gestão e análise."
                icon={<FileSpreadsheet className="h-6 w-6" />}
                services={[
                  "Desenvolvimento de Planilhas Inteligentes",
                  "Automação com VBA",
                  "Dashboards Interativos e Visuais Gerenciais",
                  "Auditoria e Validação de Dados",
                ]}
              />
              <ServiceCard
                title="Mentoria em Business Intelligence"
                description="Orientação especializada para estruturar e otimizar projetos de BI."
                icon={<GraduationCap className="h-6 w-6" />}
                services={[
                  "Estruturação de Projetos BI do zero",
                  "Definição de KPIs e Métricas",
                  "Suporte em Ferramentas (Power BI, Excel, Python, SQL)",
                  "Boas práticas em modelagem e visualização de dados",
                ]}
              />
              <ServiceCard
                title="Desenvolvimento com R para Análises Avançadas"
                description="Análises estatísticas e modelagem preditiva com R."
                icon={<BarChart3 className="h-6 w-6" />}
                services={[
                  "Modelagem Estatística e Predição",
                  "Visualizações com ggplot2 e Shiny",
                  "ETL com dplyr e tidyr",
                  "Integração com Dashboards",
                ]}
              />
            </div>
          </AnimatedSection>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-16">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8 text-center">Contato</h2>
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-6 text-center">Informações de Contato</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>gabrielflorencioti@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <a
                      href="https://wa.me/558599508814"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      WhatsApp Profissional
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-primary" />
                    <a
                      href="https://linkedin.com/in/gabrielflorenciorpa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      linkedin.com/in/gabrielflorenciorpa
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <a
                      href="https://freelancer.co.ke/u/gabsflorenziopy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      freelancer.co.ke/u/gabsflorenziopy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-50 dark:bg-slate-900">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                "Transformando desafios em soluções através da tecnologia e criatividade."
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                © {new Date().getFullYear()} Gabriel Florêncio. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/gabsflorenzio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/gabrielflorenciorpa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="mailto:gabrielflorencioti@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <BackToTopButton />
    </div>
  )
}

# 🎌 A.N.I.M.E.

**A.N.I.M.E.** – _Aplicativo Nerd Interativo de Monitoramento de Episódios_ – é um sistema completo para quem quer **organizar, acompanhar e controlar** sua biblioteca de animes de forma moderna, personalizada e inteligente.

---

## 🧠 Sobre o Projeto

A.N.I.M.E. nasceu da necessidade de fãs de animes que desejam mais do que simples listas. Com uma interface fluida, visual agradável e recursos avançados como importação/exportação de CSV, ordenação dinâmica, filtros por status e muito mais, este projeto transforma sua jornada otaku em uma experiência organizada e divertida.

---

## 🧩 Funcionalidades

- ✅ **Gestão por Categorias**:
  - Assistidos
  - Assistindo
  - Lista de Desejos
  - Não Interessado

- 📥 **Importação de CSV**  
  Importe seus animes com nome, nota e categoria para preencher a biblioteca automaticamente.

- 📤 **Exportação para CSV**  
  Exporte seu progresso atual com um clique.

- 🔍 **Busca com auto-sugestão**  
  Digite parte do nome e receba sugestões ao vivo com pré-visualização.

- 🔃 **Ordenação Dinâmica**  
  Organize cada categoria por nome (A–Z/Z–A) ou nota (crescente/decrescente).

- 💾 **Persistência no Navegador**  
  Tudo salvo no `localStorage`: notas, posição, status, ordenações e configurações.

- 🎨 **Tema escuro responsivo**  
  Estilo moderno com animações suaves e ótima experiência mobile.

- 🚫 **Categoria "Não Interessado"**  
  Marque obras que não pretende assistir — sem apagar da sua memória otaku.

---

## 🛠️ Tecnologias Utilizadas

- HTML + Tailwind CSS
- JavaScript (ES6+)
- [v0.dev](https://v0.dev) (Interface gerada com IA + ShadCN + React)
- localStorage para persistência de dados
- CSV Parser interno

---

## 📂 Estrutura de Dados (CSV Importável)

```csv
nome,nota,categoria
One Piece,9,Assistindo
Death Note,10,Assistido
Mob Psycho 100,,Lista de Desejos
Boruto,,Não Interessado

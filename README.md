# 🌸 Nanalog

> Organizador de projetos pessoais com visual floral/cozy — evite abandonar seus projetos e retome de onde parou.

![versão](https://img.shields.io/github/v/release/yannevic/nanalog?label=versão&color=f2a7bc)
![plataforma](https://img.shields.io/badge/plataforma-Windows-fce8ef?logo=windows)
![licença](https://img.shields.io/badge/licença-privado-e07a9a)

---

## ✨ Funcionalidades

- 🗂️ **Dashboard com cards** — veja todos os projetos de uma vez, com status, progresso e onde parou
- ➕ **Criar e editar projetos** — nome, versão, status e anotação de onde parou
- ✅ **Sistema de fases e tarefas** — organize o projeto em fases, com tasks por fase e progresso automático
- 📝 **Commits organizados** — registre o histórico real de mudanças com emoji de tipo (✨ 🐛 🔧 📝 🚀)
- 📄 **Briefing em markdown** — escreva a descrição completa do projeto com renderização rica
- 🗒️ **Notas livres** — campo de anotações gerais na aba de visão geral
- 🔀 **Reordenar por drag-and-drop** — arraste os cards pra organizar como quiser
- 🔍 **Filtrar por status** — clique nos contadores da barra superior pra filtrar projetos
- 💾 **Backup automático** — ao abrir o app, o banco é copiado automaticamente (últimas 3 aberturas salvas em `%APPDATA%\nanalog`)
- 🔄 **Atualização automática** — o app verifica e instala atualizações sozinho via GitHub Releases

---

## 📥 Download

Acesse a página de [Releases](https://github.com/yannevic/nanalog/releases/latest) e baixe o instalador `.exe` mais recente.

> ⚠️ O Windows pode exibir um aviso de segurança na primeira instalação. Clique em **"Mais informações"** → **"Executar mesmo assim"** para continuar.

---

## 💾 Seus dados

- Todos os dados ficam salvos **100% localmente** no seu computador, em `%APPDATA%\nanalog\nanalog.db`
- Nada é enviado para servidores externos
- A cada abertura do app, um backup é criado automaticamente — os últimos 3 ficam salvos como `nanalog.bak1.db`, `nanalog.bak2.db` e `nanalog.bak3.db` na mesma pasta
- Se algo der errado, é só renomear um dos arquivos `.bak1.db` para `nanalog.db` e seus projetos voltam

---

## 🔒 Segurança

- Dados armazenados **100% localmente** — nenhuma conexão com servidores externos
- Comunicação interna do Electron isolada e validada (`contextIsolation`, `nodeIntegration: false`)
- Queries SQL com parâmetros nomeados — sem risco de SQL injection
- Atualização automática com verificação de hash **SHA512**

---

## 🌸 Sobre o projeto

O Nanalog nasceu de uma necessidade real: parar de abandonar projetos e conseguir retomar de onde parou sem aquela sensação de "o que eu tava fazendo mesmo?". Feito do zero com muito carinho e florzinhas 🌸.

É gratuito. Se quiser apoiar:

- ☕ [Ko-fi — ko-fi.com/nanafofa](https://ko-fi.com/nanafofa)

---

## 🛠️ Tecnologias

| Tecnologia     | Versão |
| -------------- | ------ |
| Electron       | 35     |
| React          | 19     |
| TypeScript     | 5      |
| Tailwind CSS   | 4      |
| better-sqlite3 | 11     |
| Vite           | 6      |

---

## 📬 Contato

Dúvidas, sugestões ou só quer dizer oi:
**devnanalol@gmail.com**

---

<p align="center">Made with 🌸 by Nana</p>

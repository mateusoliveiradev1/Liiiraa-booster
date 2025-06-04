# 🚀 Liiiraa Booster

**Liiiraa Booster** é um aplicativo de otimização total para Windows, construído com **Electron + Vite** para entregar performance nativa, visual moderno e automações profundas no sistema operacional.

Ideal para gamers, streamers, técnicos e entusiastas que desejam total controle, alta performance e privacidade.

---

## 🧰 Stack Tecnológica

- ⚙️ **Electron** — container desktop com acesso ao sistema
- ⚡ **Vite** — frontend ultra-rápido com HMR
- 🎨 **Tailwind CSS** — design responsivo e fluido
- 🔌 **Node.js + IPC** — execução de scripts com segurança
- 🛠️ **PowerShell / .bat / Python** — otimizações reais de sistema
- 📦 **electron-builder** — build multiplataforma `.exe` / `.dmg` / `.AppImage`

---

## 🖥️ Funcionalidades Principais

- Dashboard moderno com métricas: CPU, GPU, RAM, Disco, Rede
- Detecção de hardware e aplicação de tweaks compatíveis
- Criação de plano de energia personalizado:
  > `Liiiraa Booster - Max Performance and Low Latency`
- Otimizações específicas para:
  - AMD, Intel, NVIDIA
  - Jogos: CS2, Valorant, Warzone, Fortnite, PUBG
- Debloat total do Windows
- Limpador de sistema e navegadores
- Modo Game Booster, RAM Flush e tweaks dinâmicos
- Modo Avançado com tweaks perigosos (UAC, Defender, Update)
- Reversão segura e logs automáticos
- Painel com histórico de boot e plugins

---

## 📁 Estrutura do Projeto

```text
project-root/
├── frontend/           # interface feita com Vite e Tailwind
│   ├── index.html
│   └── src/
├── backend/            # processos principais do Electron
│   └── main.js
└── scripts/            # scripts de otimização
    ├── optimize.ps1
    ├── clean.bat
    └── metrics.py
```

## 🚀 Como Começar

1. Instale o [Node.js](https://nodejs.org/) (v18 ou superior recomendado).
2. Clone este repositório e acesse a pasta do projeto.
3. Rode `npm install` para baixar as dependências.
4. Para desenvolvimento execute `npm run dev`, que inicia o Vite e o Electron simultaneamente com recarregamento automático.


## 📦 Builds e Distribuição

1. Gere os arquivos otimizados do frontend com `npm run build`.
2. Execute `npm run dist` para criar os instaladores usando **electron-builder**:
   - Windows: `.exe`
   - macOS: `.dmg`
   - Linux: `.AppImage`

## 🐍 Requisitos de Python

Para executar o script `metrics.py` você precisa ter **Python 3** instalado. Após
instalar o Python rode:

```bash
pip install psutil
```

Esses scripts são chamados pelo Electron através do canal IPC `run-script`.

## 📝 Scripts e IPC

Esta pasta contém três scripts principais que podem ser executados a partir do
Electron via canal `run-script`:

- **optimize.ps1** — otimizações de performance no Windows usando PowerShell.
- **clean.bat** — limpeza rápida de arquivos temporários por meio de um script
  batch.
- **metrics.py** — coleta de métricas básicas do sistema com Python e
  [psutil](https://pypi.org/project/psutil/).

No `src/main/index.js` existe um `ipcMain.handle('run-script')` que possui uma
lista de comandos permitidos. Basta enviar o nome do script pela camada de
renderer (via `window.api.runScript('optimize')`, por exemplo) para que o
Electron execute o comando correspondente em segurança.


---

## 📂 Git e Builds

Os artefatos gerados nas pastas `dist/` e `build/` não são versionados. Estes diretórios estão listados no arquivo `.gitignore` para evitar que arquivos de build sejam enviados ao repositório. Além disso, o diretório `node_modules/` e qualquer arquivo `*.log` são automaticamente ignorados para manter o repositório limpo.

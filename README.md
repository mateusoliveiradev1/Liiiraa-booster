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
- Otimização automática de CPU/GPU baseada no fabricante
- Criação de plano de energia personalizado:
  > `Liiiraa Booster - Max Performance and Low Latency`
- Otimizações específicas para:
  - AMD, Intel, NVIDIA
  - Jogos: CS2, Valorant, Warzone, Fortnite, PUBG
- Debloat total do Windows
- Limpador de sistema e navegadores
- Modo Game Booster, RAM Flush e tweaks dinâmicos
- Modo Avançado com tweaks perigosos (UAC, Defender, Update, Memory Compression, mitigações de hardware e Core Isolation)
- Reversão segura e logs automáticos
- Painel com histórico de boot e plugins

---

## 📁 Estrutura do Projeto

```text
project-root/
├── src/
│   ├── renderer/        # interface feita com Vite e Tailwind
│   │   ├── index.html
│   │   └── main.jsx
│   └── main/           # processos principais do Electron
│       ├── index.js
│       └── preload.js
└── scripts/            # scripts de otimização
    ├── optimize.ps1
    ├── clean.bat
    └── metrics.py
```

## 🚀 Como Começar

1. Instale o [Node.js](https://nodejs.org/) (v18 ou superior recomendado).
2. Clone este repositório e acesse a pasta do projeto.
3. Rode `npm install` para baixar as dependências.
4. Para desenvolvimento execute `npm run dev`, que usa **concurrently** e **cross-env** para rodar `vite` e `electron .` com `NODE_ENV=development` e recarregamento automático.


## 📦 Builds e Distribuição

1. Gere os arquivos otimizados do renderer com `npm run build`.
2. Execute `npm run dist` para criar os instaladores usando **electron-builder**:
   - Windows: `.exe`
   - macOS: `.dmg`
   - Linux: `.AppImage`

## 🧪 Testes

1. Execute `npm install` para instalar todas as dependências do projeto.
   Em ambientes de CI, prefira `npm ci` para garantir versões exatas.
2. Depois rode `npm test` para iniciar a suíte de testes.

## 🐍 Requisitos de Python


Para executar o script `metrics.py` você precisa ter **Python 3** instalado. Em seguida, instale as dependências de métricas com:

```bash
pip install -r requirements.txt
```

O pacote `pynvml` é opcional e habilita a coleta de métricas de GPU caso haja
uma placa NVIDIA disponível.

Esses scripts são chamados pelo Electron através do canal IPC `run-script`.

## 📝 Scripts e IPC

Esta pasta contém quatro scripts principais que podem ser executados a partir do
Electron via canal `run-script`:

- **optimize.ps1** — otimizações de performance no Windows usando PowerShell.
- **advanced.ps1** — desativa UAC, Defender, Windows Update, Memory Compression, políticas de mitigação e Core Isolation (use `-Restore` para reverter).
- **hardware-optimize.ps1** — detecta CPU/GPU e chama os scripts adequados.
- **clean.bat** — limpeza rápida de arquivos temporários por meio de um script
  batch.
- **metrics.py** — coleta de métricas básicas do sistema com Python e
  [psutil](https://pypi.org/project/psutil/).

> ⚠️ **Atenção**: estes scripts precisam ser executados com privilégios de
> **Administrador**. Eles modificam configurações do Windows e podem afetar a
> estabilidade do sistema. O `optimize.ps1` e o `advanced.ps1` realizam um backup do registro antes
> de aplicar tweaks e podem ser executados com `-Restore` para desfazer as
> alterações. Sempre tenha um ponto de restauração ou backup antes de prosseguir.

No `src/main/index.js` existe um `ipcMain.handle('run-script')` que possui uma
lista de comandos permitidos. Basta enviar o nome do script pela camada de
renderer (via `window.api.runScript('auto-optimize')`, por exemplo) para que o
Electron execute o comando correspondente em segurança.


---

## 📂 Git e Builds

Os artefatos gerados nas pastas `dist/` e `build/` não são versionados. Estes diretórios estão listados no arquivo `.gitignore` para evitar que arquivos de build sejam enviados ao repositório. Além disso, o diretório `node_modules/` e qualquer arquivo `*.log` são automaticamente ignorados para manter o repositório limpo.

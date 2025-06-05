# 🚀 Liiiraa Booster
[English](README.en.md) | [Português](README.md)

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
- Ajustes de rede TCP para reduzir latência e Throttling de energia desativado
- Criação de plano de energia personalizado:
  > `Liiiraa Booster - Max Performance and Low Latêncy`
- Aba **Energy** para monitorar consumo e aplicar planos de energia
- Otimizações específicas para:
  - AMD, Intel, NVIDIA
  - Jogos: CS2, Valorant, Warzone, Fortnite, PUBG
- Debloat completo ou leve do Windows com lista expandida de apps
  (Zune, News, Solitaire, YourPhone, GetHelp, Xbox, People, Skype).
  Use `-Restore` para reinstalar caso necessário
- Desativa o recurso opcional **XPS Viewer** por padrão
- Desativa o serviço **Windows Search** (WSearch) para reduzir uso de disco
- Limpador de sistema e navegadores
- Modo Game Booster, RAM Flush e tweaks dinâmicos
- Modo Avançado com tweaks perigosos (UAC, Defender, Update, Memory Compression, mitigações de hardware e Core Isolation)
- Reversão segura e logs automáticos
- Botão **Create Restore Point** para criar pontos de restauração
- Painel com histórico de boot e plugins
- Scripts de jogos evitam linhas duplicadas verificando as configurações antes de escrever
- O visualizador de logs exibe apenas as últimas 500 linhas de cada arquivo

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

> O instalador exibirá um diálogo com os termos definidos em `installer-license.txt`.

## 🧪 Testes

Antes de rodar a suíte de testes é **obrigatório** instalar todas as dependências:

1. Execute `npm install` para baixar tudo que o projeto necessita. Em ambientes
   de CI prefira `npm ci` para garantir versões exatas.
2. Em seguida rode `npm test` para iniciar a suíte de testes.

> **Importante**: `npm test` falhará caso o diretório `node_modules/` não exista.
> Certifique-se de executar `npm install` ao menos uma vez antes de qualquer
> execução de testes.

## 🐍 Requisitos de Python


Para executar o script `metrics.py` você precisa ter **Python 3** instalado. Em seguida, instale as dependências de métricas com:

```bash
pip install -r requirements.txt
```

O pacote `pynvml` é opcional e habilita a coleta de métricas de GPU caso haja
uma placa NVIDIA disponível.

Defina `METRICS_LOG=1` para gravar logs em `logs/metrics.log`. Caso a variável
não esteja presente, o `metrics.py` descarta as mensagens utilizando
`logging.NullHandler()`.

Esses scripts são chamados pelo Electron através do canal IPC `run-script`.

## 📝 Scripts e IPC

Esta pasta contém quatro scripts principais que podem ser executados a partir do
Electron via canal `run-script`:

- **optimize.ps1** — otimizações de performance no Windows (desativa serviços como Windows Search).
- **advanced.ps1** — tweaks avançados como desativar UAC, Defender, Windows Update, Memory Compression, políticas de mitigação, Core Isolation, Telemetry e SmartScreen. Use as flags `-DisableUAC`, `-DisableDefender`, `-DisableUpdate`, `-DisableMemoryCompression`, `-DisableMitigations`, `-DisableHVCI`, `-DisableTelemetry` e `-DisableSmartScreen`; combine com `-Restore` para reverter.
- **optimize.ps1** — otimizações de performance no Windows (desativa serviços como Windows Search) usando PowerShell.
- **advanced.ps1** — desativa UAC, Defender, Windows Update, Memory Compression, políticas de mitigação, Core Isolation, Telemetry e SmartScreen. Agora aceita `-DisableUAC`, `-DisableDefender`, `-DisableUpdate`, `-DisableMemoryCompression`, `-DisableMitigations`, `-DisableHVCI`, `-DisableTelemetry` e `-DisableSmartScreen` (use `-Restore` com os mesmos parâmetros para reverter).
- **hardware-optimize.ps1** — detecta CPU/GPU e chama os scripts adequados.
  - **cpu-amd.ps1** / **cpu-intel.ps1** — otimizações específicas para cada fabricante, incluindo a desativação do Power Throttling (use `-Restore` para desfazer).
  - **gpu-nvidia.ps1** — otimizações para placas NVIDIA (botão *Optimize Nvidia GPU* em **GPU**). Use `-MaxPower` e `-LockMaxClock` para máximo desempenho; `-Restore` reverte.
  - **gpu-amd.ps1** — otimizações para placas AMD (use `-Restore` para desfazer).
  - **gpu-intel.ps1** — otimizações para GPUs Intel.
- **clean.bat** — limpeza rápida de arquivos temporários e caches do sistema, registrando o espaço liberado. O cálculo agora usa PowerShell para funcionar em qualquer idioma do Windows.
- **metrics.py** — coleta de métricas básicas do sistema com Python e [psutil](https://pypi.org/project/psutil/).
- **energy-plan.ps1** — aplica o plano de energia do Liiiraa Booster.
- **peripheral-energy.ps1** — ajusta energia de periféricos USB.
- **gamebooster.ps1** — tweaks temporários para jogos.
- **gamebooster-restore.ps1** — restaura serviços e o Game Bar após usar o Game Booster.
- **restore-point.ps1** — cria um ponto de restauração do sistema.


> ⚠️ **Atenção**: estes scripts precisam ser executados com privilégios de
> **Administrador**. Eles modificam configurações do Windows e podem afetar a
> estabilidade do sistema. O `optimize.ps1` e o `advanced.ps1` realizam um backup do registro antes
> de aplicar tweaks e podem ser executados com `-Restore` para desfazer as
> alterações (inclusive os scripts de CPU e GPU). Sempre tenha um ponto de restauração ou backup antes de prosseguir.

> ⚠️ **Atenção**: estes scripts exigem privilégios de **Administrador** e podem
> alterar profundamente o sistema. O `optimize.ps1`, `advanced.ps1` e também o
> `debloat.ps1` fazem backup do registro ou registram os apps removidos.
> Caso algo saia errado, execute-os com `-Restore` para reverter ou reinstalar
> os aplicativos removidos. Remover apps essenciais pode causar problemas, tenha
> sempre um ponto de restauração ou backup antes de prosseguir.


No `src/main/index.js` existe um `ipcMain.handle('run-script')` que possui uma
lista de comandos permitidos. Basta enviar o nome do script pela camada de
renderer (via `window.api.runScript('auto-optimize')`, por exemplo) para que o
Electron execute o comando correspondente em segurança.


---

## 📂 Git e Builds

Os artefatos gerados nas pastas `dist/` e `build/` não são versionados. Estes diretórios estão listados no arquivo `.gitignore` para evitar que arquivos de build sejam enviados ao repositório. Além disso, o diretório `node_modules/` e qualquer arquivo `*.log` são automaticamente ignorados para manter o repositório limpo.

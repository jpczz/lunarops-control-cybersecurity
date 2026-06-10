# LunarOps Control - Cybersecurity

Projeto desenvolvido para a Global Solution da FIAP, com foco na integração de práticas de DevSecOps em uma solução baseada no ecossistema espacial.

## Objetivo

O LunarOps Control é uma plataforma simulada para monitoramento seguro de operações logísticas em infraestrutura lunar, recebendo dados de telemetria, processando riscos operacionais e gerando alertas.

## Descrição do projeto

O LunarOps Control é uma solução de software criada para o contexto da Global Solution Space Connect, com foco no monitoramento seguro de operações logísticas em ambientes espaciais extremos, especialmente em uma infraestrutura lunar simulada.

A proposta do sistema é receber dados de telemetria de módulos, sensores e equipamentos autônomos, processar informações críticas e gerar alertas operacionais para apoiar decisões relacionadas a transporte de suprimentos, energia, comunicação, oxigênio, água e segurança da missão.

Por se tratar de uma solução baseada em dados sensíveis, APIs, automação e infraestrutura crítica, o projeto incorpora práticas de DevSecOps desde o início do ciclo de desenvolvimento. O objetivo é garantir que o software seja desenvolvido, testado, analisado e implantado com controles de segurança automatizados, reduzindo riscos como vazamento de segredos, uso de dependências vulneráveis, imagens de contêiner inseguras, permissões excessivas e falta de rastreabilidade.

## Conexão com Cybersecurity

O projeto incorpora práticas de DevSecOps para reduzir riscos no ciclo de vida do software, incluindo:

- gestão segura de segredos;
- análise de dependências;
- testes automatizados;
- scan de contêiner;
- pipeline CI/CD com controles de segurança;
- simulação de falha controlada.

## Tecnologias utilizadas

- Node.js
- Express
- Dotenv
- Helmet
- Morgan
- Jest
- Supertest
- Docker
- GitHub Actions
- npm audit
- Trivy

## Estrutura do projeto

```text
lunarops-control-cybersecurity/
├── README.md
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .gitignore
├── .env.example
├── src/
│   ├── app.js
│   └── server.js
├── tests/
│   └── security.test.js
├── docs/
│   ├── cybersecurity-lunarops-control.pdf
│   ├── pipeline-devsecops.md
│   ├── simulacao-pipeline.md
│   └── evidencias/
└── .github/
    └── workflows/
        └── security-pipeline.yml
```

## Requisitos funcionais

| Código | Requisito |
|---|---|
| RF01 | A API deve disponibilizar uma rota de status da missão. |
| RF02 | A API deve receber dados simulados de telemetria. |
| RF03 | A API deve gerar um alerta quando algum dado ultrapassar limite crítico. |
| RF04 | A API deve proteger rotas sensíveis com uma chave de API. |
| RF05 | A API deve registrar eventos relevantes em logs simples. |

## Requisitos de segurança

| Código | Requisito |
|---|---|
| RS01 | Segredos não podem ser versionados no GitHub. |
| RS02 | A chave de API deve ser lida por variável de ambiente. |
| RS03 | O pipeline deve executar checagem automatizada de segurança. |
| RS04 | O projeto deve conter arquivo `.env.example`, mas nunca `.env` real. |
| RS05 | O Dockerfile deve ser analisado por scan de vulnerabilidade. |
| RS06 | Dependências devem ser verificadas no pipeline. |
| RS07 | O pipeline deve falhar caso encontre problema grave configurado na simulação. |

## Configuração local

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/lunarops-control-cybersecurity.git
cd lunarops-control-cybersecurity
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
PORT=3000
API_KEY=lunarops-secret-key
NODE_ENV=development
```

Execute a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

Ou execute em modo padrão:

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

## Rotas da API

### Rota pública de saúde

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "lunarops-control",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

### Informações iniciais da API

```http
GET /
```

Resposta esperada:

```json
{
  "message": "LunarOps Control API",
  "description": "Secure API for simulated lunar logistics and telemetry operations."
}
```

### Status da missão

Rota protegida por API Key:

```http
GET /mission/status
```

Header necessário:

```http
x-api-key: lunarops-secret-key
```

Resposta esperada:

```json
{
  "mission": "LunarOps Control",
  "environment": "Simulated Lunar Infrastructure",
  "status": "operational",
  "lastTelemetry": null,
  "alerts": []
}
```

### Envio de telemetria

Rota protegida por API Key:

```http
POST /telemetry
```

Header necessário:

```http
x-api-key: lunarops-secret-key
Content-Type: application/json
```

Exemplo de body normal:

```json
{
  "moduleId": "HAB-01",
  "oxygenLevel": 21,
  "batteryLevel": 78,
  "temperature": 22,
  "radiationLevel": 0.8
}
```

Exemplo de body crítico:

```json
{
  "moduleId": "HAB-02",
  "oxygenLevel": 17.8,
  "batteryLevel": 12,
  "temperature": -145,
  "radiationLevel": 3.1
}
```

### Consulta de alertas

Rota protegida por API Key:

```http
GET /alerts
```

Header necessário:

```http
x-api-key: lunarops-secret-key
```

## Teste manual com PowerShell

Exemplo de envio de telemetria crítica usando `Invoke-RestMethod`:

```powershell
$body = @{
  moduleId = "HAB-02"
  oxygenLevel = 17.8
  batteryLevel = 12
  temperature = -145
  radiationLevel = 3.1
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/telemetry" `
  -Method POST `
  -Headers @{
    "x-api-key" = "lunarops-secret-key"
  } `
  -ContentType "application/json" `
  -Body $body
```

Consulta dos alertas:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/alerts" `
  -Headers @{
    "x-api-key" = "lunarops-secret-key"
  }
```

Teste da rota protegida:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/mission/status" `
  -Headers @{
    "x-api-key" = "lunarops-secret-key"
  }
```

## Testes automatizados

O projeto possui testes automatizados com Jest e Supertest para validar o funcionamento da API e controles básicos de segurança.

Os testes cobrem:

- status da API;
- bloqueio de rotas protegidas sem API Key;
- bloqueio com API Key inválida;
- liberação com API Key válida;
- validação de payload de telemetria;
- geração de alertas críticos;
- proteção da rota de alertas.

Para executar:

```bash
npm test
```

Resultado esperado:

```text
PASS tests/security.test.js
Test Suites: 1 passed, 1 total
Tests: 9 passed, 9 total
```

## Auditoria de dependências

O projeto possui um script para auditoria de vulnerabilidades em dependências:

```bash
npm run security:audit
```

Esse comando executa:

```bash
npm audit --audit-level=high
```

Caso sejam encontradas vulnerabilidades de nível alto ou crítico, o comando falha e indica que o projeto precisa de correção antes da entrega.

## Execução com Docker

A aplicação pode ser empacotada e executada em um contêiner Docker.

### Build da imagem

```bash
docker build -t lunarops-control:1.0 .
```

### Listar imagens

```bash
docker images
```

### Executar o container

```bash
docker run --rm -p 3000:3000 -e API_KEY=lunarops-secret-key lunarops-control:1.0
```

Caso a porta 3000 esteja ocupada, use:

```bash
docker run --rm -p 3001:3000 -e API_KEY=lunarops-secret-key lunarops-control:1.0
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

ou, no segundo caso:

```text
http://localhost:3001
```

### Testar a API no container

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/health"
```

Rota protegida:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3001/mission/status" `
  -Headers @{
    "x-api-key" = "lunarops-secret-key"
  }
```

## Segurança no Docker

O projeto utiliza boas práticas básicas de segurança em contêineres:

- imagem base reduzida com `node:20-alpine`;
- instalação apenas de dependências de produção;
- cópia apenas dos arquivos necessários;
- uso de `.dockerignore` para evitar envio de arquivos sensíveis;
- exclusão do arquivo `.env` da imagem;
- execução da aplicação com usuário não-root;
- passagem da API Key por variável de ambiente em tempo de execução.

Essas práticas reduzem a superfície de ataque da imagem e evitam que segredos sejam gravados diretamente no contêiner.

## Pipeline DevSecOps

O projeto possui um pipeline DevSecOps configurado com GitHub Actions no arquivo:

```text
.github/workflows/security-pipeline.yml
```

O pipeline é executado automaticamente em eventos de `push`, `pull_request` e também manualmente por `workflow_dispatch`.

### Etapas do pipeline

```text
Checkout do código
   ↓
Setup do Node.js
   ↓
Instalação de dependências com npm ci
   ↓
Execução dos testes automatizados
   ↓
Auditoria de dependências com npm audit
   ↓
Build da imagem Docker
   ↓
Smoke test da API rodando em container
   ↓
Scan da imagem Docker com Trivy
```

### Controles aplicados

O pipeline aplica os seguintes controles de segurança:

- testes automatizados;
- auditoria de dependências;
- gestão segura de segredos com GitHub Secrets;
- build controlado da imagem Docker;
- validação funcional do container;
- scan de vulnerabilidades com Trivy.

### Secret necessário

Para o pipeline funcionar corretamente, é necessário configurar no GitHub Actions o seguinte secret:

```text
API_KEY=lunarops-secret-key
```

Esse secret é usado durante o smoke test para validar a rota protegida `/mission/status`.

## Simulação de falha controlada

O workflow permite executar uma simulação manual de falha por meio do parâmetro:

```text
simulate_failure
```

Quando executado com:

```text
simulate_failure = true
```

o pipeline utiliza uma API Key inválida durante o smoke test da rota protegida `/mission/status`.

Com isso, a API retorna erro `401 Unauthorized`, o comando `curl --fail` falha e o GitHub Actions bloqueia o pipeline.

Essa simulação demonstra o comportamento esperado de um controle DevSecOps: detectar automaticamente uma falha de autenticação antes que uma entrega seja considerada válida.

Para executar a simulação:

```text
Actions
→ DevSecOps Security Pipeline
→ Run workflow
→ simulate_failure = true
```

Para executar o pipeline corrigido:

```text
Actions
→ DevSecOps Security Pipeline
→ Run workflow
→ simulate_failure = false
```

## Documentação

A documentação técnica do projeto está localizada em:

```text
docs/
```

Arquivos principais:

```text
docs/cybersecurity-lunarops-control.pdf
docs/pipeline-devsecops.md
docs/simulacao-pipeline.md
```

O PDF técnico contém:

- conexão com o projeto da Global Solution;
- mapeamento de riscos;
- controles de segurança aplicados;
- diagrama do pipeline;
- evidências da implementação prática;
- descrição da simulação;
- conexão com ODS;
- conclusão.

## Evidências

As evidências de execução dos testes, scans e simulações do pipeline estão armazenadas na pasta:

```text
docs/evidencias/
```

Evidências esperadas:

```text
docs/evidencias/evidencia-testes-automatizados.png
docs/evidencias/evidencia-docker-build.png
docs/evidencias/evidencia-docker-images.png
docs/evidencias/evidencia-docker-run.png
docs/evidencias/evidencia-api-docker.png
docs/evidencias/evidencia-github-actions-pipeline.png
docs/evidencias/evidencia-github-actions-tests.png
docs/evidencias/evidencia-github-actions-npm-audit.png
docs/evidencias/evidencia-github-actions-docker-build.png
docs/evidencias/evidencia-github-actions-trivy.png
docs/evidencias/evidencia-simulacao-falha-smoke-test.png
docs/evidencias/evidencia-simulacao-correcao-smoke-test.png
```

## Como validar a entrega

Para validar localmente:

```bash
npm install
npm test
npm run security:audit
docker build -t lunarops-control:1.0 .
```

Para executar em Docker:

```bash
docker run --rm -p 3001:3000 -e API_KEY=lunarops-secret-key lunarops-control:1.0
```

Depois testar:

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/health"
```

E:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3001/mission/status" `
  -Headers @{
    "x-api-key" = "lunarops-secret-key"
  }
```

Para validar no GitHub:

```text
Repositório
→ Actions
→ DevSecOps Security Pipeline
```

A execução final normal deve estar aprovada com `simulate_failure = false`.

## Critérios atendidos

| Critério | Como foi atendido |
|---|---|
| Mapeamento de Riscos | Tabela de riscos no PDF técnico, com impacto, controle e tema relacionado. |
| Controles de Segurança | Testes, npm audit, GitHub Secrets, Docker seguro, smoke test e Trivy. |
| Implementação Prática | Pipeline DevSecOps funcional no GitHub Actions. |
| Simulação do Pipeline | Simulação controlada com API Key inválida e bloqueio do pipeline. |
| Organização e Clareza | README, documentação, evidências e PDF técnico organizados no repositório. |

## Status

Projeto finalizado para entrega da disciplina de Cybersecurity.
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
├── .gitignore
├── .env.example
├── src/
│   ├── app.js
│   └── server.js
├── tests/
│   └── security.test.js
├── docs/
│   └── evidencias/
└── .github/
    └── workflows/
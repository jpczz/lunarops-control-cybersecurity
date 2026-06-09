# Pipeline DevSecOps - LunarOps Control

## Objetivo

Este documento descreve o pipeline DevSecOps do projeto LunarOps Control, desenvolvido para a Global Solution da FIAP com foco em Cybersecurity.

O pipeline tem como objetivo automatizar verificações de qualidade e segurança durante o ciclo de desenvolvimento, reduzindo riscos antes da implantação da aplicação.

## Fluxo do pipeline

```text
Desenvolvedor
   ↓
GitHub Repository
   ↓
GitHub Actions
   ↓
Instalação de dependências
   ↓
Testes automatizados
   ↓
Auditoria de dependências com npm audit
   ↓
Build da imagem Docker
   ↓
Smoke test da API em container
   ↓
Scan da imagem Docker com Trivy
   ↓
Pipeline aprovado ou bloqueado
```

## Controles de segurança aplicados

### 1. Testes automatizados

O pipeline executa testes com Jest e Supertest para validar o funcionamento da API e seus controles básicos de segurança.

Os testes verificam:

- disponibilidade da API;
- bloqueio de rotas protegidas sem API Key;
- rejeição de API Key inválida;
- aceitação de API Key válida;
- validação de payload de telemetria;
- geração de alertas críticos.

### 2. Auditoria de dependências

O comando `npm audit --audit-level=high` verifica se o projeto possui dependências com vulnerabilidades conhecidas de nível alto ou crítico.

Caso uma vulnerabilidade relevante seja encontrada, o pipeline é interrompido.

### 3. Gestão de segredos

A chave da API não é escrita diretamente no código ou no arquivo YAML do pipeline.

Ela é configurada no GitHub Actions por meio do secret `API_KEY`.

### 4. Segurança em contêineres

O pipeline cria uma imagem Docker da aplicação e executa um scan com Trivy para identificar vulnerabilidades críticas.

A imagem Docker também segue boas práticas, como:

- uso de imagem base reduzida;
- instalação apenas de dependências de produção;
- execução com usuário não-root;
- exclusão do arquivo `.env` por meio do `.dockerignore`.

### 5. Smoke test do container

Após o build da imagem Docker, o pipeline executa o container e valida as rotas `/health` e `/mission/status`.

Isso confirma que a aplicação está funcional dentro do ambiente containerizado.

## Resultado esperado

O pipeline deve ser aprovado quando:

- as dependências forem instaladas corretamente;
- todos os testes automatizados passarem;
- o `npm audit` não encontrar vulnerabilidades altas ou críticas;
- a imagem Docker for construída com sucesso;
- a API responder corretamente dentro do container;
- o Trivy não encontrar vulnerabilidades críticas na imagem.

## Relação com DevSecOps

O pipeline integra segurança desde as primeiras etapas do desenvolvimento, permitindo que falhas sejam detectadas automaticamente antes da entrega ou implantação.

Essa abordagem reduz riscos como:

- envio de código quebrado;
- dependências vulneráveis;
- imagem Docker insegura;
- exposição de segredos;
- ausência de validação automatizada.
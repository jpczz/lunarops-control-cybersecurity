# Simulação de Falha no Pipeline DevSecOps

## Cenário simulado

A simulação realizada no pipeline DevSecOps do LunarOps Control representa uma falha de autenticação durante o smoke test da API containerizada.

O pipeline executa a aplicação em um contêiner Docker e valida duas rotas:

- `/health`, rota pública de verificação de disponibilidade;
- `/mission/status`, rota protegida por API Key.

Para simular o problema, o workflow foi executado manualmente com o parâmetro `simulate_failure` definido como `true`. Nessa condição, o pipeline utiliza intencionalmente uma chave inválida no teste da rota protegida.

## Problema

A rota `/mission/status` exige uma API Key válida no header `x-api-key`.

Durante a simulação, o pipeline enviou a seguinte chave inválida:

```text
invalid-key-for-simulation
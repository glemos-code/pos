# Exercicio 03 - Triagem Inteligente de Tickets

## Objetivo

Construir uma API que receba pedidos de suporte em linguagem natural e execute um fluxo:

```text
pergunta -> classificacao por LLM -> validacao -> regra de negocio
         -> abertura/atualizacao/resolucao -> resposta por LLM
```

O desafio usa os mesmos conceitos da aula: Fastify, LangGraph, structured output,
Zod, prompt templates, injecao de dependencias e dois usos distintos do LLM.
Ele nao e apenas uma troca de dominio: voce tambem precisara lidar com dados
incompletos, idempotencia, regras de prioridade, prompt injection e testes sem API real.

## Cenario

Uma equipe de suporte recebe mensagens como:

```text
Sou Ana. O checkout esta fora do ar para todos os clientes desde 09:30.
Abra um ticket: nao conseguimos vender.
```

```text
Adicione ao ticket INC-1001 que o erro retornado e HTTP 503.
```

```text
Resolva o INC-1001. O rollback da versao 4.2 restaurou o checkout.
```

## Requisitos

1. Classifique a intencao como `open`, `add_information`, `resolve` ou `unknown`.
2. Extraia dados usando `RequestAnalysisSchema`; nunca use JSON sem validacao.
3. Se faltarem campos obrigatorios, nao execute a acao. Gere uma pergunta objetiva.
4. Detecte instrucoes suspeitas, como "ignore suas regras", e nao as trate como dados confiaveis.
5. Calcule a prioridade com codigo deterministico; o LLM extrai impacto e urgencia, mas nao decide a prioridade final.
6. Garanta idempotencia na abertura: repetir o mesmo `requestId` nao pode criar dois tickets.
7. Nao permita atualizar ou resolver tickets inexistentes ou ja resolvidos.
8. Gere a resposta final com um segundo uso do LLM e inclua o idioma da mensagem original no contexto.
9. Teste o grafo com um LLM fake. Os testes automatizados nao podem consumir creditos.
10. A API deve devolver estado suficiente para auditoria, mas nunca prompts de sistema ou chaves.

## Regras de prioridade

| Impacto | Urgencia | Prioridade |
|---|---|---|
| `many_users` | `immediate` | `critical` |
| `many_users` | `soon` | `high` |
| `one_user` | `immediate` | `high` |
| qualquer outra combinacao | | `medium` ou `low`, conforme sua justificativa |

Implemente a matriz completa e documente a decisao em um comentario curto no teste.

## Onde estao os desafios

- `src/prompts`: construir contexto claro sem misturar instrucao e dado do usuario.
- `src/graph/nodes/identifyRequestNode.ts`: primeira chamada ao LLM.
- `src/graph/graph.ts`: roteamento condicional e caminho de esclarecimento.
- `src/graph/nodes/*TicketNode.ts`: validacao e execucao deterministica.
- `src/services/ticketService.ts`: regras, estado em memoria e idempotencia.
- `src/graph/nodes/messageGeneratorNode.ts`: segunda chamada ao LLM.
- `tests`: completar os casos marcados e adicionar casos extremos.

## Casos minimos de teste

1. Abertura bem-sucedida.
2. Repeticao do mesmo `requestId`.
3. Campo obrigatorio ausente.
4. Atualizacao de ticket inexistente.
5. Resolucao bem-sucedida.
6. Segunda tentativa de resolucao.
7. Mensagem fora do dominio.
8. Tentativa de prompt injection.
9. Falha do provedor de LLM.
10. Duas requisicoes independentes sem vazamento de estado do grafo.

## Restricoes

- Nao use `any`.
- Nao coloque regra de negocio dentro dos prompts.
- Nao deixe o LLM criar IDs, decidir se um ticket existe ou alterar o status diretamente.
- Nao use banco de dados nesta versao; explique por que a memoria do processo nao e persistencia.
- Nao use `try/catch` para transformar falha em falso sucesso.

## Criterios de conclusao

- `npm run typecheck` passa.
- `npm test` passa sem rede e sem `.env`.
- Cada no possui uma responsabilidade clara.
- O fluxo faz exatamente duas chamadas ao LLM no caminho de sucesso.
- Os caminhos de erro nao alteram tickets.
- Voce consegue explicar quais dados sao probabilisticos e quais decisoes sao deterministicas.

## Dificuldade extra

Depois de concluir o nucleo, implemente apenas uma destas opcoes:

1. **Concorrencia:** duas aberturas simultaneas com o mesmo `requestId` criam um unico ticket.
2. **Human-in-the-loop:** tickets `critical` exigem aprovacao antes da resolucao.
3. **Observabilidade:** registre duracao por no, numero de chamadas ao LLM e resultado, sem registrar dados sensiveis.

Nao implemente as tres de uma vez. Primeiro prove o fluxo principal.


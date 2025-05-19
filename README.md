## **Sobre o Asset**

Este asset foi projetado para atuar como plataforma de curadoria de Watson Assistants. São realizadas análises sob duas diferentes perspectivas:

- **Qualidade do treinamento de intenções:**
  Verifica-se o entendimento do assistente a respeito das intents nele cadastradas, apontando a precisão média e específica do assistente, além de levantar possíveis causas de erro;

- **Desempenho histórico:**
  Através dos logs de conversas anteriores do assistente com seus clientes, são levantados dados sobre como está seu desempenho, como por exemplo: quantidade de conversas não atendidas (transferidas para atendente humano ou não), volume histórico de conversas, feedback recebido, intenções mais acessadas, entre outros.

## **Arquitetura**

![img](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/assistant-curator-arch-v4.jpg)

O asset está estruturado em três partes:

1. Uma rota que atua como [log webhook](https://cloud.ibm.com/docs/watson-assistant?topic=watson-assistant-webhook-log) recebendo, transformando e armazenando dados dos logs de conversação do assistente;

2. Outra rota, responsável por rodar testes avaliando a compreensão do assistente a respeito dos assuntos (intents/actions) nele cadastrados;

A lógica descrita no tópico **1.**, uma vez vinculada ao assistente, é automaticamente acionada por ele. Uma vez com o log, o webhook realiza as seguintes tarefas:

1. Retira informações consideradas como as mais relevantes para a tarefa de curadoria no **nível do log**:

   - ID do usuário que com quem o assistente estava conversando;
   - ID da conversa a qual este log pertence;
   - ID do log em questão;
   - A mensagem enviada pelo cliente e a hora que esta foi recebida;
   - A resposta dada pelo assistentee a hora que esta foi entregue;
   - O título do _node_ da árvore de diálogo do assistente acionado nesta transação;
   - As intenções compreendidas pelo assistente nessa transação;
   - A confiança que o assistente tem na intenção que escolheu como principal (valor numérico);
   - As entidades compreendidas pelo assistente nessa transação;

2. Agrupa os logs em conversas de acordo com o _session_id_ que este carrega e:

   - Classifica se o meio utilizado na conversa foi telefônico ou por troca de mensagens;
   - Dá a data e hora do início da mesma;
   - Salva a duração todal da mesma (em segundos);
   - Salva, se houver, a nota de feedback que o assistente recebeu do cliente;
   - Analisa e salva se a conversa foi ou não transferida para atendente humano;
   - Classifica se a conversa é relevante com base na existência ou não de certas intents em algum dos logs participantes;
   - Indica se esta conversa é o primeiro contato do cliente com o assistente ou não.

3. Para todas as conversas, armazena também as variáveis de ambiente geradas no decorrer da mesma, classificando o seu tipo de dado (Ex.: "string", "object", "boolean", etc.)

4. Manipulados os logs dessa forma, a lógica finaliza inserindo-os em duas bases de dados:[**COS (Cloud Object Storage)**](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-getting-started-cloud-object-storage) e
   [**Db2**](https://cloud.ibm.com/docs/Db2onCloud?topic=Db2onCloud-getting-started).

A lógica presente na rota do tópico de avaliação de treinamento lista as intents e seus respectivos exemplos através do método [_listIntents()_](https://cloud.ibm.com/apidocs/assistant-v1?code=node#listintents) do Watson Assistant.
Aleatoriamente, ela então seleciona alguns exemplos para serem retirados de determinadas intents, criando novos assistentes treinados com estes exemplos "defasados". Conversando com estes assistentes, são extraídas as precisões gerais de suas respostas. As médias de acertos e erros destes assistentes dão um bom embasamento para determinar o quão "forte" é o entendimento do assistente original a respeito de suas intents.

Através de conexão do [**Db2**](https://cloud.ibm.com/docs/Db2onCloud?topic=Db2onCloud-getting-started) com o [**Cognos Analytics**](https://www.ibm.com/products/cognos-analytics), torna-se possível gerar gráficos das informações armazenadas.

Além dessas visualizações gráficas, o frontend também conta com uma página em que o curador pode buscar mensagens que tenham despertado determinada intent. É dada a opção para que seja atribuída uma nota do quão satisfeito está com a resposta do assistente.

## **Pre-requisitos**

Para continuar com esta documentação, é necessário possuir uma conta na [**IBM Cloud**](https://cloud.ibm.com/).

Também é necessário uma instância do Watson Assistant, com um assistente deployado.

São necessárias intância do [**Db2**](https://cloud.ibm.com/docs/Db2onCloud?topic=Db2onCloud-getting-started). Recomenda-se a realização do deploy de todas elas na própria IBM Cloud, utilizando os scripts de terraform disponíveis neste mesmo repositório.

Para a realização da extração de sentimento das mensagens enviadas pelo cliente, também é necessário instanciar o serviço do [**NLU**](https://cloud.ibm.com/docs/natural-language-understanding?topic=natural-language-understanding-getting-started).

O último serviço a ser instanciado na IBM Cloud é o [**Cognos Analytics**](https://www.ibm.com/products/cognos-analytics), responsável pelos Dashboards a ser construídos e apresentados no front.

Conhecimento de como fazer upload de código no [**Code Engine**](https://www.ibm.com/products/code-engine) da IBM Cloud é recomendado.

Por último, por gentileza certifique-se de que [**Docker**](https://docs.docker.com/get-docker/) (ou alguma solução de containerização correlata) está instalado em sua máquina, uma vez que precisaremos do mesmo para carregar alguns containers e arquivos.

## **Componentes**

Conforme acima, este asset é composto por duas principais partes:

### **Lógica do log Webhook**

Composta de 5 etapas diferentes, a sequência está organizada de forma que o output da primeira seja o input da seguinte e por aí em diante. São elas:

- **create-tables-cf**

  Cria, se necessário, as tabelas que receberão os logs processados na instância do Db2 especificada.

- **process-logs-cf**

  Realiza a extração de informações no nível do log (Etapa 1 descrita no tópico de arquitetura)

- **process-conversations-cf**

  Agrupa os logs no nível da conversa e extraí informações no nível da conversa (Etapas 2 e 3)

- **enrich-cf**

  Consulta o [**NLU**](https://cloud.ibm.com/docs/natural-language-understanding?topic=natural-language-understanding-getting-started) para extrair o sentimento do texto, armazenado sob forma numérica variando entre **-1**, para sentimentos negativos, e **+1**, para sentimentos positivos. Além disso, nesta função é realizada a extração das variáveis de contexto das conversas (Etapa 4)

- **insert-logs-cf**

  A partir dos objetos gerados nas funções anteriores, nesta etapa final é realizada a comunicação com as duas bases de dados: [**COS**](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-getting-started-cloud-object-storage) e [**Db2**](https://cloud.ibm.com/docs/Db2onCloud?topic=Db2onCloud-getting-started). No Cloudant e COS são armazenados os logs a fim de manter backup dos mesmos, no Db2 temos o armazenamento das informações relevantes filtradas e geradas pelas funções (Etapa 5)

### **Interface do curador**

A interface do curador tem as seguintes principais funcionalidades:

- Apresentar graficamente a qualidade do entendimento do assistente (sua precisão de acerto) a respeito das intents nele cadastradas dados os exemplos atuais.

- Permitir busca de logs a partir de data ou intent e apresentá-las para atribuição de nota humana;

- Disponibilizar uma interface para a construção e consulta de dashboards interativos que apresentem o desempenho do assistente no decorrer do tempo.

A interface do curador se comunica com a instância do Db2 através do [**ibm_db**](https://www.npmjs.com/package/ibm_db), pacote para Node que funciona como API da instância de Db2 selecionada.

A comunicação com o a instância do Cognos Analytics é através da link de compartilhamento do dashboard.

## **Realizando o Deploy**

O deploy do assistant curator se dá através de uma imagem Docker que inicializará um servidor express contendo rotas com as lógicas acima descritas, além da interface. Faremos o deploy dessa imagem no [**IBM Code Engine**](https://www.ibm.com/products/code-engine).

Primeiramente, é importante que configuremos corretamente todas as variáveis de ambiente necessárias para que o container acesse os serviços que precisa. O arquivo `.env-example` contém a sintaxe correta para passar os valores às variáveis. Abaixo, se discorrerá mais a respeito de cada uma delas:

### Credenciais do Db2

- **DB2_CONN_STR**

A sintaxe deve serguir a lógica (os nomes seguem o padrão encontrado na aba de credenciais do serviço):

      DATABASE=<database>;HOSTNAME=<hostname>;PORT=<port>;Security=SSL;PROTOCOL=TCPIP;UID=<username>;PWD=<password>;

- **DB2_XSD**

Por padrão, seu valor deve ser: `https://ibm.com/daas/module/1.0/module.xsd`

- **DB2_SCHEMA**

Por padrão, seu valor deve ser: `CURATOR`

- **DB2_DRIVER**

Por padrão, seu valor deve ser: `com.ibm.db2.jcc.DB2Driver`

- **DB2_JDBC**

A sintaxe deve seguir a lógica (os nomes seguem o padrão encontrado na aba de credenciais do serviço):

      jdbc:db2://<hostname>:<port>/<database>:sslConnection=true;

- **DB2_USER**

Na aba de credenciais do serviço, trata-se do `username`.

- **DB2_PASSWORD**

Na aba de credenciais do serviço, trata-se da `password`.

- **DEADLINE**

Esta variável é represente o número de dias que se deseja armazenar os logs na base. Caso não seja especificada, logs não serão deletados.

### Credenciais do COS

- **COS_APIKEY**

Na aba de credenciais do serviço, se trata de `apikey`

- **COS_BUCKET**

Por padrão, seu valor deve ser: `assistant-curator`

- **COS_ENDPOINT**

Na aba de credenciais do serviço, se trata de `endpoint`

- **COS_SERVICE_INSTANCE**

Na aba de credenciais do serviço, se trata de `service_instance`

Podemos visualizar as variáveis e verificar o nome de cada uma delas dentro do [**IBM COS**](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-service-credentials).

### Credenciais do NLU

- **NLU_APIKEY**

  Na aba de credenciais do serviço, se trata da `apikey`.

- **NLU_URL**

  Na aba de credenciais do serviço, se trata da `url`.

- **NLU_LANGUAGE**

  Língua que se deseja utilizar ao acinoar o NLU. O valor deve seguir a sintaxe de duas letras. Portugês, por exemplo, é representado por: `pt`.

- **NLU_VERSION**

  Versão da api do NLU utilizada. Por padrão, `2021-08-01`.

- **IAM_APIKEY**

A IAM API Key é uma chave de autenticação no nível da conta. Ela precisa possuir a permissão `resource-controller.instance.retrieve`. Caso você não tenha uma chave disponível, é possível criar uma nova seguindo os passos abaixo:

1. Acesse o menu **Acess (IAM)** na IBM Cloud.  
   ![Gerenciar](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/APIkey%20-%20cloud.png)

2. Na tela de gerenciamento, clique na aba **Chaves de API**
   ![Chaves de API](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/APIkey%20-%20criando.png)

3. Clique em **Criar** para iniciar o processo de criação de uma nova API Key.
   ![Chaves de API](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/APIkey%20-%20pa%CC%81gina.png)

4. Preencha o nome da sua nova API Key, clique em **Salvar** e pronto! Sua IAM API Key estará disponível.
   ![Chaves de API](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/APIkey%20-%20nome.png)

- **WATSON_ASSISTANT_RESOURCE_ID**

  Por padrão, `7045626d-55e3-4418-be11-683a26dbc1e5`.

- **WATSON_ASSISTANT_LITE_PLAN_ID**

  Por padrão, `bd16e3c8-3da0-11e6-bce3-54ee7514918e`. Trata-se do ID do plano Lite de um Watson Assistant. Essa informação é para filtrar instâncias que digam respeito a essa tier de serviço, por conta de elas não aceitarem chamadas API.

### Uma vez com todas as variáveis de ambiente configuradas...

...basta agora buildar o container utilizando o _Dockerfile_ presente no diretório `curator-interface/backend`.

Lembre-se de que vamos enviar essa imagem para o [IBM Container Registry](https://www.ibm.com/br-pt/products/container-registry?utm_content=SRCWW&p1=Search&p4=43700078893130646&p5=p&gclid=Cj0KCQiAwbitBhDIARIsABfFYIJHhdnwOxHMV2RxDdLY-vkG9Dbrlb0bGxHxjkR_wsViuHoYdchqb8MaApbpEALw_wcB&gclsrc=aw.ds), o repositório de imagens de container da IBM Cloud.

Assim sendo, precisamos que a imagem siga a sintaxe `<região>.icr.io/<namespace>/<imagem>`. Substitua `<região>` pela sigla da região escolhida e `<namespace>` pelo nome que deu ao seu namespace. Chamaremos a imagem de `assistant-curator`. Seguiremos considerando que a região escolhida foi `us`.
Junto a isso se faz necessário fazer login na ibmcloud CLI e logar com a ferramenta de containerização.

```
    docker build -t us.icr.io/<namespace>/assistant-curator .
```

```
   ibmcloud login --sso
```

```
   ibmcloud plugin install container-registry -r 'IBM Cloud'
```

```
   ibmcloud cr login
```

```
    docker push us.icr.io/<namespace>/assistant-curator
```

#### **Observação para usuários de Mac com chip M1 ou M2:**

Devido à arquitetura **ARM** desses chips, será necessário especificar a plataforma `linux/amd64` ao realizar o build da imagem. Para isso, adicione a flag `--platform linux/amd64` no comando, como demonstrado abaixo:

```
    docker build --platform linux/amd64 -t us.icr.io/<namespace>/assistant-curator .
```

### Criando uma Application no Code Engine...

A partir da imagem docker salva, podemos criar uma [Application](https://cloud.ibm.com/docs/codeengine?topic=codeengine-application-workloads).

Primeiramente, vamos acessar o Code Engine:

![Code Engine 1](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/codeengine1.png)

Criaremos um projeto:

![Code Engine 2](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/codeengine2.png)

![Code Engine 3](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/codeengine3.png)

Criaremos uma application dentro desse projeto:

![Code Engine 4](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/codeengine4.png)

Apontaremos essa application para a imagem container que acabamos de enviar para o Container Registry:

![Code Engine 5](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/codeengine5.png)

Precisarmos configurar um acesso para esse namespace. O Code engine chama isso de "Registry secret". Basta passar como senha uma IAM API Key:

![Code Engine 6](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/codeengine6.png)

Por último, vamos configurar as variáveis de ambiente do container que será deployado. Você pode fazê-lo no menu abaixo, que aparecerá rodando um pouco a tela:

![Code Engine 7](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/codeengine7.png)

## **Guia do Usuário**

### Login

Ao acessar a página de login, clique no botão para gerar o token, que abrirá uma nova página.

![Login](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/login.png)

Na nova página, faça o login usando o acesso da IBM Cloud, e copie o token gerado. Feche a página e cole o token gerado na tela de login para fazer o acesso.

![Token](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/passcode.png)

Ao efetuar login, a interface automaticamente verifica se, dentre os assistentes cadastrados anteriormente, existe algum que o usuário tenha acesso.

### Homepage

A primeira tela do Assistant Curator é uma Homepage que nos trás uma breve explicação das principais páginas do Asset e um link para cada uma delas.

![Homepage](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/lobby.png)

A tela contém um menu lateral para facilitar a navegação do usuário.

![Menu Lateral](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/menuLateral1.png)

![Menu Lateral](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/menuLateral2.png)

No Header no canto superior direito, temos um menu em formato de lista que apresenta os assistentes existentes. Todos os dados que estão sendo apresentados na interface dizem respeito ao assitente selecionado. Para fazer curadoria de outro, basta selecionar outro da lista.

![Change Assistant](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/changeAssistant.png)

Há também um botão de ajuda no canto inferior direito que abre um modal com uma sugestão passo a passo de como executar o processo de curadoria do Assistant. Esse modal pode ser acessado em qualquer página do Assistant Curator.

![Modal](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/modalInfo.png)

![Help Modal](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/helpModal.png)

### Intent Search

Essa tela nos traz uma visualização da troca de mensagens entre cliente e assistente, possibilitando buscas por data e/ou por intent. É possível avaliar estas mensagens, enriquecendo nossa análise com uma nota de satisfação do próprio curador.

![Intent Search](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/intentSearch.png)

### Conversation Performance

Nesta página temos a interface do Dashboard interativo. Esses gráficos contêm os principais dados sobre o seu Assistant e foram construídos pensando em trazer os dados mais importantes para entender como está o desempenho do seu Assistant.

![Conversation Performance](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/conversationPerformance.png)

As visualizações apresentadas podem ser alteradas para melhor atenderem a análise desejada para seu caso de uso.

### Como Adicionar Link Cognos

Observe que na última opção na lista dos assisstentes, há uma opção de adicionar um novo link do Cognos.

![Add Link Cognos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/newCognosLink.png)

Ao clicar nessa opção "+ add Cognos Link" abre um modal para inserir as informações necessárias relacionadas ao Cognos.
Nesse Modal você seleciona o Assistente que vai inserir os dados.

![Add Link Cognos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/addCognosModal.png)

![Add Link Cognos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/selectAssistant.png)

Depois disso, tem que seguir até a sua conta do Cognos Analytics e clicar nos 3 pontinhos "Menu de Ação" do dashboard do assistente que foi selecionado na etapa anterior.

![Pagina Cognos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/dashCognos.png)

Selecionar a opção Compartilhar

![Pagina Cognos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/shareDash.png)

Irá abrir um Modal com um link que deverá ser copiado parte dele, que fica "depois de pathRef=" até "&action""

![Pagina Cognos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/linkDash.png)

Após isso, voltar para página do Curator e colar no segundo quadro conforme exemplo.
Depois desses passos, clicar em Salvar e o assistente aparecerá na lista de assistentes.

![Add Link Cognos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/linkAssistant.png)

Para inserir um novo assistente basta clicar na engrenagem que fica no canto superior direito, após irá abrir um modal o quel deverá e inserir o link Webhook do watson assistant.

![New Assistant](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/newAssistant.png)

## **Conteúdo dos Gráficos**

### Overview

Trata-se de um painel de análise de sistema de atendimento, que exibe diferentes métricas e gráficos para monitorar a interação dos usuários conforme abaixo:
![Overview Conversation Performance ](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/overview.png)

1. Number of Conversations (Número de Conversas)
   Definição: Representa o total de conversas registradas no sistema.
   Funcionalidade: Ajuda a avaliar o volume de interações que o sistema está recebendo.
2. Transferred Conversations (Conversas Transferidas)
   Definição: Mostra o número de conversas que foram transferidas para atendimento humano.
   Funcionalidade: Mede a eficiência do chatbot e identifica a necessidade de suporte adicional.
3. Relevant Conversations (Conversas Relevantes)
   Definição: Exibe quantas conversas foram classificadas como relevantes com base em critérios específicos.
   Funcionalidade: Ajuda a monitorar se o chatbot está entregando valor em suas interações.
4. Conversations by Day (Conversas por Dia)
   Definição: Gráfico de linha que apresenta o número de conversas diárias.
   Funcionalidade: Permite identificar picos ou padrões no uso diário, facilitando a gestão de recursos e análise de tendências.
5. Customer-provided Feedback (Feedback do Cliente)
   Definição: Exibe a quantidade de feedback recebido dos clientes, se disponível.
   Funcionalidade: Avalia a satisfação e a percepção dos usuários em relação ao sistema.
6. Most Accessed Intents (Intenções Mais Acessadas)
   Definição: Um gráfico de pizza que mostra as intenções mais frequentemente acessados pelos usuários.
   Funcionalidade: Identifica quais assuntos ou funcionalidades são mais buscados, ajudando a priorizar melhorias.

### Seccondary Data

Tem um painel de análise de interações no sistema de conversas.
![Seccondary Data](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/seccondaryData.png)

1. Number of Unique Users (Número de Usuários Únicos)
   Definição: Indica o total de usuários distintos que interagiram com o sistema.
   Funcionalidade: Ajuda a entender o alcance do chatbot e identificar o número de pessoas que utilizaram o sistema.
2. Total Messages (Mensagens Totais)
   Definição: Mostra a quantidade total de mensagens trocadas entre os usuários e o sistema.
   Funcionalidade: Mede o nível de atividade no chatbot, útil para avaliar o engajamento.
3. Average Messages per Conversation (Média de Mensagens por Conversa)
   Definição: Calcula a média de mensagens trocadas por conversa.
   Funcionalidade: Ajuda a entender a complexidade ou profundidade das interações. Uma média alta pode indicar conversas mais detalhadas, enquanto uma média baixa pode apontar interações simples.
4. Conversation Channel (Canal de Conversa)
   Definição: Gráfico de barras que apresenta a distribuição das conversas por canal (por exemplo, "Web Chat").
   Funcionalidade: Identifica quais canais são mais utilizados pelos usuários, permitindo priorizar melhorias nesses canais.
5. User Recurrency (Recorrência de Usuários)
   Definição: Um gráfico que mostra as datas e horários em que os usuários retornaram para interagir com o sistema.
   Funcionalidade: Ajuda a monitorar a fidelidade dos usuários e a frequência de uso do chatbot.

### Conversation Nodes

Temos informações analíticas relacionadas às conversas do assistente virtual.
![Conversation Nodes](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/conversationNodes.png)

1. Average Score vs. Occurrences (Pontuação Média vs. Ocorrências)
   Definição: Um gráfico de linhas que mostra a pontuação média atribuída a cada conversa (representada por um identificador único) em relação às ocorrências.
   Funcionalidade: Identifica padrões de qualidade nas interações do assistente.
   A pontuação média pode ser usada para avaliar a satisfação do usuário ou a eficácia do bot em atender às necessidades.
   Pontos altos indicam boas interações, enquanto os baixos podem sugerir problemas ou mal-entendidos.
2. Score Ratio per Dialog Node (Relação de Pontuação por Nó de Diálogo)
   Definição: Um gráfico que detalha como cada nó do fluxo de diálogo contribuiu para as pontuações atribuídas.
   Funcionalidade: Avaliar o desempenho de cada nó no fluxo de conversas. Identificar nós que precisam ser ajustados para melhorar a experiência do usuário (por exemplo, nós com baixa pontuação ou alta taxa de "No action matches").

### Intents

Possui um gráfico de linha que mostra a pontuação média atribuída a cada intenção (intent) ao longo do eixo X, com base no número de ocorrências registradas no conjunto de dados.
![Intents](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/intents.png)

1. Average Score vs. Occurrences (Pontuação Média vs. Ocorrências)
   Definição: Um gráfico de linha que mostra a pontuação média atribuída a cada intenção (intent) ao longo do eixo X, com base no número de ocorrências registradas no conjunto de dados.
   Funcionalidade: Avalia a qualidade de desempenho das intenções ao longo de suas execuções, identifica pontos fora da curva, como intenções com pontuação média anormalmente alta ou baixa e correlacionar a frequência de uso das intenções com a eficácia delas, ajudando na priorização de ajustes.

2. Score Proportion per Intention (Proporção de Pontuação por Intenção)
   Definição: Um gráfico de barras que apresenta a proporção da pontuação de cada intenção em relação ao total de intenções no conjunto de dados. Cada barra representa uma intenção específica, destacando sua representatividade.
   Funcionalidade: Oferece uma visão comparativa da performance das intenções, mostra a distribuição proporcional das intenções no sistema, identificando quais têm maior ou menor relevância no conjunto e ajuda a verificar o equilíbrio do sistema, permitindo detectar se há intenções sub-representadas ou que dominam a análise.

### Conversation Path

É a distribuição de frequências de diferentes intents (intenções) em um modelo de processamento de linguagem natural (PLN).
![Conversation Path](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/conversationPath.png)

1. Conversation Path.
   Definição: Cada barra do histograma representa um intent específico, e a altura da barra indica a frequência com que esse intent aparece nos dados.
   Funcionalidade: O dashboard serve para monitorar o desempenho de um modelo de PLN, para Analisar a distribuição dos intents, Identificar possíveis problemas, acompanhar a evolução do modelo e Tomar decisões.

### Class Distribution

Tem como objetivo mostrar a frequência de instâncias para cada classe/intenção no conjunto de dados. Ele ajuda a identificar se há desbalanceamento nas classes, o que pode impactar o desempenho do modelo de aprendizado de máquina.
![Class Distribution](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/classDistribution.png)

1. Class Distribution
   Definição: Mostra a contagem de ocorrências para cada classe ou intenção no conjunto de dados, exibindo os nomes das classes ou intenções presentes no conjunto de dados e mostra a Lista as contagens exatas de instâncias associadas a cada classe/intenção.
   Funcionalidade: Identifica classes com alta ou baixa frequência, verifica se há desbalanceamento no conjunto de dados e informa ajustes no modelo, como a necessidade de técnicas de balanceamento, caso necessário.

### Precision@K

Apresenta as métricas de avaliação de modelos de aprendizado para avaliar a qualidade das previsões do modelo em diferentes níveis do ranking, útil para sistemas de classificação ou recomendação, ajuda a identificar possíveis concentrações de dados em níveis específicos de precisão. Permite entender melhor o comportamento do modelo em relação à distribuição das previsões.
! [Precision@k] (https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/precision.png)

1. Precision @K
   Definição: Este gráfico mostra a métrica de precisão em diferentes pontos do ranking K, indicando o desempenho do modelo ao identificar as respostas ou previsões mais relevantes dentro de um conjunto de dados. O eixo x representa os pontos, K (exemplo: 0.88 e 1.0 no gráfico), enquanto o eixo y mostra a precisão (proporção de itens relevantes recuperados em relação ao total recuperado).
   Funcionalidade: Verifica se o modelo mantém a precisão à medida que mais itens são considerados no ranking.

2. Count
   Definição: Este gráfico mostra a frequência (contagem) das previsões feitas pelo modelo em diferentes níveis de precisão.
   Funcionalidade: Ajuda a identificar possíveis concentrações de dados em níveis específicos de precisão.
   Permite entender melhor o comportamento do modelo em relação à distribuição das previsões.

### Class Accuracy

Tem como objetivo relacionar métricas de precisão e recall para avaliar o desempenho do modelo em diferentes intenções (classes). Ele ajuda a entender como o modelo está equilibrando as duas métricas, fornecendo insights sobre sua eficácia.
![Class Accuracy](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/classAccuracy.png)

1. Intent Occurency vs. Precision
   Definição: Representa a métrica de precisão, que mede a proporção de intenções corretamente classificadas em relação a todas as predições positivas feitas pelo modelo.
   Funcionalidade: Avalia a capacidade do modelo de evitar falsos positivos, identifica o quanto o modelo está cobrindo as intenções reais sem perder informações, facilita a visualização das áreas em que o modelo tem mais ou menos equilíbrio entre precisão e recall e ajuda a identificar possíveis pontos de melhoria no desempenho.

### Confused Intents

Apresenta a análise de intenções confusas em um modelo de NLP (Processamento de Linguagem Natural). Ele ajuda a identificar conversas onde o modelo teve dificuldades em classificar corretamente as intenções, ou onde múltiplas intenções foram interpretadas de maneira semelhante, resultando em erros ou incertezas.
![Confused Intents](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/confusedIntents.png)

1. Confused Intents.
   Definição: Mostra a distribuição de frequências de diferentes intents (intenções) em um modelo de processamento de linguagem natural (PLN). Cada barra representa um intent específico, e a altura da barra indica a frequência com que esse intent aparece nos dados.
   Funcionalidade: Permite que analistas localizem rapidamente conversas onde o modelo apresentou desempenho insatisfatório, ajuda a entender quais intenções específicas são frequentemente confundidas e precisam de ajuste no modelo ou na estrutura de treinamento e oferece insights para melhorar o treinamento do modelo, como ajustar exemplos de treinamento ou revisar intenções mal definidas.

### Accuracy Vs. Coverage

O gráfico de bolhas relaciona as métricas de acurácia e cobertura com base em diferentes níveis de confiança do modelo. Este gráfico visa fornecer uma visão do equilíbrio entre Acurácia, Cobertura e Limiar de Confiança.
![Accuracy Vs Coverage](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/accuracyCoverage.png)

1. Accuracy and COverage
   Definição: O gráfico ajuda a encontrar um equilíbrio ideal entre acurácia e cobertura com base nos requisitos da aplicação.
   Funcionalidade: Avaliar o quão preciso é o modelo ao tomar decisões. Um valor próximo de 1 indica um alto nível de precisão. Controla a relação entre acurácia e cobertura. Aumentar o limiar geralmente aumenta a acurácia, mas reduz a cobertura, e vice-versa. Permite entender a quantidade de casos em que o modelo está efetivamente respondendo. Bolhas maiores indicam maior cobertura.

### Prediction

Apresenta uma visão comparativa das métricas de precisão e F1-score, usadas para avaliar o desempenho geral do modelo de classificação.
![Prediction](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/predictions.png)

1. Prediction
   Definição: Mede a proporção de predições corretas (positivas) em relação ao total de predições feitas pelo modelo. Indica a capacidade do modelo de evitar falsos positivos e Combina precisão e recall em uma única métrica harmônica, sendo mais útil quando há um trade-off entre essas métricas.
   Valores mais altos de F1 indicam um equilíbrio ideal entre precisão e recall.
   Funcionalidade: Permite visualizar diretamente os valores atingidos para cada métrica e mostra a capacidade do modelo de classificar corretamente as intenções positivas.

<!-- ### Intent Training Quality

Essa tela apresenta os gráficos baseados em dados dos experimentos realizados analisando as intenções, seus respectivos exemplos e a árvore de conversação do Assistente.

![Intent Train](./readMeImgs/intentTrain.png) -->

## **Conexão Cognos Analytics ao DB2 e Importação de CSV**

### Login no Cognos Analytics

Acesse a interface do Cognos Analytics com suas credenciais. Certifique-se de ter permissões de administrador ou acesso necessário para criar conexões e carregar dados.

### Conexão com o Banco de Dados DB2

No menu superior, clique em **"Gerenciar"** e selecione **"Conexões de servidor de dados"** .

![LoginCongos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/menuCognos.png)

![LoginCongos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/gerenciarCognos.png)

![LoginCongos](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/conexaoCognos.png)

Na aba **Conexões de Dados**, clique em **"Servidor de dados"**. Ao abrir a tela, nomeie a conexão como **"Curator"** e selecione o banco de dados **IBM DB2** na lista de tipos de conexão.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/novaconexaoCognos.png)

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/curatorBanco.png)

### Preenchimento das Informações de Conexão

Preencha a URL de JDBC com os dados do hostname, porta e database do IBM DB2:

`jdbc:db2://<hostname>:<porta>/<database>:sslConnection=true;`

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/db2Cognos.png)

Altere o **Método de Autenticação** para **Conexão de uso**.

Clique em **Incluir nova conexão**. Nomeie a conexão e preencha o **Username** e **Password** com as credenciais do DB2.

Clique em **Pronto**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/usernameCognos.png)

Vá para **Dispatchers (obrigatório)**, clique em **Selecionar todos** e em seguida **Testar a conexão**.

Se o teste for bem-sucedido, clique em **Avançar**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/testeCognos.png)

Na tela seguinte, selecione todos os tipos de comandos e clique em **Criar**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/comandosCognos.png)

### Carregamento das Tabelas

Com a conexão criada, clique em **Carregar** para carregar as tabelas do DB2.
![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/carregarCognos.png)

Selecione as tabelas relacionadas ao ID do assistente. Após carregar todas, clique em **Pronto**.
![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/carregado.png)

### Criação de Módulo de Dados

Você carregando todas as tabelas, agora devemos criar um módulo de dados, para conseguirmos puxar essas tabelas para o nosso painel.

No menu, clique em **Novo > Módulo de Dados**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/moduloCognos.png)

Clique no ícone de banco de dados à esquerda. Escolha a conexão criada anteriormente, selecione uma tabela e clique em **OK**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/moduloBanco.png)

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/moduloTabela.png)

Clique em **Selecionar Tabelas** e **Próximo**. Na tela seguinte, selecione todas as colunas desejadas.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/moduloSelecionar.png)

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/moduloTabelas.png)

Salve o módulo com o nome do assistente e escolha onde salvar (Meu Conteúdo ou Equipe).

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/moduloPronto.png)

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/moduloSalvar.png)

### Criação do Painel

Com o seu módulo feito, você pode ir no menu, clique em **Novo > Painel**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/painelCognos.png)

Escolha o primeiro modelo de painel e clique em **Criar**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/painel.png)

Dentro do painel, pressione

`ctl + / + q`

Apague o conteúdo existente e copie o CSV do link abaixo:

[Baixar o arquivo CSV completo](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/Padra%CC%83oCurator.csv)

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/painelAntigo.png)

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/painelNovo.png)

Após colar o conteúdo, clique em **Atualizar**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/PainelColado.png)

Clique em **Origens selecionadas**, depois nos três pontos ao lado de **Padrão Assistant** e selecione **Vincular novamente**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/painelAtualizar.png)

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/painelVincular.png)

Escolha o módulo de dados criado anteriormente e clique em **Usar**.

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/painelOrigem.png)

Seu painel está pronto e atualizado com as informações do assistente!

![Conexão](https://asset-portal-files.s3.us-south.cloud-object-storage.appdomain.cloud/painelFinal.png)

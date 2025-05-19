export default {
  pt: {
    sideNav: {
      link1: "Performance de conversação",
      link2: "Busca de Intenções",
      link3: "Performance de conversação",
    },

    accountModal: {
      header: "Selecione abaixo a conta da qual deseja listar recursos",
      headerLbl: "Conta Cloud",
      body: "Contas IBM Cloud",

      selectBtn: "Selecionar",
    },

    inputModal: {
      notififyTitle: "Arquivo inválido",
      notififyTxt: "Este json não parece ser de uma skill de actions!",

      header:
        "Atualmente a listagem dos assistentes construídos no modelo de Actions está limitada a planos Enterprise. Caso seu assistente não tenha aparecido automaticamente, por gentileza envie abaixo o seu JSON.",
      headerLbl: "Cadastro de novo Assistant (Actions)",

      fileBtn: "Selecionar Arquivo",
      fileIcon: "Cancelar",
      fileLbl: "Por gentileza enviar o .json de sua skill",
      fileTitle: "Upload de arquivos",
      labelTxt: "Nome da skill",
      titleTxt1: "Nós de transferência",
      titleTxt2: "Nós de feedback",
      titleTxt3: "Nós Finais",
      titleTxt4: "Tópicos Relevantes",
      label1: "Selecione uma ou mais Actions",
      label2: "Faça upload de um arquivo",
      cancelBtn: "Cancelar",
      continueBtn: "Continuar",
    },

    header: {
      menuItem: "Assistente actions",
      menuItem2: "Incluir Assistant",
      theme: "Tema",
      share: "Compartilhar",
      save: "Salvar",
      account: "Conta",
      assistant: "Nenhum assistente disponível",
      linkModal: "Adicionar Link Cognos",
    },

    interestModal: {
      txt1: "Prospecção",
      txt2: "Testes",
      txt3: "Continuidade de oportunidade já existente",
      txt4: "Passagem de conhecimento",

      modalHead: "Por gentileza preencha os campos abaixo:",
      modalLbl: "Obrigado por utilizar uma de nossas demos!",
      modalAlert: "Por gentileza preencha todo o formulário.",
      modalSendBtn: "Enviar",
      modalCancelBtn: "Cancelar",

      formLbl: "Cliente/Parceiro",
      formTxt: "Para qual empresa você irá apresentar?",

      authorLbl: "IBMer responsável",
      authorTxt: "Email de contato",

      selectLbl: "Selecione",
      selectTxt: "Classifique esta iniciativa",

      titleInputLbl: "Oportunidade",
      titleInputTxt: "Número de oportunidade associado",
    },

    manualInputModal: {
      header: "Cadastro de novo Assistant",
      headerTxt:
        "Cadastre o link abaixo como log Webhook em seu watson assistant.",
      lblId: "IBM Account ID",
      lblSkill: "Skill Name",
      lblType: "Tipo de Assistant",
      lblSelect: "Selecione o tipo de assistente",
      lblEnviroment: "Environment ID",
      onlyAction: "Somente para action Assistants",
      txtSelectItem: "Choose an option",
      selectItem1: "Cada minuto",
      selectItem2: "Cada 5 min",
      selectItem3: "Cada 10 min",
      selectItem4: "Cada hour",
      selectItem5: "Cada 5 hours",
      selectItem6: "Cada 12 hours",
      selectItem7: "Uma vez por dia",
      cancelBtn: "Cancelar",
      saveBtn: "Copiar link",
    },

    notification: {
      title: "Inicializando",
      txt: "Carregando dashboard padrão...",
    },

    pagination: {
      backwardTxt: "Página anterior",
      forwardTxt: "Proxima página",
      pageTxt: "Itens por página:",
    },

    publicDashboards: {
      modalHeader:
        "Veja abaixo os dashboards com visualização pública. Para gerar um link compartilhável deste atual dashboard, utilize o botão 'Criar novo'",
      modalHeaderLbl: "Compartilharmento de Dashboards",

      txtA: "Abrir visualização pública",
      txtItem: "Não há dashboards cadastrados...",
      lblTxt: "Nome do Dashboard",
      lblId: "ID final",
      deleteBtn: "Excluir",
      cancelBtn: "Cancelar",
      createBtn: "Criar Novo",
    },

    rating: {
      lbl1: "Muito Insatisfeito",
      lbl2: "Insatisfeito",
      lbl3: "Neutro",
      lbl4: "Satisfeito",
      lbl5: "Muito Satisfeito",
    },

    saveLoadModal: {
      modalHeader:
        "Use este modal para salvar esta versão do atual dashboard ou para carregar alguma versão anteriormente salva.",
      modalHeaderLbl: "Gerenciar Dashboards",

      txtLbl: "Qual nome do dashboard?",

      searchBtn: "Buscar",
      searchBtnTitle: "Inicializando",
      searchBtnTxt: "Carregando dashboard",
      searchBtnTitle2: "Erro",
      searchBtnTxt2: "Não foi possível carregar esta dashboard...",

      saveBtn: "Salvar",
      saveBtnTxt: "Não foi possível salvar esta dashboard...",
    },

    table: {
      header1: "ID do Log",
      header2: "Mensagem do Cliente",
      header3: "Mensagem do Assistente",
      header4: "Intent Identificada",
      header5: "Nota (1 - 5)",

      sendBtn: "Enviar notas",
    },
    useFlowModal: {
      imgTxt1:
        "Analise a qualidade de treinamento das intents de seu Assistente, verificando a precisão geral e detalhada do mesmo, levantando possíveis causas de erro.",

      imgTxt2:
        "Acesse sua instância do Watson Assistant e busque pela skill do assistente em questão. Iremos editar as intents que foram identificadas como insatisfatórias.",

      imgTxt3:
        "Edite exemplos das intenções com baixa precisão, removendo aqueles que foram identificados como causadores de confusão. Verifique se é necessário criar novas intents ou excluir alguma existente.",

      imgTxt4:
        "Conhecendo suas intents, você pode agora ver como elas performam em situações de conversação real na aba Intent Search. Realize buscas através de filtros por data.",

      imgTxt5:
        "Gere visualizações gráficas sobre a performance histórica de seu assistente na aba Conversation Performance. Adapte os gráficos padrão para o seu caso de uso.",

      modalHeaderLbl: "Fluxo de uso",

      progressDescription: "Etapa 5: Introdução ao Carbon Design System",

      previousBtn: "Anterior",
      nextBtn: "Próximo",
    },

    conversationPerformance: {
      title: "Inicializando",
      txt: "Carregando dashboard",
      insideTxt: "padrão",
      text1:
        "Nenhum assistente selecionado. Por favor, escolha um no menu superior.",
    },

    firstSteps: {
      title1: "Bem-vindo ao Assistant Curator",
      title2:
        "Não foi identificado nenhum assistente disponível para sua curadoria",
      title3:
        "Faça o cadastro de um assistente! Veja detalhes no menu engrenagem no canto superior.",
    },

    intentSearch: {
      placeHolder: "Busque por intents",
      btn1: "Buscar",
      btn2: " Solicitar Logs mais antigos",
      title: "Faça uma nova busca",
    },
    intentTrain: {
      btn: "Realizar novo teste",
    },
    lobby: {
      title1: "Bem-vindo ao Assistant Curator",
      title2: "Qualidade de Treinamento",
      title3: "Busca de Intenções",
      title4: "Desempenho na conversação",

      paragraph1:
        "Mostra gráficos baseados em dados de Experimentos realizados utilizando as intenções e a árvore de conversação do Assistente.",
      paragraph2:
        "Apresenta a conversa entre cliente e assistente agrupada por intents para avaliação humana de sua assertividade, atribuindo uma pontuação (1 - 5).",
      paragraph3:
        "Fornece uma interface para construção e visualização de painéis interativos, com o IBM Cognos Analytics, que mostra o desempenho do Asssistente ao longo do tempo. Além de mostrar gráficos baseados em dados de Experimentos realizados utilizando as intenções e a árvore de conversação do Assistente.",
    },
    CognosLinkModal: {
      labelText: "Identificador do path do Cognos",
      placeholder: "Copiar a parte do link depois de 'pathRef=' até '&action'",
      text: "O link completo será gerado automaticamente com base no path inserido.",
      text1: "Adicionar Link Cognos",
      title: "Assistente",
      text2: "Selecione um assistente",
    },
  },

  en: {
    sideNav: {
      link1: "Conversation Performance",
      link2: "Intent Search",
      link3: "Conversation Performance",
    },

    accountModal: {
      header: "Select below the account from which you want to list resources",
      headerLbl: "Cloud Account",
      body: "IBM Cloud Accounts",
      selectBtn: "Select",
    },

    inputModal: {
      notififyTitle: "Invalid File",
      notififyTxt: "This JSON does not seem to be from an Actions skill!",
      header:
        "Currently, listing assistants built in the Actions model is limited to Enterprise plans. If your assistant hasn't appeared automatically, please send us your JSON below.",
      headerLbl: "Register a new Assistant (Actions)",
      fileBtn: "Select File",
      fileIcon: "Cancel",
      fileLbl: "Please upload your .json skill file",
      fileTitle: "File Upload",
      labelTxt: "Skill Name",
      titleTxt1: "Transfer Nodes",
      titleTxt2: "Feedback Nodes",
      titleTxt3: "End Nodes",
      titleTxt4: "Relevant Topics",
      label1: "Select one or more Actions",
      label2: "Upload a file",
      cancelBtn: "Cancel",
      continueBtn: "Continue",
    },

    header: {
      menuItem: "Actions Assistant",
      menuItem2: "Register Assistant",
      theme: "Theme",
      share: "Share",
      save: "Save",
      account: "Account",
      assistant: "No assistant available",
      linkModal: "Add Cognos Link",
    },

    interestModal: {
      txt1: "Prospection",
      txt2: "Testing",
      txt3: "Continuity of existing opportunity",
      txt4: "Knowledge transfer",
      modalHead: "Please fill in the fields below:",
      modalLbl: "Thank you for using one of our demos!",
      modalAlert: "Please fill out the entire form.",
      modalSendBtn: "Send",
      modalCancelBtn: "Cancel",
      formLbl: "Client/Partner",
      formTxt: "Which company will you present to?",
      authorLbl: "Responsible IBMer",
      authorTxt: "Contact Email",
      selectLbl: "Select",
      selectTxt: "Classify this initiative",
      titleInputLbl: "Opportunity",
      titleInputTxt: "Associated opportunity number",
    },

    manualInputModal: {
      header: "Registering a new Assistant",
      headerTxt:
        "Register the link below as a Webhook log on your Watson Assistant.",
      lblId: "IBM Account ID",
      lblTxt: "Watson Assistant Instance GUID",
      lblSkill: "Skill Name",
      lblType: "Assistant Type",
      lblSelect: "Select the type of assistant",
      lblEnviroment: "Environment ID",
      onlyAction: "Only for action Assistants",
      txtSelectItem: "Choose an option",
      selectItem1: "Every min",
      selectItem2: "Every 5 min",
      selectItem3: "Every 10 min",
      selectItem4: "Every hour",
      selectItem5: "Every 5 hours",
      selectItem6: "Every 12 hours",
      selectItem7: "Once a day",
      cancelBtn: "Cancel",
      saveBtn: "Copy link",
    },

    notification: {
      title: "Initializing",
      txt: "Loading default dashboard...",
    },

    pagination: {
      backwardTxt: "Previous page",
      forwardTxt: "Next page",
      pageTxt: "Items per page:",
    },

    publicDashboards: {
      modalHeader:
        "See below the dashboards with public viewing. To generate a shareable link for this current dashboard, use the 'Create New' button",
      modalHeaderLbl: "Dashboard Sharing",
      txtA: "Open public view",
      txtItem: "No dashboards registered...",
      lblTxt: "Dashboard Name",
      lblId: "Final ID",
      deleteBtn: "Delete",
      cancelBtn: "Cancel",
      createBtn: "Create New",
    },

    rating: {
      lbl1: "Very Dissatisfied",
      lbl2: "Dissatisfied",
      lbl3: "Neutral",
      lbl4: "Satisfied",
      lbl5: "Very Satisfied",
    },

    saveLoadModal: {
      modalHeader:
        "Use this modal to save this version of the current dashboard or to load a previously saved version.",
      modalHeaderLbl: "Manage Dashboards",
      txtLbl: "What is the dashboard name?",
      searchBtn: "Search",
      searchBtnTitle: "Initializing",
      searchBtnTxt: "Loading dashboard ${dbName}...",
      searchBtnTitle2: "Error",
      searchBtnTxt2: "Could not load this dashboard...",
      saveBtn: "Save",
      saveBtnTitle: "Error",
      saveBtnTxt: "Could not save this dashboard...",
    },

    table: {
      header1: "Log ID",
      header2: "Customer Message",
      header3: "Assistant Message",
      header4: "Identified Intent",
      header5: "Rating (1 - 5)",
      sendBtn: "Send Ratings",
    },

    useFlowModal: {
      imgTxt1:
        "Analyze the training quality of your Assistant's intents, checking its overall and detailed accuracy, identifying possible error causes.",
      imgTxt2:
        "Access your Watson Assistant instance and search for the assistant's skill. We will edit intents identified as unsatisfactory.",
      imgTxt3:
        "Edit examples of intents with low precision, removing those identified as causing confusion. Check if it is necessary to create new intents or delete existing ones.",
      imgTxt4:
        "With knowledge of your intents, you can now see how they perform in real conversation situations in the Intent Search tab. Conduct searches using date filters.",
      imgTxt5:
        "Generate graphical views on the historical performance of your assistant in the Conversation Performance tab. Adapt default charts to your use case.",
      modalHeaderLbl: "Flow of use",

      progressDescription: "Step 5: Getting started with Carbon Design System",
      previousBtn: "Previous",
      nextBtn: "Next",
    },

    conversationPerformance: {
      title: "Initializing",
      txt: "Loading dashboard",
      insideTxt: "default",
      text1: "No assistant selected. Please choose one from the top menu.",
    },

    firstSteps: {
      title1: "Welcome to Assistant Curator",
      title2: "No available assistant identified for curation",
      title3:
        "Register an assistant! See details in the gear menu in the top corner.",
    },

    intentSearch: {
      placeHolder: "Search for intents",
      btn1: "Search",
      btn2: "Request Older Logs",
      title: "Perform a new search",
    },

    intentTrain: {
      btn: "Perform new test",
    },

    lobby: {
      title1: "Welcome to Assistant Curator",
      title2: "Training Quality",
      title3: "Intent Search",
      title4: "Conversation Performance",

      paragraph1:
        "Displays charts based on data from experiments performed using intents and the Assistant's conversation tree.",
      paragraph2:
        "Presents the conversation between the client and the assistant grouped by intents for human evaluation of its assertiveness, assigning a score (1 - 5).",
      paragraph3:
        "Provides an interface for building and viewing interactive dashboards, powered by IBM Cognos Analytics, showing Assistant performance over time. Additionally, it displays charts based on data from experiments performed using intents and the Assistant conversation tree.",
    },
    CognosLinkModal: {
      labelText: "Cognos Path Identifier",
      placeholder: "Copy the part of the link after 'pathRef=' up to '&action'",
      text: "The complete link will be automatically generated based on the path entered.",
      text1: "Add Cognos Link",
      title: "Assistant",
      text2: "Select an Assistant",
    },
  },

  es: {
    sideNav: {
      link1: "Rendimiento conversacional",
      link2: "Búsqueda de intenciones",
      link3: "Rendimiento conversacional",
    },

    accountModal: {
      header:
        "Seleccione a continuación la cuenta de la cual desea listar recursos",
      headerLbl: "Cuenta en la Nube",
      body: "Cuentas de IBM Cloud",
      selectBtn: "Seleccionar",
    },

    inputModal: {
      notififyTitle: "Archivo no válido",
      notififyTxt: "Este JSON no parece ser de una habilidad de Actions",
      header:
        "Actualmente, la lista de asistentes construidos en el modelo de Actions está limitada a planes Enterprise. Si su asistente no ha aparecido automáticamente, por favor envíe a continuación su JSON",
      headerLbl: "Registro de nuevo Asistente (Actions)",
      fileBtn: "Seleccionar Archivo",
      fileIcon: "Cancelar",
      fileLbl: "Por favor envíe el archivo .json de su habilidad",
      fileTitle: "Cargar archivos",
      labelTxt: "Nombre de la habilidad",
      titleTxt1: "Nodos de transferencia",
      titleTxt2: "Nodos de retroalimentación",
      titleTxt3: "Nodos Finales",
      titleTxt4: "Temas Relevantes",
      label1: "Seleccione una o más Actions",
      label2: "Cargar un archivo",
      cancelBtn: "Cancelar",
      continueBtn: "Continuar",
    },

    header: {
      menuItem: "Asistente actions",
      menuItem2: "Registro de Assistente",
      theme: "Tema",
      share: "Compartir",
      save: "Guardar",
      account: "Cuenta",
      assistant: "No hay asistente disponible",
      linkModal: "Agregar enlace de Cognos",
    },

    interestModal: {
      txt1: "Prospecto",
      txt2: "Pruebas",
      txt3: "Continuidad de oportunidades existentes",
      txt4: "Transferencia de conocimiento",
      modalHead: "Por favor complete los campos a continuación",
      modalLbl: "¡Gracias por utilizar una de nuestras demos!",
      modalAlert: "Por favor complete todo el formulario",
      modalSendBtn: "Enviar",
      modalCancelBtn: "Cancelar",
      formLbl: "Cliente/Colaborador",
      formTxt: "¿Para qué empresa presentará?",
      authorLbl: "Responsable de IBM",
      authorTxt: "Correo electrónico de contacto",
      selectLbl: "Seleccione",
      selectTxt: "Clasifique esta iniciativa",
      titleInputLbl: "Oportunidad",
      titleInputTxt: "Número de oportunidad asociado",
    },

    manualInputModal: {
      header: "Registro de nuevo Asistente",
      headerTxt:
        "Registre el siguiente enlace como un registro de Webhook en su Watson Assistant.",
      lblId: "ID de Cuenta de IBM",
      lblSkill: "Nombre de la Habilidad",
      lblType: "Tipo de Asistente",
      lblSelect: "Seleccione el tipo de asistente",
      lblEnviroment: "ID de Entorno",
      onlyAction: "Solo para asistentes de acción",
      txtSelectItem: "Elija una opción",
      selectItem1: "Cada minuto",
      selectItem2: "Cada 5 min",
      selectItem3: "Cada 10 min",
      selectItem4: "Cada hora",
      selectItem5: "Cada 5 horas",
      selectItem6: "Cada 12 horas",
      selectItem7: "Una vez al día",
      cancelBtn: "Cancelar",
      saveBtn: "Copiar Link",
    },

    notification: {
      title: "Inicializando",
      txt: "Cargando panel de control predeterminado...",
    },

    pagination: {
      backwardTxt: "Página anterior",
      forwardTxt: "Próxima página",
      pageTxt: "Elementos por página:",
    },

    publicDashboards: {
      modalHeader:
        "Vea a continuación los paneles de control con visualización pública. Para generar un enlace compartible de este panel de control actual, utilice el botón 'Crear nuevo'",
      modalHeaderLbl: "Compartir paneles de control",
      txtA: "Abrir vista pública",
      txtItem: "No hay paneles de control registrados...",
      lblTxt: "Nombre del Panel de Control",
      lblId: "ID final",
      deleteBtn: "Eliminar",
      cancelBtn: "Cancelar",
      createBtn: "Crear Nuevo",
    },

    rating: {
      lbl1: "Muy Insatisfecho",
      lbl2: "Insatisfecho",
      lbl3: "Neutro",
      lbl4: "Satisfecho",
      lbl5: "Muy Satisfecho",
    },

    saveLoadModal: {
      modalHeader:
        "Use este modal para guardar esta versión del panel de control actual o para cargar alguna versión guardada anteriormente",
      modalHeaderLbl: "Gestionar paneles de control",
      txtLbl: "¿Cuál es el nombre del panel de control?",
      searchBtn: "Buscar",
      searchBtnTitle: "Inicializando",
      searchBtnTxt: "Cargando panel de control",
      searchBtnTitle2: "Error",
      searchBtnTxt2: "No se pudo cargar este panel de control...",
      saveBtn: "Guardar",
      saveBtnTxt: "No se pudo guardar este panel de control...",
    },

    table: {
      header1: "ID de Registro",
      header2: "Mensaje del Cliente",
      header3: "Mensaje del Asistente",
      header4: "Intención Identificada",
      header5: "Calificación (1 - 5)",
      sendBtn: "Enviar Calificaciones",
    },

    useFlowModal: {
      imgTxt1:
        "Analice la calidad de entrenamiento de las intenciones de su Asistente, verificando la precisión general y detallada del mismo, identificando posibles causas de error.",

      imgTxt2:
        "Acceda a su instancia de Watson Assistant y busque la habilidad del asistente en cuestión. Editaremos las intenciones que fueron identificadas como insatisfactorias.",

      imgTxt3:
        "Edite ejemplos de las intenciones con baja precisión, eliminando aquellos que fueron identificados como causantes de confusión. Verifique si es necesario crear nuevas intenciones o eliminar alguna existente.",

      imgTxt4:
        "Conociendo sus intenciones, ahora puede ver cómo se desempeñan en situaciones de conversación real en la pestaña de Búsqueda de Intenciones. Realice búsquedas a través de filtros por fecha.",

      imgTxt5:
        "Genere visualizaciones gráficas sobre el rendimiento histórico de su asistente en la pestaña de Rendimiento de la Conversación. Adapte los gráficos estándar a su caso de uso.",

      modalHeaderLbl: "Flujo de uso",
      progressDescription: "Etapa 5: Introducción al Sistema de Diseño Carbon",
      previousBtn: "Anterior",
      nextBtn: "Siguiente",
    },

    conversationPerformance: {
      title: "Inicializando",
      txt: "Cargando panel de control",
      insideTxt: "predeterminado",
      text1: "No se han seleccionado asistentes. Elija uno del menú superior.",
    },

    firstSteps: {
      title1: "Bienvenido a Assistant Curator",
      title2: "No se identificó ningún asistente disponible para su curaduría",
      title3:
        "¡Faça o catastro de um asistente! Veja detalhes no menu engrenagem no canto superior.",
    },

    intentSearch: {
      placeHolder: "Buscar intenciones",
      btn1: "Buscar",
      btn2: "Solicitar registros más antiguos",
      title: "Realizar una nueva búsqueda",
    },

    intentTrain: {
      btn: "Realizar nueva prueba",
    },

    lobby: {
      title1: "Bienvenido a Assistant Curator",
      title2: "Calidad de Entrenamiento",
      title3: "Búsqueda de Intenciones",
      title4: "Rendimiento en la Conversación",

      paragraph1:
        "Muestra gráficos basados en datos de experimentos realizados utilizando intenciones y el árbol de conversación del Asistente.",
      paragraph2:
        "Presenta la conversación entre el cliente y el asistente agrupada por intenciones para la evaluación humana de su asertividad, asignando una puntuación (1 - 5).",
      paragraph3:
        "Proporciona una interfaz para crear y visualizar paneles interactivos, impulsados ​​por IBM Cognos Analytics, que muestran el rendimiento del Asistente a lo largo del tiempo. Además, muestra gráficos basados ​​en datos de experimentos realizados utilizando intenciones y el árbol de conversación del Asistente.",
    },
    CognosLinkModal: {
      labelText: "Identificador de ruta de Cognos",
      placeholder:
        "Copie la parte del enlace después de 'pathRef=' a '&action'",
      text: "El enlace completo se generará automáticamente en función de la ruta ingresada.",
      text1: "Agregar enlace de Cognos",
      title: "Asistente",
      text2: "Seleccione un asistente",
    },
  },
};

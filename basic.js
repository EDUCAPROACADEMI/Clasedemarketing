window.modules[1] = {
  title: "Basic Sentences",
  lessons: [
    {
      title: "Affirmative Sentences",
      content: `
        <h2>Oraciones Afirmativas</h2>
        <p>Una oración afirmativa expresa una acción o hecho en presente simple.</p>
        <h3>Estructura</h3>
        <p><b>Sujeto + Verbo + Complemento</b></p>
        <h3>Ejemplos</h3>
        <ul>
          <li>I study English every day.</li>
          <li>We live in a big house.</li>
        </ul>
      `
    },
    {
      title: "Negative Sentences",
      content: `
        <h2>Oraciones Negativas</h2>
        <p>Usamos los auxiliares <b>don't</b> y <b>doesn't</b> para negar en presente.</p>
        <h3>Estructura</h3>
        <p><b>Sujeto + don't / doesn't + Verbo en forma base + Complemento</b></p>
        <h3>Ejemplos</h3>
        <ul>
          <li>I don't like coffee.</li>
          <li>She doesn't work here.</li>
        </ul>
      `
    },
    {
      title: "Questions",
      content: `
        <h2>Preguntas de Sí/No</h2>
        <p>Utilizamos <b>Do</b> o <b>Does</b> al inicio de la oración para preguntas cerradas.</p>
        <h3>Estructura</h3>
        <p><b>Do / Does + Sujeto + Verbo base + Complemento?</b></p>
        <h3>Ejemplos</h3>
        <ul>
          <li>Do you play soccer?</li>
          <li>Does he speak French?</li>
        </ul>
      `
    },
    {
      title: "WH Questions",
      content: `
        <h2>Preguntas de Información (WH Questions)</h2>
        <p>Las palabras WH (What, Where, When, Why, Who, How) se colocan al inicio absoluto.</p>
        <h3>Estructura</h3>
        <p><b>Palabra WH + do / does + Sujeto + Verbo base + Complemento?</b></p>
        <h3>Ejemplos</h3>
        <ul>
          <li>Where do you live?</li>
          <li>What does she study?</li>
        </ul>
      `
    }
  ],
  quizzes: {
    facil: [
      { question: "I ___ a book every night.", options: ["read", "reads", "reading", "readed"], correct: 0, explanation: "Con el pronombre 'I', el verbo en presente se mantiene en su forma base." },
      { question: "She ___ to school by bus.", options: ["go", "goes", "going", "went"], correct: 1, explanation: "Con 'She' (3ra persona singular), agregamos '-es' al verbo 'go'." }
    ],
    medio: [
      { question: "Where ___ your father work?", options: ["do", "does", "is", "are"], correct: 1, explanation: "'Your father' equivale a 'He', por lo tanto el auxiliar de pregunta es 'does'." }
    ],
    dificil: [
      { question: "Neither of my brothers ___ coffee.", options: ["like", "likes", "liking", "don't like"], correct: 1, explanation: "'Neither' se conjuga de manera singular en tercera persona." }
    ],
    extremo: [
      { question: "Hardly ever ___ she watch television during the week.", options: ["does", "do", "is", "has"], correct: 0, explanation: "Los adverbios negativos al inicio causan una inversión del auxiliar." }
    ]
  }
};
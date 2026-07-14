window.modules[2] = {
  title: "Present Simple",
  lessons: [
    {
      title: "Habits and Routines",
      content: `
        <h2>Hábitos y Rutinas</h2>
        <p>Usamos el presente simple para hablar de cosas que hacemos repetidamente o hechos generales.</p>
        <ul>
          <li>I brush my teeth three times a day. (Hábito)</li>
          <li>The sun rises in the east. (Hecho general)</li>
        </ul>
      `
    },
    {
      title: "Spelling Rules (He/She/It)",
      content: `
        <h2>Reglas de Ortografía para Tercera Persona</h2>
        <p>Añadimos <b>-s</b>, <b>-es</b> o <b>-ies</b> al verbo cuando el sujeto es He, She o It.</p>
        <ul>
          <li>Verbos normales: work ➜ <b>works</b></li>
          <li>Terminados en -ch, -sh, -x, -s, -o: watch ➜ <b>watches</b></li>
          <li>Terminados en consonante + y: study ➜ <b>studies</b></li>
        </ul>
      `
    }
  ],
  quizzes: {
    facil: [
      { question: "He ___ soccer every Saturday.", options: ["play", "plays", "playing", "played"], correct: 1, explanation: "En presente simple, se añade '-s' al verbo con el sujeto 'He'." }
    ],
    medio: [
      { question: "My sister ___ English at a language academy.", options: ["study", "studies", "studys", "studying"], correct: 1, explanation: "'My sister' (She) requiere cambiar la 'y' por 'ies' (studies)." }
    ],
    dificil: [
      { question: "The train ___ at 8:00 AM sharp every morning.", options: ["arrive", "arrives", "arriving", "arrives to"], correct: 1, explanation: "'The train' (It) necesita verbo en tercera persona singular." }
    ],
    extremo: [
      { question: "Not only ___ she work hard, but she also studies.", options: ["does", "do", "is", "she does"], correct: 0, explanation: "Al iniciar con 'Not only' se requiere la inversión del auxiliar." }
    ]
  }
};
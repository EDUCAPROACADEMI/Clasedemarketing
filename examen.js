// =======================================
// ENGLISH MASTER PRO
// EXAMEN.JS
// =======================================

let examQuestions = [];
let examCurrent = 0;
let examCorrect = 0;

// ===========================
// INICIAR EXAMEN
// ===========================

function startExam(){

    if(allQuestions.length < 20){

        alert("Todavía no hay suficientes preguntas para el examen.");

        return;

    }

    examQuestions = shuffle([...allQuestions]).slice(0,20);

    examCurrent = 0;
    examCorrect = 0;

    showPage("exam");

    loadExamQuestion();

}

// ===========================
// CARGAR PREGUNTA
// ===========================

function loadExamQuestion(){

    const container = document.getElementById("examContainer");

    const question = examQuestions[examCurrent];

    if(!question){

        finishExam();

        return;

    }

    container.innerHTML = `

    <div class="questionBox">

        <h3>Pregunta ${examCurrent+1} / ${examQuestions.length}</h3>

        <h2>${question.question}</h2>

        <small>${question.module}</small>

        <div id="examAnswers"></div>

    </div>

    `;

    const answers=document.getElementById("examAnswers");

    question.options.forEach((option,index)=>{

        const btn=document.createElement("button");

        btn.className="answer";

        btn.innerHTML=option;

        btn.onclick=()=>checkExamAnswer(index);

        answers.appendChild(btn);

    });

}

// ===========================
// RESPUESTA
// ===========================

function checkExamAnswer(index){

    const question=examQuestions[examCurrent];

    if(index===question.correct){

        examCorrect++;

    }

    examCurrent++;

    loadExamQuestion();

}

// ===========================
// FINALIZAR
// ===========================

function finishExam(){

    const percent=Math.round(examCorrect/examQuestions.length*100);

    let stars="⭐";

    if(percent>=90) stars="⭐⭐⭐⭐⭐";
    else if(percent>=80) stars="⭐⭐⭐⭐";
    else if(percent>=70) stars="⭐⭐⭐";
    else if(percent>=60) stars="⭐⭐";

    document.getElementById("examContainer").innerHTML=`

    <div class="resultBox">

        <h1>🏆</h1>

        <h2>${percent}%</h2>

        <h3>${stars}</h3>

        <p>

        Correctas:

        ${examCorrect}/${examQuestions.length}

        </p>

        <button class="primaryButton" onclick="startExam()">

            Repetir examen

        </button>

    </div>

    `;

}
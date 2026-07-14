// =======================================
// ENGLISH MASTER PRO - CONTROLADOR GLOBAL
// app.js
// =======================================

// Variables de Estado de la Aplicación
let currentPage = "home";
let currentModuleId = 1;
let currentLessonIndex = 0;

// Variables de Progreso (Guardado Local)
let score = 0; 
let level = 1;
let streak = 0;
let completedModules = [];

// Variables del Quiz en curso (Módulos)
let quizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;

// Variables de la Práctica Libre
let practiceQuestions = [];
let currentPracticeQuestion = 0;
let practiceCorrectAnswers = 0;

// Inicializar el objeto global de módulos por si aún no se ha cargado en el navegador
window.modules = window.modules || {};

// =======================================
// INICIALIZACIÓN Y PERSISTENCIA DE DATOS
// =======================================
function loadUserData() {
    const savedXP = localStorage.getItem("emp_xp");
    const savedLevel = localStorage.getItem("emp_level");
    const savedModules = localStorage.getItem("emp_completed_modules");
    
    if (savedXP) score = parseInt(savedXP);
    if (savedLevel) level = parseInt(savedLevel);
    if (savedModules) completedModules = JSON.parse(savedModules);
    
    updateDashboardUI();
}

function saveUserData() {
    localStorage.setItem("emp_xp", score);
    localStorage.setItem("emp_level", level);
    localStorage.setItem("emp_completed_modules", JSON.stringify(completedModules));
}

function updateDashboardUI() {
    // Actualizar marcadores globales
    const xpElement = document.getElementById("xp");
    const levelElement = document.getElementById("level");
    const statXpElement = document.getElementById("stat-xp");
    const statModulesElement = document.getElementById("stat-modules");

    if (xpElement) xpElement.innerText = score;
    if (levelElement) levelElement.innerText = level;
    if (statXpElement) statXpElement.innerText = score + " XP";
    if (statModulesElement) statModulesElement.innerText = `${completedModules.length} / 9`;
    
    // Nivel sube cada 100 XP
    const progressPercent = score % 100;
    const progressBar = document.getElementById("xpProgress");
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
}

// =======================================
// SISTEMA DE NAVEGACIÓN (PÁGINAS)
// =======================================
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add("active");
        currentPage = pageId;
    }

    // SI la página activa pasa a ser Práctica, lanzamos automáticamente el setup
    if (pageId === "practice") {
        startPractice();
    }
}

// Control de botones de la barra lateral (sidebar)
document.querySelectorAll(".menuButton").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".menuButton").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const page = button.dataset.page;
        showPage(page);
    });
});

// Botón "Comenzar Curso"
const startBtn = document.getElementById("startCourse");
if (startBtn) {
    startBtn.onclick = () => showPage("course");
}

// Control del Modo Oscuro
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
    darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("dark", document.body.classList.contains("dark"));
    });
}
if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
    if (darkModeToggle) darkModeToggle.checked = true;
}

// =======================================
// CONTROL DE CURSO Y LECCIONES
// =======================================
function openModule(number) {
    currentModuleId = number;
    const selectedModule = window.modules[number];

    if (selectedModule) {
        loadLesson(number, 0);
    } else {
        alert("Este módulo se está estructurando en este momento.");
    }
}

function loadLesson(moduleNumber, lessonIndex) {
    currentModuleId = moduleNumber;
    currentLessonIndex = lessonIndex;

    const module = window.modules[moduleNumber];
    const lesson = module.lessons[lessonIndex];

    // Si terminamos las lecciones de este módulo...
    if (!lesson) {
        showPage("difficulty-selection");
        return;
    }

    showPage("lesson");
    document.getElementById("lessonTitle").innerText = lesson.title;
    document.getElementById("lessonContent").innerHTML = lesson.content;

    const nextBtn = document.getElementById("nextLesson");
    if (nextBtn) {
        nextBtn.onclick = () => {
            loadLesson(moduleNumber, lessonIndex + 1);
        };
    }
}

// =======================================
// MOTOR DEL QUIZ (CON AUTO-RELLENADO A 25 PREGUNTAS)
// =======================================
function comenzarQuiz(dificultad) {
    const currentModule = window.modules[currentModuleId];
    
    if (currentModule && currentModule.quizzes) {
        let baseQuestions = currentModule.quizzes[dificultad] || [];
        
        // Si no existen preguntas para esta dificultad, usamos un fallback del módulo
        if (baseQuestions.length === 0) {
            Object.keys(currentModule.quizzes).forEach(key => {
                baseQuestions = baseQuestions.concat(currentModule.quizzes[key]);
            });
        }

        // Si de plano no hay ninguna pregunta configurada en el módulo completo
        if (baseQuestions.length === 0) {
            alert("Este módulo no tiene preguntas disponibles para este nivel.");
            return;
        }

        // ALGORITMO DE AUTO-RELLENADO DINÁMICO
        let finalQuestions = [...baseQuestions];
        while (finalQuestions.length < 25) {
            finalQuestions = finalQuestions.concat(baseQuestions.map(q => ({ ...q })));
        }
        
        // Barajamos el set de preguntas y recortamos a exactamente 25
        finalQuestions = shuffleArray(finalQuestions).slice(0, 25);

        quizQuestions = finalQuestions;
        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        
        showPage("quiz-page");
        renderQuizQuestion();
    } else {
        alert("El módulo seleccionado no cuenta con cuestionarios configurados.");
    }
}

function renderQuizQuestion() {
    const feedbackBox = document.getElementById("quiz-feedback");
    if (feedbackBox) feedbackBox.classList.add("hidden");

    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    // Actualizar progreso visual
    const progressText = document.getElementById("quiz-progress-text");
    if (progressText) progressText.innerText = `Pregunta ${currentQuestionIndex + 1} de 25`;
    
    const progressPercent = (currentQuestionIndex / 25) * 100;
    const barProgress = document.getElementById("quiz-bar-progress");
    if (barProgress) barProgress.style.width = `${progressPercent}%`;

    // Cargar texto de pregunta
    const quizQuestionText = document.getElementById("quiz-question");
    if (quizQuestionText) quizQuestionText.innerText = currentQuestion.question;

    // Cargar botones de opciones
    const optionsContainer = document.getElementById("quiz-options");
    if (optionsContainer) {
        optionsContainer.innerHTML = "";
        currentQuestion.options.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "quiz-option-btn";
            btn.innerText = option;
            btn.onclick = () => verificarRespuesta(idx, btn);
            optionsContainer.appendChild(btn);
        });
    }
}

function verificarRespuesta(selectedIdx, clickedButton) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const optionButtons = document.querySelectorAll(".quiz-option-btn");

    optionButtons.forEach(btn => btn.disabled = true);

    const feedbackBox = document.getElementById("quiz-feedback");
    const feedbackText = document.getElementById("feedback-text");

    if (selectedIdx === currentQuestion.correct) {
        clickedButton.classList.add("correct");
        correctAnswersCount++;
        if (feedbackText) feedbackText.innerHTML = `🟢 <b>¡Excelente!</b><br>${currentQuestion.explanation}`;
    } else {
        clickedButton.classList.add("incorrect");
        if (optionButtons[currentQuestion.correct]) {
            optionButtons[currentQuestion.correct].classList.add("correct");
        }
        if (feedbackText) feedbackText.innerHTML = `🔴 <b>Incorrecto.</b><br>${currentQuestion.explanation}`;
    }

    if (feedbackBox) feedbackBox.classList.remove("hidden");
}

function siguientePregunta() {
    currentQuestionIndex++;

    if (currentQuestionIndex < 25) {
        renderQuizQuestion();
    } else {
        finalizarQuiz();
    }
}

function finalizarQuiz() {
    const xpGanados = correctAnswersCount * 5; // 5 XP por acierto en Quizzes normales
    score += xpGanados;

    // Subida de nivel inteligente
    const targetLevel = Math.floor(score / 100) + 1;
    if (targetLevel > level) {
        level = targetLevel;
        alert(`🎉 ¡Increíble! Has subido al nivel ${level}`);
    }

    // Registrar módulo como completado si no estaba ya
    if (!completedModules.includes(currentModuleId)) {
        completedModules.push(currentModuleId);
    }

    saveUserData();
    updateDashboardUI();

    showPage("quiz-results");
    const resultsScore = document.getElementById("results-score");
    const resultsXp = document.getElementById("results-xp");
    if (resultsScore) resultsScore.innerText = `Puntaje final: ${correctAnswersCount} / 25`;
    if (resultsXp) resultsXp.innerText = `+${xpGanados} XP agregados a tu perfil`;
}

// =======================================
// SISTEMA DE PRÁCTICA LIBRE (CON XP)
// =======================================

// Extrae de forma dinámica todas las preguntas que existan dentro de tus módulos creados
function getAllModuleQuestions() {
    let questions = [];
    
    for (let id in window.modules) {
        const mod = window.modules[id];
        if (mod && mod.quizzes) {
            ['facil', 'medio', 'dificil', 'extremo'].forEach(diff => {
                if (mod.quizzes[diff] && Array.isArray(mod.quizzes[diff])) {
                    mod.quizzes[diff].forEach(q => {
                        questions.push({
                            ...q,
                            moduleTitle: mod.title
                        });
                    });
                }
            });
        }
    }
    return questions;
}

function startPractice() {
    const allQuestions = getAllModuleQuestions();
    const container = document.getElementById("practiceContainer");

    if (!container) return;

    if (allQuestions.length === 0) {
        container.innerHTML = `
            <div class="resultBox" style="text-align: center; padding: 40px 20px;">
                <p>⚠️ No se encontraron preguntas cargadas en los módulos.</p>
                <p>Asegúrate de haber guardado tus archivos de temas en la carpeta 'modules/'.</p>
            </div>
        `;
        return;
    }

    currentPracticeQuestion = 0;
    practiceCorrectAnswers = 0;
    
    // Barajamos todas las preguntas globales y extraemos una tanda de 15 preguntas
    practiceQuestions = shuffleArray([...allQuestions]).slice(0, 15);

    loadPracticeQuestion();
}

function loadPracticeQuestion() {
    const container = document.getElementById("practiceContainer");
    if (!container) return;

    const question = practiceQuestions[currentPracticeQuestion];

    if (!question) {
        finishPractice();
        return;
    }

    // Código HTML limpio usando las clases del CSS
    container.innerHTML = `
        <div class="practice-card">
            <div class="practice-header">
                <span class="practice-number">Pregunta ${currentPracticeQuestion + 1} de ${practiceQuestions.length}</span>
                <span class="practice-tag">${question.moduleTitle}</span>
            </div>
            <h2 class="practice-title">${question.question}</h2>
            <div id="practiceAnswers" class="practice-grid"></div>
            <div id="practiceExplanation" class="practice-feedback" style="display: none;"></div>
        </div>
    `;

    const answersContainer = document.getElementById("practiceAnswers");

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "practice-btn"; 
        button.innerText = option;
        button.onclick = () => checkPracticeAnswer(index);
        answersContainer.appendChild(button);
    });
}

function checkPracticeAnswer(selectedIndex) {
    const question = practiceQuestions[currentPracticeQuestion];
    const buttons = document.querySelectorAll("#practiceAnswers .practice-btn");
    const explanationDiv = document.getElementById("practiceExplanation");

    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedIndex === question.correct;

    if (isCorrect) {
        buttons[selectedIndex].classList.add("correct");
        practiceCorrectAnswers++;
        
        // Sumamos XP de práctica
        score += 10;

        // Validar subida de nivel
        const targetLevel = Math.floor(score / 100) + 1;
        if (targetLevel > level) {
            level = targetLevel;
            alert(`🎉 ¡Increíble! Has subido al nivel ${level}`);
        }
        
        saveUserData();
        updateDashboardUI();

        explanationDiv.className = "practice-feedback feedback-correct";
        explanationDiv.innerHTML = `
            <div class="feedback-text">
                <h3>✅ ¡Excelente trabajo! (+10 XP)</h3>
                <p>${question.explanation}</p>
            </div>
        `;
    } else {
        buttons[selectedIndex].classList.add("incorrect");
        if (buttons[question.correct]) {
            buttons[question.correct].classList.add("correct");
        }

        explanationDiv.className = "practice-feedback feedback-incorrect";
        explanationDiv.innerHTML = `
            <div class="feedback-text">
                <h3>❌ Respuesta incorrecta</h3>
                <p>${question.explanation}</p>
            </div>
        `;
    }

    explanationDiv.style.display = "block";

    // Botón Siguiente Pregunta integrado limpiamente
    const nextButton = document.createElement("button");
    nextButton.className = "primaryButton";
    nextButton.style.marginTop = "20px";
    nextButton.innerHTML = "Siguiente Pregunta ➜";
    
    nextButton.onclick = () => {
        currentPracticeQuestion++;
        loadPracticeQuestion();
    };
    explanationDiv.appendChild(nextButton);
}

function finishPractice() {
    const container = document.getElementById("practiceContainer");
    if (!container) return;
    
    const percent = Math.round((practiceCorrectAnswers / practiceQuestions.length) * 100);
    const xpGained = practiceCorrectAnswers * 10;

    container.innerHTML = `
        <div class="practice-card" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 3.5rem; margin-bottom: 15px;">🏆</div>
            <h2 style="font-size: 2rem; margin-bottom: 10px; font-weight: 800;">¡Práctica Completada!</h2>
            
            <div style="width: 110px; height: 110px; border-radius: 50%; background-color: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; margin: 25px auto; box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);">
                <span>${percent}%</span>
            </div>
            
            <p style="font-size: 1.15rem; line-height: 1.6; margin-bottom: 30px; color: var(--text-color);">
                Respondiste correctamente <strong>${practiceCorrectAnswers}</strong> de <strong>${practiceQuestions.length}</strong> preguntas.<br>
                Has sumado un total de <strong style="color: #eab308;">+${xpGained} XP</strong> en esta sesión.
            </p>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button class="primaryButton" onclick="startPractice()">Repetir Práctica</button>
                <button class="secondaryButton" onclick="showPage('course')">Ir al Curso</button>
            </div>
        </div>
    `;
}

function checkPracticeAnswer(selectedIndex) {
    const question = practiceQuestions[currentPracticeQuestion];
    const buttons = document.querySelectorAll("#practiceAnswers .quiz-option-btn");
    const explanationDiv = document.getElementById("practiceExplanation");

    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedIndex === question.correct;

    if (isCorrect) {
        buttons[selectedIndex].classList.add("correct");
        practiceCorrectAnswers++;
        
        // ¡Suma de Experiencia de Práctica! (+10 XP)
        score += 10;

        // Validar subida de nivel
        const targetLevel = Math.floor(score / 100) + 1;
        if (targetLevel > level) {
            level = targetLevel;
            alert(`🎉 ¡Increíble! Has subido al nivel ${level}`);
        }
        
        saveUserData();
        updateDashboardUI();

        explanationDiv.style.backgroundColor = "#f0fff4";
        explanationDiv.style.borderLeft = "5px solid #38a169";
        explanationDiv.style.color = "#276749";
        explanationDiv.innerHTML = `
            <h3 style="margin: 0 0 5px 0; color: #2f855a;">✅ ¡Excelente trabajo! (+10 XP)</h3>
            <p style="margin: 0;">${question.explanation}</p>
        `;
    } else {
        buttons[selectedIndex].classList.add("incorrect");
        if (buttons[question.correct]) {
            buttons[question.correct].classList.add("correct");
        }

        explanationDiv.style.backgroundColor = "#fff5f5";
        explanationDiv.style.borderLeft = "5px solid #e53e3e";
        explanationDiv.style.color = "#9b2c2c";
        explanationDiv.innerHTML = `
            <h3 style="margin: 0 0 5px 0; color: #c53030;">❌ Respuesta incorrecta</h3>
            <p style="margin: 0;">${question.explanation}</p>
        `;
    }

    explanationDiv.style.display = "block";

    const nextButton = document.createElement("button");
    nextButton.className = "nextButton";
    nextButton.style.display = "block";
    nextButton.style.marginTop = "15px";
    nextButton.style.padding = "10px 20px";
    nextButton.style.backgroundColor = "#3182ce";
    nextButton.style.color = "white";
    nextButton.style.border = "none";
    nextButton.style.borderRadius = "6px";
    nextButton.style.cursor = "pointer";
    nextButton.style.fontWeight = "bold";
    nextButton.innerHTML = "Siguiente Pregunta ➜";
    
    nextButton.onclick = () => {
        currentPracticeQuestion++;
        loadPracticeQuestion();
    };
    explanationDiv.appendChild(nextButton);
}

function finishPractice() {
    const container = document.getElementById("practiceContainer");
    if (!container) return;
    
    const percent = Math.round((practiceCorrectAnswers / practiceQuestions.length) * 100);
    const xpGained = practiceCorrectAnswers * 10;

    container.innerHTML = `
        <div class="resultBox" style="text-align: center; padding: 40px 20px;">
            <div class="resultIcon" style="font-size: 3rem; margin-bottom: 15px;">🎉</div>
            <h2 style="font-size: 1.8rem; margin-bottom: 10px;">¡Práctica Completada!</h2>
            <div class="scoreCircle" style="width: 100px; height: 100px; border-radius: 50%; background-color: #3182ce; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; margin: 20px auto;">
                <span>${percent}%</span>
            </div>
            <p style="font-size: 1.1rem; color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
                Respondiste correctamente <strong>${practiceCorrectAnswers}</strong> de <strong>${practiceQuestions.length}</strong> preguntas.<br>
                Has ganado un total de <strong style="color: #d69e2e;">+${xpGained} XP</strong> en esta sesión.
            </p>
            <div>
                <button class="primaryButton" onclick="startPractice()" style="margin-right: 10px; padding: 10px 20px;">Repetir Práctica</button>
                <button class="secondaryButton" onclick="showPage('course')" style="padding: 10px 20px;">Ir al Curso</button>
            </div>
        </div>
    `;
}

// =======================================
// UTILIDADES COMPARTIDAS
// =======================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Inicializar la App
window.onload = () => {
    loadUserData();
};
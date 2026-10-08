// ===== 题库数据 =====
const quizData = [
    {
        question: "HTML中表示一级标题的标签是？",
        options: ["<head>", "<h1>", "<title>", "<header>"],
        answer: 1
    },
    {
        question: "CSS中选择id为box的元素的写法是？",
        options: [".box { }", "#box { }", "*box { }", "box { }"],
        answer: 1
    },
    {
        question: "JavaScript中声明变量的关键字是？（ES6推荐）",
        options: ["var", "let", "const", "以上都是"],
        answer: 3
    },
    {
        question: "下列哪个是CSS中设置文字颜色的属性？",
        options: ["text-color", "font-color", "color", "background-color"],
        answer: 2
    },
    {
        question: "JavaScript中 typeof null 的结果是？",
        options: ["null", "undefined", "object", "string"],
        answer: 2
    },
    {
        question: "HTML5中用于播放视频的标签是？",
        options: ["<movie>", "<media>", "<video>", "<play>"],
        answer: 2
    },
    {
        question: "CSS中 Flex 布局的主轴方向由哪个属性控制？",
        options: ["justify-content", "align-items", "flex-direction", "flex-wrap"],
        answer: 2
    },
    {
        question: "下列哪个不是JavaScript的数据类型？",
        options: ["Number", "String", "Boolean", "Float"],
        answer: 3
    },
    {
        question: "在JavaScript中，== 和 === 的区别是？",
        options: ["没有区别", "=== 只比较值", "=== 既比较值也比较类型", "== 比较类型"],
        answer: 2
    },
    {
        question: "CSS中设置元素圆角的属性是？",
        options: ["border-radius", "corner-radius", "round-corner", "border-corner"],
        answer: 0
    }
];

// ===== 状态变量 =====
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let selectedOption = null;

// ===== DOM 元素 =====
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const currentNum = document.getElementById("currentNum");
const totalNum = document.getElementById("totalNum");
const currentScore = document.getElementById("currentScore");
const progressFill = document.getElementById("progressFill");
const finalScore = document.getElementById("finalScore");
const finalTotal = document.getElementById("finalTotal");
const resultMessage = document.getElementById("resultMessage");
const resultDetails = document.getElementById("resultDetails");
const resultIcon = document.getElementById("resultIcon");

// ===== 初始化 =====
totalNum.textContent = quizData.length;
document.getElementById("totalQuestions").textContent = quizData.length;
finalTotal.textContent = quizData.length;

// ===== 开始答题 =====
startBtn.addEventListener("click", function () {
    startScreen.style.display = "none";
    quizScreen.style.display = "block";
    loadQuestion();
});

// ===== 加载题目 =====
function loadQuestion() {
    selectedOption = null;
    nextBtn.disabled = true;
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? "查看结果" : "下一题";

    const q = quizData[currentQuestion];
    questionText.textContent = `${currentQuestion + 1}. ${q.question}`;

    currentNum.textContent = currentQuestion + 1;
    currentScore.textContent = score;

    const progress = ((currentQuestion) / quizData.length) * 100;
    progressFill.style.width = progress + "%";

    optionsContainer.innerHTML = "";
    const labels = ["A", "B", "C", "D"];

    q.options.forEach((option, index) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerHTML = `
            <span class="option-label">${labels[index]}</span>
            <span class="option-text">${option}</span>
        `;
        div.addEventListener("click", () => selectOption(div, index));
        optionsContainer.appendChild(div);
    });
}

// ===== 选择选项 =====
function selectOption(element, index) {
    document.querySelectorAll(".option").forEach(opt => {
        opt.classList.add("disabled");
    });

    const correctIndex = quizData[currentQuestion].answer;

    if (index === correctIndex) {
        element.classList.add("correct");
        score++;
        currentScore.textContent = score;
        userAnswers.push({ question: currentQuestion, selected: index, correct: true });
    } else {
        element.classList.add("wrong");
        document.querySelectorAll(".option")[correctIndex].classList.add("correct");
        userAnswers.push({ question: currentQuestion, selected: index, correct: false });
    }

    nextBtn.disabled = false;
    selectedOption = index;
}

// ===== 下一题 =====
nextBtn.addEventListener("click", function () {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

// ===== 显示结果 =====
function showResult() {
    quizScreen.style.display = "none";
    resultScreen.style.display = "block";

    progressFill.style.width = "100%";
    finalScore.textContent = score;

    const percentage = (score / quizData.length) * 100;

    if (percentage === 100) {
        resultIcon.textContent = "🏆";
        resultMessage.textContent = "满分！你是知识达人！";
    } else if (percentage >= 70) {
        resultIcon.textContent = "🎉";
        resultMessage.textContent = "优秀！表现很棒！";
    } else if (percentage >= 50) {
        resultIcon.textContent = "👍";
        resultMessage.textContent = "及格了，继续加油！";
    } else {
        resultIcon.textContent = "💪";
        resultMessage.textContent = "还需努力，再试一次吧！";
    }

    resultDetails.innerHTML = "";
    userAnswers.forEach((ans, i) => {
        const item = document.createElement("div");
        item.className = "detail-item";
        const q = quizData[ans.question];
        const correctText = q.options[q.answer];
        item.innerHTML = `
            <span>第${i + 1}题</span>
            <span class="detail-status ${ans.correct ? "detail-correct" : "detail-wrong"}">
                ${ans.correct ? "✅ 正确" : "❌ 答案: " + correctText}
            </span>
        `;
        resultDetails.appendChild(item);
    });
}

// ===== 重新开始 =====
restartBtn.addEventListener("click", function () {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    selectedOption = null;
    resultScreen.style.display = "none";
    startScreen.style.display = "block";
    progressFill.style.width = "0%";
});

// ===== 键盘快捷键 =====
document.addEventListener("keydown", function (e) {
    if (quizScreen.style.display === "none") return;

    const keys = ["1", "2", "3", "4"];
    const index = keys.indexOf(e.key);

    if (index !== -1 && !nextBtn.disabled) return;

    if (index !== -1) {
        const options = document.querySelectorAll(".option");
        if (options[index] && !options[index].classList.contains("disabled")) {
            options[index].click();
        }
    }

    if (e.key === "Enter" && !nextBtn.disabled) {
        nextBtn.click();
    }
});

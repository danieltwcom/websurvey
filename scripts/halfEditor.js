$(document).ready(function () {
    var surveyTitle = document.getElementById("survey-title").value;
    var addQ = document.getElementById("addQuestion");
    var QuestCon = document.getElementById("questionsContainer");
    var questChoose = document.getElementById("questionChooser");
    var selectQ = document.getElementById("question1");
    var createBtn = document.getElementById("create-button");

    var choices = [{
        "id": "multChoice",
        "name": "Multiple Choice"
    }, {
        "id": "trueFalse",
        "name": "True False"
    }, {
        "id": "shortAns",
        "name": "Short Answer"
    }, {
        "id": "ratingQuest",
        "name": "Rating Question"
    }, {
        "id": "multipleAnswer",
        "name": "Multiple Answers"
    }];
    var inc = 1;
    var surveyQuestions = [{
        "id": "question1",
        "type": "multChoice"
    }];
    var remQ = document.getElementById("removeQuestion");
    remQ.disabled = true;

    // Q1 sample button
    document.getElementById("q1").addEventListener("click", function () {
        changeQ("q1");
    });
    changeQ("q1");

    choices.forEach(function (Element) {
        var choice = document.createElement("button");
        choice.id = Element.id;
        choice.innerHTML = Element.name;
        choice.addEventListener("click", function () {
            selectType(choice.id);
        })
        document.getElementById("questionChoices").appendChild(choice);
    })

    function findQ(id) {
        var a = 0;
        var b = 0;
        surveyQuestions.forEach(function (Element) {
            if (id == Element.id) {
                b = a
            }
            a += 1;
        })
        return b;
    }

    function changeQ(qNum) {
        var num = parseInt(qNum.substr(1));
        selectQ.style.display = "none";
        selectQ = document.getElementById(surveyQuestions[num - 1].id);
        selectQ.style.display = "inline-block";
        if ($(selectQ).is(':empty')) {
            addQuestionPanel();
        }
    }

    function selectType(type) {
        selectQ.classList.forEach(function (Element) {
            if (Element != "question") {
                selectQ.classList.remove(Element);
            }
        })
        selectQ.classList.add(type);
        var position = findQ(selectQ.id);
        addQuestionPanel();

        surveyQuestions[position].type = type;
    }

    function deleteDiv() {
        $(this).parent().remove();
    }

    function addOption() {
        var $ansDivClone = $("#" + selectQTypePanel).find("#answer-div").clone(true);
        $ansDivClone.find("#option-delete-btn").on("click", deleteDiv);
        if (selectQ.classList.contains("ratingQuest")) {
            if (this.id == "option-add-row-btn") {
                $(selectQ).find("#answer-row").append($ansDivClone);
            } else {
                console.log("yes")
                $ansDivClone.find("#answer-option").removeClass();
                $ansDivClone.find("#answer-option").addClass("answer-option-col");
                $(selectQ).find("#answer-col").append($ansDivClone);
            }
        } else {
            $(selectQ).find("#answer-section").append($ansDivClone);
        }

    }

    function saveQuestion(question_w) {
        var question = $(question_w).find("#question").first();
        if (!question_w.classList.contains("ratingQuest")) {
            var answersArray = (function () {
                var answers = $(question_w).find(".answer-option");
                var a = [];
                for (i = 0; i < answers.length; i++) {
                    a.push(answers[i].value);
                }
                return a;
            })();
        } else {
            var answersArray = (function () {
                var answersRow = $(question_w).find(".answer-option-row");
                var row = [];
                var answersCol = $(question_w).find(".answer-option-col");
                var col = [];
                for (i = 0; i < answersRow.length; i++) {
                    row.push(answersRow[i].value);
                }
                for (i = 0; i < answersCol.length; i++) {
                    col.push(answersCol[i].value);
                }
                return [row, col];
            })();
        }

        surveyQuestions.forEach(function (Element) {
            if (Element.id == question_w.id) {
                Element.question = question[0].value;
                Element.answers = answersArray;
            }
        });
        console.log(surveyQuestions);
    }

    function addQuestionPanel() {
        selectQTypePanel = selectQ.className.split(" ")[1] + "-panel";
        var $panel = $('#' + selectQTypePanel).clone(true);
        $panel[0].id = selectQTypePanel + "-c"
        $(selectQ).children().remove();
        $(selectQ).append($panel);
        selectQ.firstChild.style.display = "block";

        // QuestionPanel Buttons LISTENER
        var $optionAddBtn = $(selectQ).find("#option-add-btn");
        var $saveButton = $(selectQ).find("#save-btn");
        var $deleteButton = $(selectQ).find("#option-delete-btn");
        var $addColBtn = $(selectQ).find("#option-add-col-btn");
        var $addRowBtn = $(selectQ).find("#option-add-row-btn");

        $deleteButton.on("click", deleteDiv);
        $optionAddBtn.on("click", addOption);
        $saveButton.on("click", saveQuestion(selectQ));
        $addColBtn.on("click", addOption);
        $addRowBtn.on("click", addOption);

    }

    addQ.addEventListener("click", function () {
        inc += 1;
        var q = surveyQuestions.length;
        var newQ = document.createElement("div");
        newQ.id = "question" + (inc);
        newQ.className = "question";
        newQ.classList.add("multChoice");
        QuestCon.appendChild(newQ);
        surveyQuestions.push({
            "id": newQ.id,
            "type": "multChoice"
        })
        var newQBut = document.createElement("button");
        newQBut.id = "q" + (surveyQuestions.length);
        newQBut.className = "questionBut";
        newQBut.innerHTML = "Q" + (surveyQuestions.length);

        // Question button LISTENER
        newQBut.addEventListener("click", function () {
            changeQ(newQBut.id);

        });
        changeQ(newQBut.id);
        questChoose.appendChild(newQBut);

        remQ.disabled = false;
        if (surveyQuestions.length > 9) {
            this.disabled = true;
        }
    })

    remQ.addEventListener("click", function () {

        addQ.disabled = false;
        var a = 0;
        var b = 0;
        document.getElementById("q" + surveyQuestions.length).remove();
        surveyQuestions.forEach(function (Element) {
            if (Element.id == selectQ.id) {
                surveyQuestions.splice(a, 1);
                b = a;
            } else {
                a += 1;
            }
        })
        selectQ.remove();

        // select next question
        if (b > surveyQuestions.length - 1) {
            selectQ = document.getElementById(surveyQuestions[b - 1].id);
            changeQ("q" + (b));
        } else {
            selectQ = document.getElementById(surveyQuestions[b].id);
            changeQ("q" + (b + 1));
        }

        if (surveyQuestions.length < 2) {
            this.disabled = true;
            return;
        }

    })

    createBtn.addEventListener("click", function () {
        $(".question").each(function () {
            saveQuestion(this);
        });

        $.ajax({
            url: "/createSurvey",
            type: "post",
            data: {
                name: surveyTitle,
                questions: surveyQuestions
            },
            success: function (resp) {
                console.log(resp);
            }
        });
    })

})
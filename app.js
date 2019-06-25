var ddiv = $("#display");
var adiv = $("#answer");
var qdiv = $("#question");
var tdiv = $("#time");
var time = "63";
tdiv.html("Time: " + time);

var tick = function tick() {
  time--;
  tdiv.html("Time: " + time);

  if (time == 0) {
    tdiv.html("out of time");
    game.end();
  }
};

var game = {
  easy: ["1+1+1", "1*(1+1)", "(1-1)*(1+1)", "(1-1)+(1+1)", "1-1-1-1", "(1+1-1)*1", "(1/1)+(1*1)", "(1+1)+(1+1)", "((1*(1-1)+1))"],
  medium: ["1+1-1-1+1", "(1*(1+1))*(1-1)+1", "(1+1)*(1-((1+1)*1))", "(1+1) / (1-(1+1+1))", "1+1-1+1-1+1", "(1+1)-(1-1)-(1+1)"],
  hard: ["1+1+1+1-1+1-1-1", "(2*(1+2))*(1-2)+1", "2*(1+2)-2*(2-1)+2-1", "((2+1)-2) / ((2-1)+2+1+1)", "2*(1+2)+1*(2+1)-1", "((1+2)/(2-1))+1-2"],
  submit_answer: function submit_answer() {
    event.preventDefault();
    var player_answer = $("#player_answer").val(); //if right
    if (player_answer == eval(game.current_answer)) {
      var dong = new Audio("assets/Dong.wav");
      dong.play();
      game.correct++;
      var questionlog = {};
      questionlog.question = game.current_question;
      questionlog.answer = game.current_answer;
      questionlog.playeranswer = player_answer;
      questionlog.difficulty = game.current_difficulty;
      questionlog.correct = true;
      game.log.push(questionlog);
      clear();
      ddiv.append("Correct!<br>");
      ddiv.append(game.current_question + " = " + game.current_answer);

      if (game.correct == 2) {
        game.current_difficulty = "medium";
      }

      if (game.correct == 4) {
        game.current_difficulty = "hard";
      }

      if (game.correct == 6) {
        game.win = true;
        return game.end();
      }
    } //if wrong
    else {
        game.incorrect++;
        var _questionlog = {};
        _questionlog.question = game.current_question;
        _questionlog.answer = game.current_answer;
        _questionlog.playeranswer = player_answer;
        _questionlog.difficulty = game.current_difficulty;
        _questionlog.correct = false;
        game.log.push(_questionlog);

        if (game.incorrect > 2) {
          return game.end();
        }
      }
    game.new_question();
  },
  new_question: function new_question() {
    event.preventDefault();
    clear();
    ddiv.append("Right: ".concat(game.correct), "<br>");
    ddiv.append("Wrong: ".concat(game.incorrect), "<br>");
    var rand = Math.floor(Math.random() * game[game.current_difficulty].length);
    game.current_question = game[game.current_difficulty][rand];
    game.current_answer = eval(game.current_question);
    qdiv.append(game.current_question + " =");
    var form = $("<input>").attr("type", "text").attr("id", "player_answer");
    var btn = $("<button>").html("submit").on("click", game.submit_answer);
    adiv.append(form).append("<br>").append(btn);
    $("#player_answer").focus();
    game[game.current_difficulty].splice(rand, 1);
  },
  start: function start() {
    theTimer = setInterval(function () {
      return tick();
    }, 1000);
    game.new_question();
  },
  end: function end() {
    clear();
    clearInterval(theTimer);
    console.log(game.log);
    if (game.win) {
      ddiv.append("Great Job");
    } else {
      ddiv.append("Try Again");
      var btn = $("<button>");
      btn.addClass("hexagon");
      btn.html("Start");
      btn.on("click", initiate);
      ddiv.append(btn);
    }
    game.log.forEach(function (item) {
      var div = $("<div>");
      div.append("<hr>");
      div.append("".concat(item.question, " = ").concat(item.answer, "<br>"));
      if (!item.correct) {
        div.css("color", "red");
        div.append("You answered: ".concat(item.playeranswer));
        div.append("<br>");
      }
      div.append("difficulty: ".concat(item.difficulty));
      ddiv.append(div); //ddiv.append(JSON.stringify(item))
    });
    ddiv.append("<hr>");
  }
}; //Test to make sure the questions can be evaluated into number answers
var testQuestions = function testQuestions() {
  questionsArr = ["easy", "medium", "hard"];
  questionsArr.forEach(function (questionType) {
    game[questionType].forEach(function (question) {
      console.log("question :", question);
      console.log("answer :", eval(question));
    });
  });
}; //set game initial conditions
var initiate = function initiate() {
  time = "63";
  tdiv.html("time: " + time);
  game.current_difficulty = "easy";
  game.current_question = null;
  game.current_answer = null;
  game.correct = 0;
  game.incorrect = 0;
  game.win = false;
  game.log = [];
  clear();
  var btn = $("<button>");
  btn.html("Start");
  btn.on("click", game.start);
  var div = $("#display");
  div.append("Evaluate the expressions");
  div.append("<br>");
  div.append(btn);
  var p = $("<p>").css("font-size", "0.6em");
  p.append("Use the enter key to submit answers. All answers must be in decimal form.");
  p.append("<br>");
  p.append("Get 6 right in 63 seconds to win, get 3 wrong to lose. Questions get harder after every 2 you get right.");
  p.append("<br>");
  p.append("The answers to the questions will be shown after you complete the problem set.");
  p.append("<br>");
  p.append("<br>");
  div.append(p);
}; //clear displays


var clear = function clear() {
  ddiv.empty();
  adiv.empty();
  qdiv.empty();
}; //testQuestions()


initiate();
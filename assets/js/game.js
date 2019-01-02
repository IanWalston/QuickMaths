let ddiv = $("#display")
let adiv = $("#answer")
let qdiv = $("#question")
let tdiv = $("#time")
let theTime = ""

let time = "63"
tdiv.html("time: " + time)

const tick = () => {
    time--
    tdiv.html("time: " + time)
    if (time == 0) {
        tdiv.html("out of time")
        game.end()
    }
}

let game = {
    'easy': ['1+1+1', '1*(1+1)', '(1-1)*(1+1)', '(1-1)+(1+1)', '1-1-1-1', '(1+1-1)*1', '(1/1)+(1*1)', '(1+1)+(1+1)', '((1*(1-1)+1))'],
    'medium': ['1+1-1-1+1', '(1*(1+1))*(1-1)+1', '(1+1)*(1-((1+1)*1))', '(1+1) / (1-(1+1+1))', '1+1-1+1-1+1', '(1+1)-(1-1)-(1+1)'],
    'hard': ['1+1+1+1-1+1-1-1', '(2*(1+2))*(1-2)+1', '2*(1+2)-2*(2-1)+2-1', '((2+1)-2) / ((2-1)+2+1+1)', '2*(1+2)+1*(2+1)-1', '((1+2)/(2-1))+1-2'],

    'submit_answer': () => {
        event.preventDefault()
        let player_answer = $("#player_answer").val()

        //if right
        if (player_answer == eval(game.current_answer)) {
            var dong = new Audio('assets/Dong.wav');
            dong.play();

            game.correct++
            let questionlog = {}
            questionlog.question = game.current_question
            questionlog.answer = game.current_answer
            questionlog.playeranswer = player_answer
            questionlog.difficulty = game.current_difficulty
            questionlog.correct = true
            game.log.push(questionlog)
            clear()
            ddiv.append("Correct!<br>")
            ddiv.append(game.current_question + ' = ' + game.current_answer)
            if (game.correct == 2) {
                game.current_difficulty = 'medium'
            }
            if (game.correct == 4) {
                game.current_difficulty = 'hard'
            }
            if (game.correct == 6) {
                game.win = true
                return game.end()
            }

        }

        //if wrong 
        else {
            game.incorrect++
            let questionlog = {}
            questionlog.question = game.current_question
            questionlog.answer = game.current_answer
            questionlog.playeranswer = player_answer
            questionlog.difficulty = game.current_difficulty
            questionlog.correct = false
            game.log.push(questionlog)
            if (game.incorrect > 2) {
                return game.end()
            }
        }
        game.new_question()
    },

    'new_question': () => {
        event.preventDefault()
        clear()

        ddiv.append(`Right: ${game.correct}`, "<br>")
        ddiv.append(`Wrong: ${game.incorrect}`, "<br>")

        let rand = Math.floor(Math.random() * (game[game.current_difficulty].length - 1))

        //game[game.current_difficulty].splice(rand, 1)

        game.current_question = (game[game.current_difficulty][rand]);
        game.current_answer = eval(game.current_question)

        qdiv.append(game.current_question + " =")

        let form = $("<input>").attr("type", "text").attr("id", "player_answer")
        let btn = $("<button>").html("submit").on("click", game.submit_answer)
        adiv.append(form).append("<br>").append(btn)

        $("#player_answer").focus()
    },

    "start": () => {
        theTimer = setInterval(() => tick(), 1000)
        game.new_question()

    },

    "end": () => {
        clear()
        clearInterval(theTimer)
        console.log(game.log)

        if (game.win) {
            ddiv.append("Great Job")
        }
        else {
            ddiv.append("Try Again")
            let btn = $("<button>")
            btn.html("Start")
            btn.on("click", initiate)
            ddiv.append(btn)
        }

        game.log.forEach(item => {
            let div = $("<div>")
            div.append("<hr>")
            div.append(`${item.question} = ${item.answer}<br>`)

            if (!item.correct) {
                div.css('color', 'red')
                div.append(`You answered: ${item.playeranswer}`)
                div.append('<br>')
            }
            div.append(`difficulty: ${item.difficulty}`)

            ddiv.append(div)
            //ddiv.append(JSON.stringify(item))    
        })
        ddiv.append("<hr>")
    },

}

//Test to make sure the questions can be evaluated into number answers
const testQuestions = () => {
    questionsArr = ['easy', 'medium', 'hard']

    questionsArr.forEach(questionType => {
        game[questionType].forEach(question => {
            console.log('question :', question);
            console.log('answer :', eval(question));
        });
    });
}

//set game initial conditions
const initiate = () => {
    game.current_difficulty = 'easy'
    game.current_question = null
    game.current_answer = null

    game.correct = 0
    game.incorrect = 0
    game.win = false

    game.log = []
    clear()

    let btn = $("<button>")
    btn.html("Start")
    btn.on("click", game.start)

    let div = $("#display")
    div.append("Evaluate the expressions")
    div.append("<br>")
    div.append(btn)

    let p = $("<p>").css("font-size", "0.6em")
    p.append("Use the enter key to submit answers. All answers must be in decimal form.")
    p.append("<br>")
    p.append("Get 6 right in 63 seconds to win, get 3 wrong to lose. Questions get harder after every 2 you get right.")
    p.append("<br>")
    p.append("The answers to the questions will be shown after you complete the problem set.")
    p.append("<br>")
    p.append("<br>")

    div.append(p)
}

//clear displays
const clear = () => {
    ddiv.empty()
    adiv.empty()
    qdiv.empty()
}

//testQuestions()
initiate()
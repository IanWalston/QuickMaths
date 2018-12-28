let game = {

    'easy': ['1+1+1', '1*(1+1)', '(1-1)*(1+1)', '(1-1)+(1+1)'],
    'medium': ['1+1-1-1+1', '(1*(1+1))*(1-1)+1', '(1+1)*(1-((1+1)*1))', '(1+1) / (1-(1+1+1))'],
    'hard': ['1+1+1+1-1+1-1-1', '(2*(1+2))*(1-2)+1', '2*(1+2)-2*(2-1)+2-1', '((2+1)-2) / ((2-1)+2+1+1)'],

    'current_difficulty': 'easy',
    'current_question': null,
    'current_answer': null,

    'correct': 0,
    'incorrect': 0,

    'answer_correctly': ()=>{game.correct++},
    'answer_incorrectly': ()=>{game.incorrect++},

    'submit_answer': ()=>{
        event.preventDefault()
        console.log($("#player_answer").val()==game.current_answer)
        game.new_question()
    },

    'new_question':()=>{
        event.preventDefault()
        $("#display").empty()
        $("#answer").empty()
        $("#question").empty()
        
        const rand = Math.floor(Math.random()*(4))
        
        game.current_question = (game[game.current_difficulty][rand]);
        game.current_answer = eval(game.current_question)
        
        let qdiv = $("#question")
        qdiv.append(game.current_question)
        
        let adiv = $("#answer")
        let form = $("<input>").attr("type","text").attr("id","player_answer")
        let btn = $("<button>").html("submit").on("click",game.submit_answer)
        adiv.append(form).append("<br>").append(btn)
        
        $("#player_answer").focus()
       
    }
    
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
let initiate = () => {
    
    let btn = $("<button>")
    btn.html("Start")
    btn.on("click", game.new_question)
    
    let div = $("#display")
    div.append("Evaluate the expressions")
    div.append("<br>")
    div.append(btn)
}

testQuestions()
initiate()
class Quiz{
    constructor(rootQuiz,quizJson){
        this.rootQuiz = rootQuiz;
        this.quizJson = quizJson;

        this.titleQuiz = document.createElement("div")
        this.titleQuiz.classList.add("quiz-title")

        this.titleQuizSpan = document.createElement("span")
        this.titleQuizSpan.classList.add("quiz-span")

        this.titleQuizPergunta = document.createElement("p")
        this.titleQuizPergunta.classList.add("quiz-pergunta")
        
        this.alternativasQuizContainer = document.createElement("div")
        this.alternativasQuizContainer.classList.add("quiz-alternativas-container")

        this.input_a = document.createElement("input")
        this.input_a.classList.add("quiz-alternativa-input")
        this.input_a.type = "radio"
        this.input_a.name = "quiz-alternativa"
        this.input_a.id = "alternativa-a"


        this.input_b = document.createElement("input")
        this.input_b.classList.add("quiz-alternativa-input")
        this.input_b.type = "radio"
        this.input_b.name = "quiz-alternativa"
        this.input_b.id = "alternativa-b"

        
        this.input_c = document.createElement("input")
        this.input_c.classList.add("quiz-alternativa-input")
        this.input_c.type = "radio"
        this.input_c.name = "quiz-alternativa"
        this.input_c.id = "alternativa-c"


        this.input_d = document.createElement("input")
        this.input_d.classList.add("quiz-alternativa-input")
        this.input_d.type = "radio"
        this.input_d.name = "quiz-alternativa"
        this.input_d.id = "alternativa-d"


        this.inputs_alternativas_list = [this.input_a,this.input_b,this.input_c,this.input_d]
        
        this.label_a = document.createElement("label")
        this.label_a.classList.add("quiz-alternativa-label")
        this.label_a.id = "alternativa-label-a"

        this.label_b = document.createElement("label")
        this.label_b.classList.add("quiz-alternativa-label")
        this.label_b.id = "alternativa-label-b"
        
        this.label_c = document.createElement("label")
        this.label_c.classList.add("quiz-alternativa-label")
        this.label_c.id = "alternativa-label-c"

        this.label_d = document.createElement("label")
        this.label_d.classList.add("quiz-alternativa-label")
        this.label_d.id = "alternativa-label-d"

        this.labels_alternativas_list = [this.label_a,this.label_b,this.label_c,this.label_d]

        this.buttonSubmit = document.createElement("button")
        this.buttonSubmit.classList.add("quiz-button")
        this.buttonSubmit.classList.add("quiz-submit")
        this.buttonSubmit.innerText = "confirmar"

        this.score = 0;
        this.current = 0;
        this.pergunta_atual;
        this.json;
          
        this.pegarPerguntas()
        this.buttonSubmit.addEventListener("click",()=>{
            this.alternativa_escolhida = this.pegarEscolha()
            if(this.alternativa_escolhida){
                if(this.alternativa_escolhida == this.pergunta_atual.correta){
                    this.score+=10
                }
                this.current++

                if(this.current < this.json.length){
                    this.constructorPergunta()
                }else{
                    this.finish()
                }
            }else{
                this.alertError()
            }
        })
    }

    async pegarPerguntas(){
        this.response = await fetch(this.quizJson)
        this.data = await this.response.json()
        this.json = await this.data.perguntas;
        this.constructorQuizHTML()
    }
    constructorAlertError(){
        this.alert = document.createElement("div")
        this.alert.innerHTML = `<img src="assets/icons/alert.svg" class="quiz-icon"/> <p>Escolha uma alternativa para continuar</p>`
        this.alert.classList.add("quiz-alert-error")

        this.rootQuiz.appendChild(this.alert);
    }
    removeAlert(){
        this.alert.style.display = "none"
    }
    alertError(){
        if(this.close){ clearInterval(this.close) }
        this.close = setTimeout(()=> this.alert.style.display = "none",10000)
        this.alert.style.display = "flex"
    }
    constructorInputs(){
        this.inputs_alternativas_list.forEach(input =>{
            this.alternativaQuizItem = document.createElement("div")
            this.alternativaQuizItem.classList.add("quiz-alternativa-item")

            this.alternativasQuizContainer.appendChild(this.alternativaQuizItem)
            this.alternativaQuizItem.appendChild(input)
            this.alternativaQuizItem.appendChild(this.labels_alternativas_list[this.inputs_alternativas_list.indexOf(input)])
        })
    }
    constructorQuizHTML(){
        this.constructorAlertError()
        this.titleQuiz.appendChild(this.titleQuizSpan)
        this.titleQuiz.appendChild(this.titleQuizPergunta)
        
        this.constructorInputs()
            
        this.rootQuiz.appendChild(this.titleQuiz);
        this.rootQuiz.appendChild(this.alternativasQuizContainer);
        this.rootQuiz.appendChild(this.buttonSubmit)

        this.constructorPergunta()
    }
    
    finish(){
        this.counter = 0;
        this.timer = setInterval(()=>{
            if(this.counter == this.score){
                clearInterval(this.timer)
            } 

            this.rootQuiz.innerHTML = `<div class="quiz-result"><p>Você acertou ${this.counter}%</p><button class="quiz-button quiz-submit" onclick="window.location.reload();">Refazer</button></div>`
            this.counter++
        },10) 
    }
    constructorPergunta(){
        this.removerEscolha()
        this.pergunta_atual = this.json[this.current]
        this.titleQuizPergunta.innerText = this.pergunta_atual.pergunta
        this.titleQuizSpan.innerText = `${this.pergunta_atual.id}/${this.json.length}`
        this.adicionarAlternativas()
        this.removeAlert()
    }

    adicionarAlternativas(){
        this.count = 0;
        Object.entries(this.pergunta_atual.alternativas)
        .forEach(([key,value])=>{
            this.labels_alternativas_list[this.count].innerText = value
            this.count++
        })
    }
    removerEscolha(){
        this.inputs_alternativas_list.forEach(input => input.checked = false)
    }

    pegarEscolha(){
        this.alternativa_escolhida_temp=null;
        this.inputs_alternativas_list.forEach(alternativa=>{
            if(alternativa.checked){
                this.alternativa_escolhida_temp = alternativa.id
            }
        })
        return this.alternativa_escolhida_temp
    }
    
}

window.onload = ()=>{
    let quiz;
    document.getElementById("rootQuiz") == null || document.getElementById("rootQuiz") == undefined 
    ? alert("Error: defina rootQuiz sozinho")
    : quiz = new Quiz(document.getElementById("rootQuiz"),document.getElementById("rootQuiz").getAttribute("quiz"))
    document.getElementById("loader").style.display = "none";
}


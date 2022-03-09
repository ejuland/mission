let script = [
    {
        message: `Passcode:`,
        validResponses: ["milo"],
        invalidResponses: ["Not even close..."]
    },{
        message: `Welcome Agent. <br> If a tree falls in the forest, and there is no one there to hear it, does it make a sound?`,
        validResponses: ["milo"],
        invalidResponses: ["Not even close..."]
    }
]

let stage = 0;


function revealToConsole(message) {
    return new Promise((finished, error) => {
        let textbox = document.createElement("div");
        document.getElementById("console").appendChild(textbox);
        let displayChar = (char, done) => {
            textbox.innerHTML += char;
            setTimeout(() => {
                done();
            }, char.match(/\.|\,|\!|\?/g) ? 200 : 10 - (Math.random() * 10))
        }

        let displayMessage = (message) => {
            console.log(message);
            if (message.length <= 0) {
                finished();
                return;
            }
            let char = message[0];
            displayChar(char, () => {
                chirp().then(() => {
                    displayMessage(message.substr(1));
                });
            })
        }

        displayMessage(message);
    });
}


function chirp() {
    return new Promise(res => {
        var audio = new Audio('beep.mp3');
        audio.loop = false;
        let finished = () => {
            audio.removeEventListener("ended",finished);
            res();
        }
        audio.play();
        audio.addEventListener("ended", finished);
    })
}

function getInput(prompt, correctResponses, incorrectResponses) {
    console.log(correctResponses)
    return new Promise((responseCorrect, error) => {
        let userResponseCorrect = (res) => {
            let responseFound = false;
            for (let i in correctResponses) {
                if (correctResponses[i].match(new RegExp(res, "ig"))) {
                    responseFound = true;
                    break;
                }
            }

            return responseFound;
        }

        let resposeListener = (e) => {
            if (e.code === "Enter") {
                let responseFound = (userResponseCorrect(e.target.value));
                if (responseFound) {
                    document.getElementById("input").removeEventListener("keydown", resposeListener);
                    responseCorrect();
                    console.log("correct");
                    document.getElementById("input").classList.add("hidden");
                    document.getElementById("input").value = "";
                } else {
                    revealToConsole(incorrectResponses);
                }
            }
        }

        document.getElementById("input").addEventListener("keydown", resposeListener);
        document.getElementById("input").classList.remove("hidden");
    });
}

async function runGame(){
    if(stage >= script.length)
        return;
    await revealToConsole(script[stage].message)
    await getInput("", script[stage].validResponses, script[stage].invalidResponses[0])
    stage++;
    runGame();
}

runGame();



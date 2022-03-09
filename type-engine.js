let script = [
    {
        message: `Passcode:`,
        validResponses: ["riddle me this"],
        invalidResponses: ["Login attempt failed", "You failed again", "You sure this is your laptop buddy?"]
    },
    {
        message: `Welcome. Solve the following riddles to complete the mission. Mississippi has four S’s and four I’s. Can you spell that without using S or I?`,
        validResponses: ["that"],
        invalidResponses: ["Not even close...", "Wow...just..wow.."]
    },
    {
        message: `Correct! There’s a one-story house where everything is yellow. The walls are yellow. The doors are yellow. All the furniture is yellow. The house has yellow beds and yellow couches. What color are the stairs?`,
        validResponses: ["ther are no stairs", 'no stairs', "there arent any stairs", "doesn't have", "not any stairs", "only one story"],
        invalidResponses: ["Not even close...", "Wow...just..wow.."]
    },
    {
        message: `Correct! A girl fell off a 20-foot ladder. She wasn’t hurt. How?`,
        validResponses: ["bottom step", "off the bottom", "bottom rung", "bottom"],
        invalidResponses: ["Not even close...", "Wow...just..wow.."]
    },
    {
        message: `Mission Complete! Type "Done" to continue`,
        validResponses: ["done"],
        invalidResponses: ["Can't you read!?!?", "Not even close...", "Wow...just..wow.."]
    },
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
            }, char.match(/\.|\,|\!|\?/g) ? 200 : 0)
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

        displayMessage("HQ:>    " + message);
    });
}


function chirp() {
    return new Promise(res => {
        var audio = new Audio('beep.mp3');
        audio.loop = false;
        let finished = () => {
            audio.removeEventListener("ended", finished);
            res();
        }
        audio.play();
        audio.addEventListener("ended", finished);
    })
}


let typing = false;
function getInput(prompt, correctResponses, incorrectResponses) {
    console.log(correctResponses)
    return new Promise((responseCorrect, error) => {
        let userResponseCorrect = (res) => {
            let responseFound = false;
            for (let i in correctResponses) {
                if (res.match(new RegExp(correctResponses[i], "ig"))) {
                    responseFound = true;
                    break;
                }
            }

            return responseFound;
        }

        let resposeListener = async (e) => {
            chirp();
            if (e.code === "Enter" && !typing) {
                typing = true;
                let textbox = document.createElement("div");
                document.getElementById("console").appendChild(textbox);
                textbox.innerHTML = "Agent T:>  "+e.target.value;
                textbox.classList.add("user-input");
                let responseFound = (userResponseCorrect(e.target.value) && e.target.value.trim().length > 0);
                e.target.value = "";
                if (responseFound) {
                    document.getElementById("input").removeEventListener("keydown", resposeListener);
                    responseCorrect();
                    typing = false;
                    console.log("correct");
                    document.getElementById("input").classList.add("hidden");
                    document.getElementById("input").value = "";
                } else {
                    await revealToConsole(incorrectResponses[invalidCount]);
                    typing = false;
                    invalidCount++;
                    console.log(script[stage].invalidResponses.length, invalidCount);
                    if (invalidCount >= script[stage].invalidResponses.length)
                        invalidCount = 0;

                }
            }
        }

        document.getElementById("input").addEventListener("keydown", resposeListener);
        document.getElementById("input").classList.remove("hidden");
        document.getElementById("input").select();
    });
}

let invalidCount = 0;
async function runGame() {
    if (stage >= script.length) {
        document.getElementById("console").innerHTML = "";
        await revealToConsole("Goodbye!");
        document.getElementById("console").innerHTML = "";
        return;
    }
    await revealToConsole(script[stage].message)
    await getInput("", script[stage].validResponses, script[stage].invalidResponses);
    stage++;

    console.log(invalidCount);
    runGame();
}


let started = false;
window.addEventListener("keydown", (e) => {
    if (!started && e.code == "KeyT") {
        started = true
        runGame();
    }
});

window.addEventListener("click", () => {
    document.getElementById("input").select();
});



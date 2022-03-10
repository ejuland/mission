let script = [
    {
        message: `Enter Passcode:`,
        validResponses: ["milo"],
        invalidResponses: ["Login attempt failed", "You failed again", "You sure this is your laptop buddy?"]
    },
    {
        message: `Passphrase Confirmed. Welcome Agent T`,
        passive: true,
    },
    {
        message: "Our hidden cameras confirm that you have successfully infiltrated the gala thrown by Governor Nathan Redford to celebrate his recent re-election. According to protocol, we will now debrief you on your current mission.",
        passive: true,
    },

    {
        message: "You have arrived at this estate disguised as the infamous Governor Nathan Redford (The man depicted in the following portrait…) ",
        passive: true,
    },

    {
        message: `./gov.jpg`,
        isImage: true,
        passive: true
    },

    {
        message: "I must say that you really have outdone yourself with the disguise on this mission! However, I am confused why you chose to forego the moustache. This is the governors defining feature after all. Your disguise is brilliant enough to compensate for this, however.",
        passive: true,
    },

    {
        message: "Getting back to the subject at hand, Governor Redford achieved his great fame and fortune through many questionable means. Though the agency tends to turn a blind eye on such actives, his latest scandal affects our organization directly. ",
        passive: true,
    },

    {
        message: "Governor Redford has recently procured a list detailing the true identities of all our active field agents. It is imperative that we reclaim this list before he sells it to one of his many potential buyers.",
        passive: true,
    },

    {
        message: "Losing this list would risk the safety of our agents and our legitimacy as an organization. This is why we sent our best field agent to complete this mission. Do you choose to accept this mission? ",
        validResponses: ["accept", "yes", "affrmative", "sure", "ok", "yeah", "uh huh"],
        invalidResponses: ["We would like to remind you that you are under contract...", "Remember that Turkish prison you escaped from? It would be a shame if they found where their most wanted escapee is now...", "Need we remind you of the great debt you owe to this organization"]
    },

]

let stage = 0;

let tock = 0;
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
                if (tock++ % 5 == 0)
                    chirp().then(() => {
                        displayMessage(message.substr(1));
                    });
                else
                    displayMessage(message.substr(1));
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
                textbox.innerHTML = "Agent T:>  " + e.target.value;
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

function displayImage(src) {
    let img = document.createElement("img");
    img.src = src;
    document.getElementById("console").appendChild(img);
}

let invalidCount = 0;
async function runGame() {
    if (stage >= script.length) {
        document.getElementById("console").innerHTML = "";
        await revealToConsole("Goodbye!");
        document.getElementById("console").innerHTML = "";
        return;
    }
    if (!script[stage].isImage)
        await revealToConsole(script[stage].message)
    else
        displayImage(script[stage].message)
    if (!script[stage].passive)
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



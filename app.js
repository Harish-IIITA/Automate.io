#! /usr/bin/env node
var https = require('https');
var baseUrl = 'https://fourtytwowords.herokuapp.com/';
const api_key = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';
let argslen;
const readline = require('readline');


var stdin = process.openStdin();

let PrintHelp = () => {
    console.log('The possible commands:');
    console.log('\t1.def <word>');
    console.log('\t2.syn <word>');
    console.log('\t3.ant <word>');
    console.log('\t4.ex <word>');
    console.log('\t5.dict <word>');
    console.log('\t6.play');
};
PrintHelp();
const MakeARequest = (url, callback) => {
    https.get(url, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData);
                callback(parsedData);
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', (err) => {
        console.error(err);
    });
};
let Definitions = (word, callback) => {
    api = baseUrl + 'word/' + word + '/definitions?api_key=' + api_key;
    MakeARequest(api, (data) => {
        callback(data);
    });
};
let Synonyms = (word, callback) => {
    api = baseUrl + 'word/' + word + '/relatedWords?relationshipTypes=synonym&limitPerRelationshipType=2000&api_key=' + api_key;
    MakeARequest(api, (data) => {
        callback(data);
    });
};
let antonyms = (word, callback) => {
    api = baseUrl + 'word/' + word + '/relatedWords?relationshipTypes=antonym&limitPerRelationshipType=2000&api_key=' + api_key;
    MakeARequest(api, (data) => {
        callback(data);
    });
};
let PrintDefinitions = (word) => {
    Definitions(word, (data) => {
        if (data.length >= 1) {
            console.log('\x1b[93m The definitions for the word "' + word + '": \x1b[0m');
            for (let index in data) {
                console.log((parseInt(index) + 1) + '\t' + data[index].text);
            }
            PrintHelp();
        } else {
            console.log('\x1b[31m No definitions found for the word "' + word + '" \x1b[0m');
        }
    });
};
let PrintSynonyms = (word) => {
    Synonyms(word, (data) => {
        if (data.length >= 1) {
            let words = data[0].words;
            console.log('\x1b[93m The synonyms for the word "' + word + '": \x1b[0m');
            for (let index in words) {
                console.log((parseInt(index) + 1) + '\t' + words[index]);
            }
        } else {
            console.log('\x1b[31m No synonyms found for the word "' + word + '" \x1b[0m');
        }
    });
};
let PrintAntonyms = (word) => {
    antonyms(word, (data) => {
        if (data.length >= 1) {
            let words = data[0].words;
            console.log('\x1b[93m The antonyms for the word "' + word + '": \x1b[0m');
            for (let index in words) {
                console.log((parseInt(index) + 1) + '\t' + words[index]);
            }
        } else {
            console.log('\x1b[31m No antonyms found for the word "' + word + '" \x1b[0m');
        }
    });
}
let PrintExamples = (word) => {
    api = baseUrl + 'word/' + word + '/examples?api_key=' + api_key;
    MakeARequest(api, (data) => {
        if (data.hasOwnProperty('examples')) {
            let example_sentences = data.examples;
            console.log('\x1b[93m Example usages for the word "' + word + '": \x1b[0m');
            for (let index in example_sentences) {
                console.log((parseInt(index) + 1) + '\t' + example_sentences[index].text);
            }
        } else if (data.hasOwnProperty('error')) {
            console.log('\x1b[31m No examples found for the word "' + word + '" \x1b[0m');
        }
    });
}
let PrintGameRetry = () => {
    console.log('You have entered incorrect word.');
    console.log('Choose the options from below menu:');
    console.log('\t1. Try Again');
    console.log('\t2. Hint');
    console.log('\t3. Quit');
};
let PrintWordOfTheDay = () => {
    GetRandomWord((word) => {
        console.log('\x1b[93m Word of the Day:  "' + word + '": \x1b[0m');
        Dictionary(word);
    });
};
let Dictionary = (word) => {
    console.log('\x1b[93m The dictionary for the word "' + word + '": \x1b[0m');
    PrintDefinitions(word);
    PrintSynonyms(word);
    PrintAntonyms(word);
    PrintExamples(word);
};
let GetRandomWord = (callback) => {
    api = baseUrl + 'words/randomWord?api_key=' + api_key;
    MakeARequest(api, (data) => {
        callback(data.word)
    });
};
let PlayGame = () => {
    let game_word;
    let game_word_definitions = new Array();
    GetRandomWord((word) => {
        //console.log('Random Word is: ' + word);
        game_word = word.replace(" ", "%20");
        //console.log('Game Word: ' + game_word);
        Definitions(game_word, (data) => {
            if (data.length >= 1) {
                for (let index in data) {
                    game_word_definitions[index] = data[index].text;
                }
                //console.log('Length of definition array : ' + game_word_definitions.length);
            } else {
                console.log('\x1b[31m Error occured in the process.\nProcess will exit now. \x1b[0m');
                process.exit();
            }
            Synonyms(game_word, (data) => {
                let game_word_synonyms;
                let hasSynonyms = false;
                if (data.length >= 1) {
                    hasSynonyms = true;
                    game_word_synonyms = data[0].words;
                    //console.log('The Length of synonyms: ' + game_word_synonyms.length);
                    //console.log('synonyms : '+game_word_synonyms);
                }
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                console.log('Press "Ctrl + C" to exit the program.');
                console.log('Find the word with the following definition');
                console.log('Definition :\n\t' + game_word_definitions[0]);
                console.log('Type the word and press the ENTER key.');
                rl.on('line', (input) => {
                    let correctAnswer = false;
                    if (hasSynonyms) {
                        for (let index in game_word_synonyms) {
                            if (`${input}` == game_word_synonyms[index]) {
                                console.log('Congratulations! You have entered correct synonym for the word "' + game_word + '"');
                                rl.close();
                                correctAnswer = true;
                            }
                        }
                    }
                    if (`${input}` === game_word) {
                        console.log('Congratulations! You have entered correct word.');
                        rl.close();
                    } else {
                        if (`${input}` == '3') {
                            rl.close();
                        }
                        if (!(`${input}` == '1' || `${input}` == '2' || `${input}` == '3') && !correctAnswer) {
                            PrintGameRetry();
                        }
                        switch (parseInt(`${input}`)) {
                            case 1:
                                console.log('Please try to guess the word again:');
                                break;
                            case 2:
                                let randomNumber = Math.floor((Math.random() * parseInt(game_word_definitions.length)) + 1);
                                //console.log('Random Number : ' + randomNumber);
                                if (randomNumber == game_word_definitions.length) {
                                    randomNumber = game_word_definitions.length - 1;
                                }
                                console.log('Hint:');
                                console.log('\tDefinition :\t' + game_word_definitions[randomNumber]);
                                console.log('\nTry to guess the word again using the hint provided.');
                                console.log('Enter the word:');
                                break;
                            case 3:
                                console.log('The correct word is : ' + game_word);
                                Dictionary(game_word);
                                console.log('Thank you for trying out this game. \nGame Ended.');
                                rl.close();
                                break;
                            default:
                        }
                    }
                });
            });
        });
    });
};
stdin.addListener("data", (input) => {
    const str = input.toString().trim();
    const args = str.split(' ');
    startDictionary(args);
});
let startDictionary = (userargs) => {
    argslen = userargs.length;
    if (argslen === 2) {
        let word = userargs[1];
        switch (userargs[0]) {
            case 'defn':
                PrintDefinitions(word);
                break;
            case 'syn':
                PrintSynonyms(word);
                break;
            case 'ant':
                PrintAntonyms(word);
                break;
            case 'ex':
                PrintExamples(word);
                break;
            case 'play':
                PlayGame();
            default:
                PrintHelp();
        }
    } else if (argslen === 1 && userargs[0] === 'dict') {
        GetRandomWord((word) => {
            Dictionary(word);
        });
    } else if (argslen === 1 && userargs[0] === 'play') {
        PlayGame();
    } else if (argslen === 1 && userargs[0] === '') {
        PrintWordOfTheDay();
    } else {
        PrintHelp();
    }
};

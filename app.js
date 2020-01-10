#! /usr/bin/env node
var https = require('https');
var baseUrl = 'https://fourtytwowords.herokuapp.com/';
const api_key = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';
let argslen;

var stdin = process.openStdin();

let PrintHelp = () => {
    console.log('The possible commands:');
    console.log('\t1.def <word>');
    console.log('\t2.syn <word>');
    console.log('\t3.ant <word>');
    console.log('\t4.ex <word>');
    console.log('\t5.dict <word>');
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
stdin.addListener("data", (input) => {
    const str = input.toString().trim();
    const args = str.split(' ');
    startDictionary(args);
});
let startDictionary = (userargs) => {
    debugger;
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
                Examples(word);
                break;
            case 'dict':
                console.log('\x1b[93m The dictionary for the word "' + word + '": \x1b[0m');
                Dictionary(word);
                break;
            default:
                PrintHelp();
        }
    } else {
        PrintHelp();
    }
};

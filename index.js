#!/usr/bin/env node
//! don't forget to run: "sudo npm link"


//todos ---------------------------------------------------------

/////* save to file
/////* copy to clipboard
//* open <newfile> in VSCode --> "code ."
//* if "ranjson -s" to existing file append json data without "[]"
//* warning if "ranjson -s" to existing file! ask if user really wants to add to existing file. if yes: append, if not: cancel command!

// ---------------------BUGFIX-----------------------------------

//todo: BUGFIX: (Use `node --trace-warnings ...` to show where the warning was created)
//! FIX: instead of:  import data from './data.json'  assert { type: 'json' };
import { readFile } from 'fs/promises';
const data = JSON.parse(
    await readFile(
        new URL('./data.json', import.meta.url)
    )
);
// --------------------------------------------------------------



// --------------------IMPORTS-----------------------------------

//npm commander
import { Command } from 'commander';
const program = new Command();

//nodejs
import fs from 'fs'
import path from 'path'
import os, { loadavg } from 'os'

//utils
import chalk from 'chalk';
import filesystem from 'fs-extra'
import clipboard from 'clipboardy';


// ------****-PROGRAGM--CONFIGS,-OPTIONS,-ERRORS-****------------


program
    // config
    // .name("ranjson")
    .version('1.0.0')
    .usage('-[option]')
    .description('Description: Simple random JSON Output. Type ranjson followed by "Options"')

    // options
    .option('-si,   --single', 'single random json')
    .option('-sh,   --shuffle', 'shuffled random json length')
    .option('-sa,   --say <number>', 'say how many random json, 1-20 in ordered list')
    .option('-s,    --save <string>', 'save  to new file by adding <filename>. By saving to same file, json data will be simply appended')
    .option('-cp,   --clip', 'copy json to clipboard')

    // error handling
    .addHelpText('after', `Example call: ranjson -si`)
    .showHelpAfterError('(add --help for additional information)')

    // run

    .parse()

//* programm.opts()
const { single, shuffle, say, save, clip } = program.opts()


// -------------------*---END---*------------------------------



// --------------PROGRAM--FUNCTIONS----------------------------

// ------------------------------------------------------------
//* get random number of database length
let db = Math.floor(Math.random() * data.length)
// console.log(chalk.bgYellow("random number of db length: ", db));

//* multi functional variable
let toJSON;
// ------------------------------------------------------------


// -------------------------------------------------------
//? get single random; filter by id 

const randomFilteredData = data.filter(e => e.id === db)
toJSON = JSON.stringify(randomFilteredData, null, 4)

if (single) {
    console.log(chalk.blueBright("single random:\n "), toJSON);
}
// -------------------------------------------------------



// -------------------------------------------------------
//? get shuffled length
/*
Get Multiple Random Elements from an Array in JavaScript
https://bobbyhadz.com/blog/javascript-get-multiple-random-elements-from-array
*/

const genMultiRandom = (data, num) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random())

    toJSON = JSON.stringify(shuffled.slice(0, num), null, 4)
    return toJSON
}

if (shuffle) {
    console.log(chalk.blueBright("shuffled:\n "), genMultiRandom(data, db));
    console.log(chalk.italic.redBright("random number of JSON length: ", db));
}
// -------------------------------------------------------



// -------------------------------------------------------
//? choose between 1 -20 JSON length

function sayHowManyRandom(data, num) {
    let howmany = data
    toJSON = JSON.stringify(howmany.slice(0, num), null, 4)
    return toJSON
}

if (say) {
    console.log(chalk.blueBright("ordered :\n "), sayHowManyRandom(data, say));
}
// -------------------------------------------------------



// -------------------------------------------------------
//? save JSON to file 
export const saveToNewFile = (name, password) => {
    fs.open(path.join('./', name + '.json'), 'a', 666, (e, id) => {
        fs.write(id, password + os.EOL, null, 'utf-8', () => {
            fs.close(id, () => {
                console.log(chalk.bgBlueBright(' Saved as ' + name + '.json'));
            })
        })
    })
}



if (save) {
    saveToNewFile(save, toJSON)
}
// -------------------------------------------------------

//? copy to clipboard 

if (clip) {
    clipboard.writeSync(toJSON)
}
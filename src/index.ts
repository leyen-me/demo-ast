// src/index.ts
import { Lexer } from './Lexer';
import { Parser } from './Parser';
import { Interpreter } from './Interpreter';

const lexer = new Lexer("let x = 3 + 5 * (10 - 4); let y = x + 2;");
const parser = new Parser(lexer);
const interpreter = new Interpreter(parser);
interpreter.interpret()

console.log(parser.getVariables());
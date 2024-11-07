// src/Interpreter.ts
import { Parser } from "./Parser";

export class Interpreter {
  constructor(private parser: Parser) {}

  // 调用解析器的解析方法
  interpret(): void {
    this.parser.parse();
  }
}

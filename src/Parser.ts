// src/Parser.ts
import { Token, TokenType } from "./Token";
import { Lexer } from "./Lexer";

export class Parser {
  private currentToken: Token;
  private variables: { [key: string]: number } = {};

  public getVariables() {
    return this.variables;
  }

  constructor(private lexer: Lexer) {
    this.currentToken = this.lexer.getNextToken();
  }

  /**
   * eat 函数用于消耗当前的 Token，并获取下一个 Token。
   * @param tokenType 
   */
  private eat(tokenType: TokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(`Unexpected token: ${this.currentToken.type}`);
    }
  }

  /**
   * `factor` 函数用于解析和计算基本因子（如数字和括号中的表达式）。
   * 
    - 如果当前 Token 是数字，则返回其数值。
    - 如果当前 Token 是左括号，则解析括号中的表达式，并返回其值。
   */
  private factor(): number {
    const token = this.currentToken;
    if (token.type === "NUMBER") {
      this.eat("NUMBER");
      return parseInt(token.value!, 10);
    } else if (token.type === "LPAREN") {
      this.eat("LPAREN");
      const result = this.expr();
      this.eat("RPAREN");
      return result;
    } else if (token.type === "IDENTIFIER") {
      const varName = token.value!;
      this.eat("IDENTIFIER");
      return this.variables[varName];
    }
    throw new Error(`Unexpected token: ${token.type}`);
  }

  /**
   * `term` 函数用于解析和计算乘法和除法表达式。
   * 
    - 解析一个因子。
    - 如果下一个 Token 是乘法或除法操作符，则继续解析下一个因子，并进行相应的计算。
   */
  private term(): number {
    let result = this.factor();

    while (
      this.currentToken.type === "MULTIPLY" ||
      this.currentToken.type === "DIVIDE"
    ) {
      const token = this.currentToken;
      if (token.type === "MULTIPLY") {
        this.eat("MULTIPLY");
        result *= this.factor();
      } else if (token.type === "DIVIDE") {
        this.eat("DIVIDE");
        result /= this.factor();
      }
    }

    return result;
  }

  /**
   * `expr` 函数用于解析和计算加法和减法表达式。
   * 
    - 解析一个项（term）。
    - 如果下一个 Token 是加法或减法操作符，则继续解析下一个项，并进行相应的计算。
   */
  private expr(): number {
    let result = this.term();

    while (
      this.currentToken.type === "PLUS" ||
      this.currentToken.type === "MINUS"
    ) {
      const token = this.currentToken;
      if (token.type === "PLUS") {
        this.eat("PLUS");
        result += this.term();
      } else if (token.type === "MINUS") {
        this.eat("MINUS");
        result -= this.term();
      }
    }

    return result;
  }

  /**
   * `assignment` 函数用于解析和处理变量赋值语句。
   * 
    - 获取变量名。
    - 消耗赋值操作符（`=`）。
    - 解析赋值表达式，并将结果存储在变量表中。
   */
  private assignment(): void {
    const varName = this.currentToken.value!;
    this.eat("IDENTIFIER");
    this.eat("ASSIGN");
    const value = this.expr();
    this.variables[varName] = value;
  }

  /**
   * `statement` 函数用于解析和处理单个语句。
   * 
- 如果当前 Token 是 `let` 关键字，则解析变量声明和赋值语句。
- 否则，解析表达式语句。
- 消耗分号（`;`）。
   */
  private statement(): void {
    if (this.currentToken.type === "LET") {
      this.eat("LET");
      this.assignment();
    } else {
      this.expr();
    }
    this.eat("SEMICOLON");
  }

  parse(): void {
    while (this.currentToken.type !== "EOF") {
      this.statement();
    }
  }
}

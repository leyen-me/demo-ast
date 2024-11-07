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

  private eat(tokenType: TokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(`Unexpected token: ${this.currentToken.type}`);
    }
  }

  /**
   * factor 是一个数字或者一个括号表达式
   * @returns number
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
   * term 是一个乘法或者除法表达式
   * @returns number
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
   * expr
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

  private assignment(): void {
    const varName = this.currentToken.value!;
    this.eat("IDENTIFIER");
    this.eat("ASSIGN");
    const value = this.expr();
    this.variables[varName] = value;
  }

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

import { Token } from "./Token";

export class Lexer {
  private pos: number = 0; // 当前扫描字符的位置
  private currentChar: string | null; // 当前扫描的字符

  constructor(private text: string) {
    this.currentChar = this.text[this.pos]; // 初始化第一个字符
  }

  /**
   * 向前移动一个字符，更新 currentChar
   */
  private advance() {
    this.pos++;
    this.currentChar = this.pos < this.text.length ? this.text[this.pos] : null;
  }

  /**
   * 跳过空白字符
   */
  private skipWhitespace() {
    while (this.currentChar !== null && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  /**
   * 从输入中解析一个整数，生成一个多位数字
   */
  private number(): Token {
    let result = "";
    while (this.currentChar !== null && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return new Token("NUMBER", result);
  }

  /**
   * 识别标识符和关键字
   */
  private identifier(): Token {
    let result = "";
    while (this.currentChar !== null && /[a-zA-Z_]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    if (result === "let") {
      return new Token("LET", result);
    }
    return new Token("IDENTIFIER", result);
  }

  /**
   *
   * @returns 返回输入中的下一个 token
   */
  getNextToken(): Token {
    while (this.currentChar !== null) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      if (/\d/.test(this.currentChar)) {
        return this.number();
      }

      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.identifier();
      }

      if (this.currentChar === "+") {
        this.advance();
        return new Token("PLUS", "+");
      }

      if (this.currentChar === "-") {
        this.advance();
        return new Token("MINUS", "-");
      }

      if (this.currentChar === "*") {
        this.advance();
        return new Token("MULTIPLY", "*");
      }

      if (this.currentChar === "/") {
        this.advance();
        return new Token("DIVIDE", "/");
      }

      if (this.currentChar === "(") {
        this.advance();
        return new Token("LPAREN", "(");
      }

      if (this.currentChar === ")") {
        this.advance();
        return new Token("RPAREN", ")");
      }

      if (this.currentChar === "=") {
        this.advance();
        return new Token("ASSIGN", "=");
      }

      if (this.currentChar === ";") {
        this.advance();
        return new Token("SEMICOLON", ";");
      }

      // 语法错误
      throw new Error(`Unknown character: ${this.currentChar}`);
    }

    return new Token("EOF", null);
  }
}

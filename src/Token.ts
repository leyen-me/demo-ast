export type TokenType =
  | "NUMBER" // 数字类型
  | "PLUS" // 加号
  | "MINUS" // 减号
  | "MULTIPLY" // 乘号
  | "DIVIDE" // 除号
  | "LPAREN" // 左括号
  | "RPAREN" // 右括号
  | "EOF" // 结束符
  | "IDENTIFIER" // 标识符
  | "ASSIGN" // 赋值符号
  | "LET" // 声明变量
  | "SEMICOLON"; // 分号


export class Token {
  /**
   * 每一个 Token 对象都有一个 type 属性和一个 value 属性
   * @param type TokenType
   * @param value string | null
   */
  constructor(public type: TokenType, public value: string | null) {}
}

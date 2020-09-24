import { Interpreter } from './interpreter';
export class InterpreterRequest {
    editable: boolean;
    date: Date;
    interpreter: Interpreter;

    constructor(editable: boolean, date: Date, interpreter: Interpreter) {
        this.editable = editable;
        this.date = date;
        this.interpreter = interpreter;
    }
}
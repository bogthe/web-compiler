import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
declare var compiler: any;

@Injectable()
export class CompilerService {
    private code: string;
    private codeSubject = new Subject<string>();
    private tokenSubject = new Subject<string>();
    private parserSubject = new Subject<string>();
    private transformerSubject = new Subject<string>();

    public set codeInput(val: string) {
        this.code = val;
        this.triggerObservables();
    }

    private triggerObservables() {
        let tokens = compiler().tokenizer(this.code);
        this.tokenSubject.next(JSON.stringify(tokens, null, '\t'));

        let ast = compiler().parser(tokens);
        this.parserSubject.next(JSON.stringify(ast, null, '\t'));

        let transformedAst = compiler().transformer(ast);
        this.transformerSubject.next(JSON.stringify(transformedAst, null, '\t'));

        let compiledCode = compiler().codeGenerator(transformedAst, null, '\t');
        this.codeSubject.next(compiledCode);
    }

    public codeGenerator(): Observable<string> {
        return this.codeSubject.asObservable();
    }

    public tokenizer(): Observable<string> {
        return this.tokenSubject.asObservable();
    }

    public parser(): Observable<string>{
        return this.parserSubject.asObservable();
    }

    public transformer():Observable<string>{
        return this.transformerSubject.asObservable();
    }
}
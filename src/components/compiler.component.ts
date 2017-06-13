import { Component, Input, OnInit } from '@angular/core';
import { CompilerEnum } from '../data/compiler-types';
import { CompilerService } from '../services/compiler.service';

@Component({
    selector: 'compiler-component',
    templateUrl: './compiler.component.html'
})
export class CompilerComponent implements OnInit {
    @Input() componentType: any;
    componentTypeName: string;
    compilerOutput: string;

    constructor(private compilerService: CompilerService) {
    }

    ngOnInit() {
        this.componentTypeName = CompilerEnum[this.componentType];
        this.attachComponentToObservables();
    }

    attachComponentToObservables() {
        switch (this.componentType) {
            case CompilerEnum.Tokenizer:
                this.compilerService.tokenizer().subscribe(
                    (tokens) => { this.compilerOutput = tokens }
                );
                break;

            case CompilerEnum.Parser:
                this.compilerService.parser().subscribe(
                    (ast) => { this.compilerOutput = ast }
                );
                break;

            case CompilerEnum.Transformer:
                this.compilerService.transformer().subscribe(
                    (newAst) => { this.compilerOutput = newAst }
                );
                break;

            case CompilerEnum.CodeGenerator:
                this.compilerService.codeGenerator().subscribe(
                    (generatedCode) => { this.compilerOutput = generatedCode }
                );
                break;
        }
    }
}
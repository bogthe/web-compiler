import { Component, OnInit } from '@angular/core';
import { CompilerTypes } from '../data/compiler-types';
import { CompilerService } from '../services/compiler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  types = new CompilerTypes().types;
  input: string = "(add 2 2)";
  compilerOutput: string;

  constructor(private compilerService: CompilerService) {
  }

  ngOnInit() {
    this.compilerService.codeGenerator().subscribe(
      (compiledCode) => { this.compilerOutput = compiledCode }
    );
  }

  compileInput() {
    this.compilerService.codeInput = this.input;
  }
}

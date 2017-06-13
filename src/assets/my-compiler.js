function compiler() {
    /**************
    ** TOKENIZER **
    **************/
    function tokenizer(input) {
        let current = 0;
        let tokens = [];
        let WHITESPACE = /\s/;
        let CHARACTER = /[a-z]/i;
        let NUMBER = /[0-9]/;

        while (current < input.length) {
            let char = input[current];

            if (char === '(') {
                tokens.push({
                    type: 'paren', value: '('
                });

                current++;
                continue;
            }

            if (char === ')') {
                tokens.push({
                    type: 'paren', value: ')'
                });

                current++;
                continue;
            }

            if (WHITESPACE.test(char)) {
                current++;
                continue;
            }

            if (CHARACTER.test(char)) {
                let value = '';
                while (CHARACTER.test(char)) {
                    if (char) {
                        value += char;
                        char = input[++current];
                    } else {
                        break;
                    }
                }

                tokens.push({
                    type: 'name', value: value
                });
                continue;
            }

            if (NUMBER.test(char)) {
                let value = '';
                while (NUMBER.test(char)) {
                    if (char) {
                        value += char;
                        char = input[++current];
                    } else {
                        break;
                    }
                }

                tokens.push({
                    type: 'number', value: value
                });
                continue;
            }

            if (char === '"') {
                let value = '';
                char = input[++current];
                while (char != '"') {
                    value += char;
                    char = input[++current];

                    if (current >= input.length) {
                        throw new SyntaxError("String does not terminate!");
                    }
                }

                tokens.push({
                    type: 'string', value: value
                });
                current++;
                continue;
            }

            throw new TypeError("Unrecognized character:" + char);
        }

        return tokens;
    }

    /**************
    *** PARSER  ***
    **************/
    function parser(tokens) {
        let current = 0;

        function walk() {
            let token = tokens[current];
            if (token.type === 'number') {
                current++;
                return { type: 'NumberLiteral', value: token.value };
            }

            if (token.type === 'string') {
                current++;
                return { type: 'StringLiteral', value: token.value };
            }

            if (token.type === 'paren' && token.value === '(') {
                token = tokens[++current];
                let node = {
                    type: 'CallExpression',
                    name: token.value,
                    params: []
                };

                token[++current];
                while (
                    token.type !== 'paren' ||
                    (token.type === 'paren' && token.value === '(')
                ) {
                    node.params.push(walk());
                    token = tokens[current];
                }

                current++;
                return node;
            }

            throw new SyntaxError(`Type not recognized! Type:${token.type} / ${token.value}`);
        }

        let ast = {
            type: 'Program', body: []
        }

        while (current < tokens.length) {
            ast.body.push(walk());
        }

        return ast;
    }

    /**************
    ** TRAVERSER **
    **************/
    function traverser(ast, visitor) {
        function traverseChildrenArray(array, parent) {
            array.forEach((child) => {
                traverseNode(child, parent);
            });
        }

        function traverseNode(node, parent) {
            let method = visitor[node.type];

            if (method && method.enter) {
                method.enter(node, parent);
            }

            switch (node.type) {
                case 'Program':
                    traverseChildrenArray(node.body, node);
                    break;

                case 'CallExpression':
                    traverseChildrenArray(node.params, node);
                    break;

                case 'NumberLiteral':
                case 'StringLiteral':
                    break;

                default:
                    throw new SyntaxError(`Unrecognized node type:${node.type}.`);
            }
        }

        traverseNode(ast, null);
    }

    /**************
    * TRANSFORMER *
    **************/
    function transformer(ast) {
        let newAst = {
            type: 'Program',
            body: []
        }

        ast._context = newAst.body;

        traverser(ast, {
            CallExpression: {
                enter(node, parent) {
                    let expression = {
                        type: 'CallExpression',
                        calle: {
                            type: 'Identifier',
                            name: node.name
                        },
                        arguments: []
                    }

                    node._context = expression.arguments;
                    if (parent.type !== 'CallExpression') {
                        expression = {
                            type: 'ExpressionStatement',
                            expression: expression
                        };
                    }

                    parent._context.push(expression);
                }
            },
            NumberLiteral: {
                enter(node, parent) {
                    parent._context.push(node);
                }
            },
            StringLiteral: {
                enter(node, parent) {
                    parent._context.push(node);
                }
            }
        });

        return newAst;
    }

    /**************
    CODE*GENERATOR*
    **************/
    function codeGenerator(node) {
        switch (node.type) {
            case 'Program':
                return node.body.map(codeGenerator)
                    .join('\n');

            case 'ExpressionStatement':
                return codeGenerator(node.expression) + ';';

            case 'CallExpression':
                return node.calle.name +
                    '(' +
                    node.arguments.map(codeGenerator).join(', ') +
                    ')';

            case 'NumberLiteral':
                return node.value;

            case 'StringLiteral':
                return `"${node.value}"`;
        }
    }

    /**************
    **  COMPILER **
    **************/
    function compile(input) {
        let tokens = tokenizer(input);
        let ast = parser(tokens);
        let finalAst = transformer(ast);

        return codeGenerator(finalAst);
    }

    return {
        tokenizer:tokenizer,
        parser:parser,
        traverser: traverser,
        transformer: transformer,
        codeGenerator:codeGenerator,
        compile: compile
    }
}
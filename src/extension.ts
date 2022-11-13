// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	// each time the cursor moves in the editor update the last known document cursor
    // position in the global state store   	
    vscode.window.onDidChangeTextEditorSelection((evt: vscode.TextEditorSelectionChangeEvent) => {
		  const offset = evt.textEditor.document.offsetAt(evt.selections[0].active)
		  const file = evt.textEditor.document.fileName;
		  context.globalState.update(file, offset)		  
		  //debug console.log(file,offset)
	})

	// when the document is opened again th texteditor is updated with the last known cursor
    // position from the global state store   	    	
	vscode.workspace.onDidOpenTextDocument((document) => {
		const file = document.fileName;
		const offset = context.globalState.get<number>(file)
		const position = document.positionAt(offset!)
		const validpos = document.validatePosition(position)
		//debug console.log(file,offset)	  
		context.globalState.update(file+"*",offset)
		// debug console.log(file+"*",offset)
		vscode.window.activeTextEditor!.selection=new vscode.Selection(validpos,validpos)
	});

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerTextEditorCommand('extension.restoreLastKnownCursorPosition', (texteditor: vscode.TextEditor) => {
        // The code you place here will be executed every time your command is executed
		const file = texteditor.document.fileName;
		const offset = context.globalState.get<number>(file+"*")
		// debug console.log(file+"*",offset)
		const position = texteditor.document.positionAt(offset!)
		const validpos = texteditor.document.validatePosition(position)
		//debug console.log(file,offset)	  		
		texteditor.selection=new vscode.Selection(validpos,validpos)		
    });

    context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() {}

document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const inputLine = document.getElementById('input-line');
    const terminal = document.getElementById('terminal');

    // --- SEU CONTEÚDO VAI AQUI ---
    const filesystem = {
        'articles': {
            type: 'directory',
            content: {
                'porque-pentest-e-importante.txt': {
                    type: 'file',
                    content: `
# Por que o Pentest é crucial para a segurança de qualquer empresa.

O teste de intrusão, ou pentest, não é um luxo, mas uma necessidade...
(Aqui você desenvolve seu artigo completo)
`
                },
                'analise-de-malware-basica.md': {
                    type: 'file',
                    content: `
# Análise de Malware para Iniciantes

Passo 1: Ambiente Seguro (VM)
Passo 2: Análise Estática (strings, hashes)
...
(Seu artigo aqui)
`
                }
            }
        },
        'projects': {
            type: 'directory',
            content: {
                'keylogger-didatico.py': {
                    type: 'file',
                    content: `
# ATENÇÃO: Este código é para fins puramente educacionais.
# Não use para atividades maliciosas.

import pynput
...
(Seu código ou descrição do projeto aqui)
`
                }
            }
        },
        'whoami.txt': {
            type: 'file',
            content: `
Olá, sou sec_shell.
Um entusiasta de cibersegurança focado em Red Team e análise de vulnerabilidades.
Este espaço é meu logbook digital, onde compartilho estudos e projetos.
`
        },
        'contato.txt': {
            type: 'file',
            content: `
Você pode me encontrar em:
- GitHub:   <a href="https://github.com/seu-usuario" target="_blank">github.com/seu-usuario</a>
- LinkedIn: <a href="https://linkedin.com/in/seu-usuario" target="_blank">linkedin.com/in/seu-usuario</a>
- Email:    seu-email[at]email.com
`
        }
    };
    
    // Texto de ajuda que será usado no banner e no comando 'help'
    const helpText = `
<span class="directory">ls</span>        - Lista arquivos e diretórios.
<span class="directory">cat [arq]</span> - Mostra o conteúdo de um arquivo.
<span class="directory">whoami</span>    - Mostra uma breve bio sobre mim.
<span class="directory">contato</span>   - Exibe minhas informações de contato.
<span class="directory">help</span>      - Mostra esta lista de comandos novamente.
<span class="directory">clear</span>     - Limpa a tela do terminal.
<span class="directory">banner</span>    - Mostra a mensagem inicial.`;


    const executeCommand = (command) => {
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase(); // Comandos não diferenciam maiúsculas/minúsculas
        const args = parts.slice(1);

        printLine(`<span class="input-history"><span class="prompt">sec_shell@mainframe:~$</span> ${command}</span>`);

        switch (cmd) {
            case 'help':
                printLine(`Comandos disponíveis:\n${helpText}`);
                break;
            case 'ls':
                const items = filesystem;
                let outputStr = '';
                for (const item in items) {
                    if (items[item].type === 'directory') {
                        outputStr += `<span class="directory">${item}/</span>\n`;
                    } else {
                        outputStr += `<span class="file">${item}</span>\n`;
                    }
                }
                printLine(outputStr.trim());
                break;
            case 'cat':
                if (args.length === 0) {
                    printError('cat: missing operand. Usage: cat [filename]');
                    break;
                }
                const filename = args[0];
                const file = filesystem[filename];
                if (file && file.type === 'file') {
                    printLine(file.content);
                } else if (filesystem[filename] && filesystem[filename].type === 'directory') {
                    printError(`cat: ${filename}: Is a directory`);
                } else {
                    printError(`cat: ${filename}: No such file or directory`);
                }
                break;
            case 'whoami':
                printLine(filesystem['whoami.txt'].content);
                break;
            case 'contato':
                printLine(filesystem['contato.txt'].content);
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case 'banner':
                printBanner();
                break;
            case '':
                break;
            default:
                printError(`command not found: ${cmd}. Digite 'help' para ver a lista de comandos.`);
        }
    };

    // --- Funções Auxiliares ---
    const printLine = (text) => {
        output.innerHTML += `<div class="output-line">${text.replace(/\n/g, '<br>')}</div>`;
        scrollToBottom();
    };

    const printError = (text) => {
        output.innerHTML += `<div class="output-line error">${text}</div>`;
        scrollToBottom();
    };

    const scrollToBottom = () => {
        terminal.scrollTop = terminal.scrollHeight;
        output.scrollTop = output.scrollHeight;
    };
    
    // --- FUNÇÃO MODIFICADA ---
    const printBanner = () => {
        const banner = `
<pre>
  _________.__           .__  .__   
 /   _____/|  |__   ____ |  | |  |  
 \_____  \ |  |  \_/ __ \|  | |  |  
 /        \|   Y  \  ___/|  |_|  |__
/_______  /|___|  /\___  >____/____/
        \/      \/     \/           
</pre>
Bem-vindo ao meu terminal. Use os comandos abaixo para navegar:
`;
        printLine(banner + '\n' + helpText); // Concatena o banner com a ajuda
    };

    // --- Event Listeners ---
    inputLine.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = inputLine.value;
            executeCommand(command);
            inputLine.value = '';
        }
    });

    terminal.addEventListener('click', () => {
        inputLine.focus();
    });

    // Inicia o terminal com o banner
    printBanner();
});
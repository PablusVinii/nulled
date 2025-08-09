document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const inputLine = document.getElementById('input-line');
    const terminal = document.getElementById('terminal');

    // --- SEU CONTEÚDO VAI AQUI ---
    // Simulação de um sistema de arquivos. É aqui que você adiciona seus artigos, projetos, etc.
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

    let currentPath = []; // Começa na raiz

    const executeCommand = (command) => {
        const parts = command.trim().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        // Adiciona o comando digitado ao output
        printLine(`<span class="input-history"><span class="prompt">sec_shell@mainframe:~$</span> ${command}</span>`);

        switch (cmd) {
            case 'help':
                printLine(`Comandos disponíveis:
  <span class="directory">help</span>      - Mostra esta mensagem de ajuda.
  <span class="directory">ls</span>        - Lista arquivos e diretórios.
  <span class="directory">cat</span> [arq] - Mostra o conteúdo de um arquivo.
  <span class="directory">whoami</span>    - Mostra uma breve bio.
  <span class="directory">clear</span>     - Limpa a tela do terminal.
  <span class="directory">banner</span>    - Mostra o banner inicial.`);
                break;
            case 'ls':
                const path = args[0] || '';
                const items = getItems(path);
                if (items) {
                    let outputStr = '';
                    for (const item in items.content) {
                        if (items.content[item].type === 'directory') {
                            outputStr += `<span class="directory">${item}/</span>\n`;
                        } else {
                            outputStr += `<span class="file">${item}</span>\n`;
                        }
                    }
                    printLine(outputStr.trim());
                } else {
                    printError(`ls: cannot access '${path}': No such file or directory`);
                }
                break;
            case 'cat':
                if (args.length === 0) {
                    printError('cat: missing operand');
                    break;
                }
                const file = getItems(args[0]);
                if (file && file.type === 'file') {
                    printLine(file.content);
                } else {
                    printError(`cat: ${args[0]}: No such file or directory`);
                }
                break;
            case 'whoami':
                printLine(filesystem['whoami.txt'].content);
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case 'banner':
                printBanner();
                break;
            case '':
                break; // Não faz nada se o comando for vazio
            default:
                printError(`command not found: ${cmd}. Digite 'help' para ver a lista de comandos.`);
        }
    };

    // --- Funções Auxiliares ---

    const getItems = (pathStr) => {
        let currentLevel = filesystem;
        if (pathStr) {
            const pathParts = pathStr.split('/').filter(p => p);
            for (const part of pathParts) {
                if (currentLevel[part] && currentLevel[part].type === 'directory') {
                    currentLevel = currentLevel[part].content;
                } else if (currentLevel[part] && currentLevel[part].type === 'file' && part === pathParts[pathParts.length - 1]) {
                    return currentLevel[part];
                } else {
                    return null; // Caminho inválido
                }
            }
        }
        return { type: 'directory', content: currentLevel };
    };

    const printLine = (text) => {
        output.innerHTML += `<div class="output-line">${text}</div>`;
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
Bem-vindo ao meu terminal.
Digite '<span class="directory">help</span>' para começar.
`;
        printLine(banner);
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
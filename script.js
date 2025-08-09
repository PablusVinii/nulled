document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const inputLine = document.getElementById('input-line');
    const terminal = document.getElementById('terminal');
    const promptElement = document.querySelector('.prompt'); // Seleciona o elemento do prompt

    // --- SEU CONTEÚDO (ESTRUTURA DE ARQUIVOS) ---
    const filesystem = {
        'articles': {
            type: 'directory',
            content: {
                'pentest-101.txt': {
                    type: 'file',
                    content: `
# Pentest 101: Uma Introdução Prática

O Pentest, ou Teste de Intrusão, é uma simulação controlada de um ataque cibernético
contra um sistema para verificar vulnerabilidades exploráveis.

## Fases de um Pentest:
1.  Reconhecimento (Reconnaissance)
2.  Varredura (Scanning)
3.  Obtenção de Acesso (Gaining Access)
4.  Manutenção de Acesso (Maintaining Access)
5.  Análise e Relatório (Analysis & Reporting)

(Continue seu artigo aqui...)
`
                },
                'analise-malware.md': {
                    type: 'file',
                    content: `
# Análise de Malware para Iniciantes

Analisar malware é como ser um detetive digital. Requer um ambiente seguro (VM!) e ferramentas.

### Análise Estática:
-   **Hashes:** Identificar o arquivo (MD5, SHA256).
-   **Strings:** Procurar por texto legível (URLs, IPs, comandos).
-   **Headers:** Analisar a estrutura do arquivo (PE, ELF).

(Continue seu artigo aqui...)
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
# O uso indevido de keyloggers é ilegal.

from pynput.keyboard import Key, Listener

def on_press(key):
    print(f'{key} pressionada')

# O código continua...
(Coloque a descrição ou o código do seu projeto aqui)
`
                }
            }
        },
        'whoami.txt': { type: 'file', content: `Olá, sou sec_shell. Um entusiasta de cibersegurança focado em Red Team.` },
        'contato.txt': { type: 'file', content: `Você pode me encontrar em:\n- GitHub:   <a href="https://github.com/seu-usuario" target="_blank">github.com/seu-usuario</a>\n- LinkedIn: <a href="https://linkedin.com/in/seu-usuario" target="_blank">linkedin.com/in/seu-usuario</a>` }
    };

    let currentPath = []; // NOVO: Rastreia o caminho atual. [] = raiz.

    const helpText = `
<span class="directory">ls</span>              - Lista arquivos e diretórios.
<span class="directory">cd [dir]</span>        - Navega entre diretórios ('cd ..' para voltar).
<span class="directory">cat [arquivo]</span>     - Mostra o conteúdo de um arquivo.
<span class="directory">whoami</span>          - Mostra uma breve bio sobre mim.
<span class="directory">contato</span>         - Exibe minhas informações de contato.
<span class="directory">help</span>            - Mostra esta lista de comandos novamente.
<span class="directory">clear</span>           - Limpa a tela do terminal.
<span class="directory">banner</span>          - Mostra a mensagem inicial.`;

    // --- FUNÇÕES DE NAVEGAÇÃO E EXECUÇÃO (MODIFICADAS) ---

    // Função para obter o conteúdo do caminho atual
    const getCurrentDirContent = () => {
        let current = filesystem;
        for (const dir of currentPath) {
            current = current[dir].content;
        }
        return current;
    };
    
    // Função para resolver um caminho e encontrar um item
    const resolvePath = (path) => {
        const parts = path.split('/').filter(p => p);
        let current = getCurrentDirContent();
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!current[part]) return null;
            if (i === parts.length - 1) return current[part];
            if (current[part].type !== 'directory') return null;
            current = current[part].content;
        }
        return null;
    };

    const executeCommand = (command) => {
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        printLine(`<span class="input-history"><span class="prompt">${getPrompt()}</span> ${command}</span>`);

        const currentDir = getCurrentDirContent();

        switch (cmd) {
            case 'cd':
                const dir = args[0];
                if (!dir || dir === '~') {
                    currentPath = [];
                } else if (dir === '..') {
                    if (currentPath.length > 0) currentPath.pop();
                } else if (currentDir[dir] && currentDir[dir].type === 'directory') {
                    currentPath.push(dir);
                } else {
                    printError(`cd: no such file or directory: ${dir}`);
                }
                updatePrompt();
                break;

            case 'ls':
                const items = currentDir;
                let outputStr = '';
                for (const item in items) {
                    if (items[item].type === 'directory') {
                        outputStr += `<span class="directory">${item}/</span>\n`;
                    } else {
                        outputStr += `<span class="file">${item}</span>\n`;
                    }
                }
                printLine(outputStr.trim() || ' ');
                break;
                
            case 'cat':
                if (args.length === 0) {
                    printError('cat: missing operand'); break;
                }
                const file = resolvePath(args[0]);
                if (file && file.type === 'file') {
                    printLine(file.content);
                } else {
                    printError(`cat: ${args[0]}: No such file or directory`);
                }
                break;

            // Comandos que não mudaram
            case 'help': printLine(`Comandos disponíveis:\n${helpText}`); break;
            case 'whoami': printLine(filesystem['whoami.txt'].content); break;
            case 'contato': printLine(filesystem['contato.txt'].content); break;
            case 'clear': output.innerHTML = ''; break;
            case 'banner': printBanner(); break;
            case '': break;
            default: printError(`command not found: ${cmd}`);
        }
    };

    // --- FUNÇÕES AUXILIARES E DE INTERFACE ---
    const getPrompt = () => {
        const path = currentPath.length > 0 ? `~/${currentPath.join('/')}` : '~';
        return `sec_shell@mainframe:<span class="path">${path}</span>$`;
    };

    const updatePrompt = () => {
        promptElement.innerHTML = getPrompt();
    };


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
Bem-vindo ao meu terminal. Use os comandos abaixo para navegar:`;
        printLine(banner + '\n\n' + helpText);
    };

    // --- EVENT LISTENERS ---
    inputLine.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && inputLine.value.trim() !== "") {
            executeCommand(inputLine.value);
            inputLine.value = '';
        }
    });

    terminal.addEventListener('click', () => { inputLine.focus(); });

    // Inicia o terminal
    printBanner();
    updatePrompt();
});
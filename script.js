document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const inputLine = document.getElementById('input-line');
    const terminal = document.getElementById('terminal');
    const promptElement = document.querySelector('.prompt');

    // --- SEU CONTEÚDO (ESTRUTURA DE ARQUIVOS) ---
    const filesystem = {    
        'articles': {
            type: 'directory',
            content: {
                'pentest-101.txt': { type: 'file', content: `\n# Pentest 101: Uma Introdução Prática\n\nO Pentest, ou Teste de Intrusão, é uma simulação controlada de um ataque cibernético...\n(Continue seu artigo aqui...)\n` },
                'analise-malware.md': { type: 'file', content: `\n# Análise de Malware para Iniciantes\n\nAnalisar malware é como ser um detetive digital. Requer um ambiente seguro (VM!) e ferramentas...\n(Continue seu artigo aqui...)\n` }
            }
        },
        'projects': {
            type: 'directory',
            content: { 'keylogger-didatico.py': { type: 'file', content: `\n# ATENÇÃO: Este código é para fins puramente educacionais.\n# O uso indevido de keyloggers é ilegal.\n\n(Coloque a descrição ou o código do seu projeto aqui)\n` } }
        },
        'whoami.txt': { type: 'file', content: `Olá, sou sec_shell. Um entusiasta de cibersegurança focado em Red Team.` },
        'contato.txt': { type: 'file', content: `Você pode me encontrar em:\n- GitHub:   <a href="https://github.com/seu-usuario" target="_blank">github.com/seu-usuario</a>\n- LinkedIn: <a href="https://linkedin.com/in/seu-usuario" target="_blank">linkedin.com/in/seu-usuario</a>` }
    };

    let currentPath = [];
    const helpText = `
<span class="directory">ls</span>              - Lista arquivos e diretórios.
<span class="directory">cd [dir]</span>        - Navega entre diretórios ('cd ..' para voltar).
<span class="directory">cat [arquivo]</span>     - Mostra o conteúdo de um arquivo.
<span class="directory">whoami</span>          - Mostra uma breve bio sobre mim.
<span class="directory">contato</span>         - Exibe minhas informações de contato.
<span class="directory">help</span>            - Mostra esta lista de comandos novamente.
<span class="directory">clear</span>           - Limpa a tela do terminal.
<span class="directory">banner</span>          - Mostra a mensagem inicial.`;

    const getCurrentDirContent = () => {
        return currentPath.reduce((dir, path) => dir[path].content, filesystem);
    };

    const executeCommand = (command, suppressEcho = false) => {
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (!suppressEcho) {
            printLine(`<span class="input-history"><span class="prompt">${getPrompt()}</span> ${command}</span>`);
        }

        const currentDir = getCurrentDirContent();

        switch (cmd) {
            case 'cd':
                const dir = args[0];
                if (!dir || dir === '~') currentPath = [];
                else if (dir === '..') { if (currentPath.length > 0) currentPath.pop(); }
                else if (currentDir[dir] && currentDir[dir].type === 'directory') currentPath.push(dir);
                else printError(`cd: no such file or directory: ${dir}`);
                updatePrompt();
                break;

            case 'ls':
                const items = currentDir;
                let outputStr = '';
                for (const item in items) {
                    if (items[item].type === 'directory') {
                        // MODIFICADO: Usa data-type e data-path para ações diretas
                        outputStr += `<span class="directory clickable" data-type="directory" data-path="${item}">${item}/</span>\n`;
                    } else {
                        outputStr += `<span class="file clickable" data-type="file" data-path="${item}">${item}</span>\n`;
                    }
                }
                printLine(outputStr.trim() || ' ');
                break;
                
            case 'cat':
                if (args.length === 0) { printError('cat: missing operand'); break; }
                const file = currentDir[args[0]];
                if (file && file.type === 'file') printLine(file.content);
                else printError(`cat: ${args[0]}: No such file or directory`);
                break;
            
            case 'help': printLine(`Comandos disponíveis:\n${helpText}`); break;
            case 'whoami': printLine(filesystem['whoami.txt'].content); break;
            case 'contato': printLine(filesystem['contato.txt'].content); break;
            case 'clear': output.innerHTML = ''; break;
            case 'banner': printBanner(); break;
            case '': break;
            default: printError(`command not found: ${cmd}`);
        }
    };

    // --- FUNÇÕES AUXILIARES ---
    const getPrompt = () => `sec_shell@mainframe:<span class="path">~/${currentPath.join('/')}</span>$`;
    const updatePrompt = () => { promptElement.innerHTML = getPrompt(); };
    const printLine = (text) => { output.innerHTML += `<div class="output-line">${text.replace(/\n/g, '<br>')}</div>`; scrollToBottom(); };
    const printError = (text) => { output.innerHTML += `<div class="output-line error">${text}</div>`; scrollToBottom(); };
    const scrollToBottom = () => { output.scrollTop = output.scrollHeight; };
    const printBanner = () => { printLine(`<pre>  _________.__           .__  .__   \n /   _____/|  |__   ____ |  | |  |  \n \\_____  \\ |  |  \\_/ __ \\|  | |  |  \n /        \\|   Y  \\  ___/|  |_|  |__\n/_______  /|___|  /\\___  >____/____/\n        \\/      \\/     \\/           </pre>Bem-vindo ao meu terminal. Use os comandos ou clique nos itens para navegar:\n\n${helpText}`); };

    // --- EVENT LISTENERS ---
    inputLine.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand(inputLine.value);
            inputLine.value = '';
        }
    });

    terminal.addEventListener('click', () => { inputLine.focus(); });

    // --- LÓGICA DE CLIQUE MODIFICADA ---
    output.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('clickable')) {
            const type = target.getAttribute('data-type');
            const path = target.getAttribute('data-path');

            if (type === 'directory') {
                // Ação para diretório: entra e lista o conteúdo
                executeCommand(`cd ${path}`, true); // O 'true' suprime o eco do comando
                executeCommand('ls', true);          // Executa 'ls' silenciosamente
            } else if (type === 'file') {
                // Ação para arquivo: mostra o conteúdo
                executeCommand(`cat ${path}`, true);
            }
        }
    });

    // Inicia o terminal
    printBanner();
    updatePrompt();
});
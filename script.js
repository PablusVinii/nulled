document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const line1 = document.getElementById('typing-line1');
    const line2 = document.getElementById('typing-line2');

    // Textos a serem digitados
    const text1 = 'sec_shell@mainframe ~$';
    const text2 = 'Compartilhando conteúdo sobre cibersegurança.';

    // Configurações da animação
    const typingSpeed = 80 // Milissegundos por caractere
    const delayBetweenLines = 300; // Atraso antes de começar a segunda linha

    // HTML do cursor
    const cursorHTML = '<span class="cursor"></span>';

    /**
     * Função que simula o efeito de digitação.
     * @param {HTMLElement} element - O elemento onde o texto será inserido.
     * @param {string} text - O texto a ser digitado.
     * @param {Function} callback - A função a ser executada quando a digitação terminar.
     */
    function typeWriter(element, text, callback) {
        let i = 0;
        element.innerHTML = ''; // Limpa o elemento

        const interval = setInterval(() => {
            if (i < text.length) {
                // Adiciona um caractere e o cursor piscando
                element.innerHTML = text.substring(0, i + 1) + cursorHTML;
                i++;
            } else {
                // Limpa o intervalo e executa o callback
                clearInterval(interval);
                // Remove o cursor temporário da linha atual antes de passar para a próxima
                element.innerHTML = text; 
                if (callback) {
                    setTimeout(callback, delayBetweenLines);
                }
            }
        }, typingSpeed);
    }

    // Inicia a sequência de animação
    typeWriter(line1, text1, () => {
        // Quando a primeira linha terminar, começa a segunda
        typeWriter(line2, text2, () => {
            // Quando a segunda linha terminar, adiciona o cursor permanente
            line2.innerHTML += cursorHTML;
        });
    });
});
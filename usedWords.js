// Sistema de gestión de palabras usadas
// Este archivo mantiene el registro de las palabras que ya han sido utilizadas

class UsedWordsManager {
    constructor() {
        this.storageKey = 'impostor_used_words';
        this.loadUsedWords();
    }

    // Cargar palabras usadas desde localStorage
    loadUsedWords() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.usedWords = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading used words:', error);
            this.usedWords = [];
        }
    }

    // Guardar palabras usadas en localStorage
    saveUsedWords() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.usedWords));
        } catch (error) {
            console.error('Error saving used words:', error);
        }
    }

    // Agregar una palabra a la lista de usadas
    addUsedWord(word) {
        if (!this.usedWords.includes(word)) {
            this.usedWords.push(word);
            this.saveUsedWords();
        }
    }

    // Verificar si una palabra ya fue usada
    isWordUsed(word) {
        return this.usedWords.includes(word);
    }

    // Obtener todas las palabras usadas
    getUsedWords() {
        return [...this.usedWords];
    }

    // Obtener el número de palabras usadas
    getUsedWordsCount() {
        return this.usedWords.length;
    }

    // Limpiar todas las palabras usadas (resetear)
    clearUsedWords() {
        this.usedWords = [];
        this.saveUsedWords();
    }

    // Obtener palabras disponibles (no usadas) del banco
    getAvailableWords(wordBank) {
        return wordBank.filter(word => !this.isWordUsed(word));
    }

    // Seleccionar una palabra aleatoria que no haya sido usada
    getRandomUnusedWord(wordBank) {
        const availableWords = this.getAvailableWords(wordBank);
        
        // Si todas las palabras han sido usadas, resetear
        if (availableWords.length === 0) {
            console.log('Todas las palabras han sido usadas. Reiniciando banco...');
            this.clearUsedWords();
            return this.getRandomUnusedWord(wordBank);
        }

        // Seleccionar palabra aleatoria
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const selectedWord = availableWords[randomIndex];
        
        // Marcar como usada
        this.addUsedWord(selectedWord);
        
        return selectedWord;
    }

    // Obtener estadísticas
    getStats(wordBank) {
        const total = wordBank.length;
        const used = this.usedWords.length;
        const available = total - used;
        const percentage = ((used / total) * 100).toFixed(1);

        return {
            total,
            used,
            available,
            percentage
        };
    }

    // Exportar palabras usadas como JSON (para respaldo)
    exportUsedWords() {
        return JSON.stringify(this.usedWords, null, 2);
    }

    // Importar palabras usadas desde JSON
    importUsedWords(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (Array.isArray(imported)) {
                this.usedWords = imported;
                this.saveUsedWords();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing used words:', error);
            return false;
        }
    }
}

// Exportar la clase
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UsedWordsManager;
}

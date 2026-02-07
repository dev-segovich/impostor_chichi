# 🕵️ El Impostor - Juego de Roles

Un juego interactivo del impostor optimizado para dispositivos móviles.

## 🔐 Acceso

**PIN:** `7845`

## 🎮 Características

### Sistema de Palabras 📚

- **Banco extenso de 500+ palabras** (sustantivos variados)
- **Sistema anti-repetición**: Las palabras usadas se guardan automáticamente
- **Categorías diversas**: Animales, comida, objetos, naturaleza, profesiones, y más
- **Auto-reset**: Cuando se usan todas las palabras, el banco se reinicia automáticamente
- **Persistencia**: Las palabras usadas se guardan en el navegador (localStorage)

### Modos de Juego

1. **Un Solo Teléfono** ✅ (Funcional)
   - **Nombres Personalizados**: Escribe el nombre de cada jugador
   - Todos los jugadores pasan el mismo dispositivo
   - Configuración de 3-20 jugadores
   - Revelación secreta de roles con indicador de turno por nombre

2. **Varios Teléfonos** 🚧 (En desarrollo)
   - Cada jugador usa su propio dispositivo
   - Sistema de códigos de sala

## 📱 Cómo Jugar (Modo Un Solo Teléfono)

1. Ingresa la contraseña "CEL"
2. Selecciona "Un Solo Teléfono"
3. Configura el número de jugadores (3-20)
4. Configura el número de impostores (1 hasta N-1)
5. Presiona "Iniciar Juego"
6. Cada jugador toca la pantalla para ver su rol
7. Pasa el teléfono al siguiente jugador
8. ¡Que comience el juego!

## 🎨 Diseño

- Diseño responsive optimizado para móviles
- Gradiente animado de fondo
- Tarjetas con efecto glassmorphism
- Animaciones suaves y micro-interacciones
- Tipografía moderna (Google Fonts - Outfit)

## 🛠️ Tecnologías

- HTML5
- CSS3 (Vanilla CSS con animaciones)
- JavaScript (Vanilla JS)
- Sin dependencias externas

## 📂 Estructura del Proyecto

```
impostor_chichi/
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos y animaciones
├── app.js          # Lógica del juego
├── words.js        # Banco de 500+ palabras
├── usedWords.js    # Sistema de gestión de palabras usadas
└── README.md       # Este archivo
```

## 🚀 Instalación

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. O accede vía servidor local: `http://localhost/impostor_chichi/`

---

Desarrollado con ❤️ para Sofía

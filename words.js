// Banco de palabras para el juego del impostor
// Todas son sustantivos comunes y fáciles de describir

const WORD_BANK = [
    // Animales
    "Perro", "Gato", "Elefante", "León", "Tigre", "Jirafa", "Cebra", "Mono", "Loro", "Águila",
    "Delfín", "Ballena", "Tiburón", "Pingüino", "Oso", "Lobo", "Zorro", "Conejo", "Ardilla", "Ratón",
    "Caballo", "Vaca", "Cerdo", "Oveja", "Gallina", "Pato", "Pavo", "Búfalo", "Camello", "Canguro",
    "Koala", "Panda", "Serpiente", "Cocodrilo", "Tortuga", "Rana", "Mariposa", "Abeja", "Hormiga", "Araña",
    
    // Comida y Bebida
    "Pizza", "Hamburguesa", "Pasta", "Sushi", "Tacos", "Paella", "Arroz", "Pan", "Queso", "Mantequilla",
    "Chocolate", "Helado", "Pastel", "Galleta", "Donut", "Café", "Té", "Jugo", "Agua", "Refresco",
    "Cerveza", "Vino", "Leche", "Yogurt", "Cereal", "Huevo", "Tocino", "Salchicha", "Pollo", "Carne",
    "Pescado", "Camarón", "Ensalada", "Sopa", "Sandwich", "Hot Dog", "Burrito", "Nachos", "Palomitas", "Papas",
    "Manzana", "Banana", "Naranja", "Fresa", "Uva", "Sandía", "Melón", "Piña", "Mango", "Pera",
    "Durazno", "Cereza", "Limón", "Coco", "Kiwi", "Aguacate", "Tomate", "Zanahoria", "Lechuga", "Cebolla",
    
    // Objetos del hogar
    "Mesa", "Silla", "Sofá", "Cama", "Almohada", "Lámpara", "Espejo", "Reloj", "Televisor", "Radio",
    "Teléfono", "Computadora", "Teclado", "Mouse", "Monitor", "Impresora", "Cámara", "Micrófono", "Audífonos", "Bocinas",
    "Refrigerador", "Estufa", "Horno", "Microondas", "Licuadora", "Cafetera", "Tostadora", "Plancha", "Aspiradora", "Lavadora",
    "Secadora", "Ventilador", "Aire Acondicionado", "Calentador", "Termómetro", "Báscula", "Reloj Despertador", "Calendario", "Cuadro", "Florero",
    "Cortina", "Alfombra", "Cojín", "Manta", "Toalla", "Jabón", "Champú", "Cepillo", "Peine", "Secadora de Pelo",
    
    // Ropa y Accesorios
    "Camisa", "Pantalón", "Vestido", "Falda", "Blusa", "Suéter", "Chaqueta", "Abrigo", "Bufanda", "Guantes",
    "Gorra", "Sombrero", "Zapatos", "Botas", "Sandalias", "Tenis", "Calcetines", "Corbata", "Cinturón", "Reloj de Pulsera",
    "Collar", "Pulsera", "Anillo", "Aretes", "Lentes", "Gafas de Sol", "Bolso", "Mochila", "Cartera", "Paraguas",
    
    // Transporte
    "Carro", "Bicicleta", "Motocicleta", "Autobús", "Tren", "Avión", "Barco", "Helicóptero", "Submarino", "Cohete",
    "Taxi", "Camión", "Ambulancia", "Patrulla", "Bomberos", "Tractor", "Scooter", "Patineta", "Patines", "Trineo",
    
    // Deportes y Juegos
    "Balón", "Pelota", "Raqueta", "Bate", "Guante", "Red", "Arco", "Canasta", "Tablero", "Dado",
    "Cartas", "Ajedrez", "Dominó", "Rompecabezas", "Muñeca", "Robot", "Peluche", "Lego", "Yoyo", "Cometa",
    
    // Naturaleza
    "Árbol", "Flor", "Rosa", "Girasol", "Margarita", "Tulipán", "Orquídea", "Cactus", "Palmera", "Pino",
    "Montaña", "Volcán", "Río", "Lago", "Mar", "Océano", "Playa", "Isla", "Desierto", "Selva",
    "Bosque", "Pradera", "Valle", "Cueva", "Cascada", "Arcoíris", "Nube", "Sol", "Luna", "Estrella",
    "Planeta", "Cometa", "Meteorito", "Rayo", "Trueno", "Lluvia", "Nieve", "Granizo", "Viento", "Tornado",
    
    // Lugares y Edificios
    "Casa", "Edificio", "Torre", "Castillo", "Palacio", "Iglesia", "Catedral", "Templo", "Mezquita", "Sinagoga",
    "Escuela", "Universidad", "Biblioteca", "Museo", "Teatro", "Cine", "Estadio", "Gimnasio", "Hospital", "Farmacia",
    "Restaurante", "Cafetería", "Panadería", "Supermercado", "Tienda", "Mall", "Banco", "Hotel", "Aeropuerto", "Estación",
    "Parque", "Zoológico", "Acuario", "Circo", "Feria", "Plaza", "Mercado", "Puerto", "Muelle", "Faro",
    
    // Profesiones (como sustantivos)
    "Médico", "Enfermera", "Maestro", "Profesor", "Estudiante", "Ingeniero", "Arquitecto", "Abogado", "Juez", "Policía",
    "Bombero", "Soldado", "Piloto", "Marinero", "Astronauta", "Científico", "Inventor", "Artista", "Pintor", "Escultor",
    "Músico", "Cantante", "Bailarín", "Actor", "Director", "Escritor", "Poeta", "Periodista", "Fotógrafo", "Chef",
    "Panadero", "Carnicero", "Pescador", "Granjero", "Jardinero", "Carpintero", "Plomero", "Electricista", "Mecánico", "Conductor",
    
    // Instrumentos Musicales
    "Piano", "Guitarra", "Violín", "Batería", "Trompeta", "Saxofón", "Flauta", "Clarinete", "Arpa", "Acordeón",
    "Tambor", "Maracas", "Pandereta", "Xilófono", "Armónica", "Banjo", "Ukelele", "Bajo", "Tuba", "Oboe",
    
    // Herramientas
    "Martillo", "Destornillador", "Llave", "Alicate", "Sierra", "Taladro", "Clavos", "Tornillos", "Tuercas", "Pernos",
    "Hacha", "Pala", "Rastrillo", "Tijeras", "Cuchillo", "Navaja", "Cinta Métrica", "Nivel", "Escalera", "Cuerda",
    
    // Tecnología
    "Tablet", "Laptop", "Smartphone", "Smartwatch", "Consola", "Control", "Joystick", "Disco Duro", "USB", "Cable",
    "Cargador", "Batería", "Pantalla", "Proyector", "Router", "Modem", "Antena", "Satélite", "Dron", "Robot",
    
    // Escuela y Oficina
    "Lápiz", "Pluma", "Bolígrafo", "Marcador", "Borrador", "Sacapuntas", "Regla", "Compás", "Transportador", "Calculadora",
    "Cuaderno", "Libro", "Revista", "Periódico", "Diccionario", "Enciclopedia", "Atlas", "Mapa", "Globo Terráqueo", "Pizarra",
    "Escritorio", "Archivero", "Engrapadora", "Perforadora", "Clips", "Chinchetas", "Cinta Adhesiva", "Pegamento", "Carpeta", "Sobre",
    
    // Cocina
    "Cuchara", "Tenedor", "Cuchillo de Mesa", "Plato", "Tazón", "Vaso", "Taza", "Jarra", "Botella", "Sartén",
    "Olla", "Cacerola", "Colador", "Rallador", "Pelador", "Abrelatas", "Sacacorchos", "Tabla de Cortar", "Rodillo", "Batidor",
    
    // Baño
    "Ducha", "Bañera", "Inodoro", "Lavabo", "Grifo", "Espejo de Baño", "Cortina de Baño", "Tapete", "Papel Higiénico", "Cepillo de Dientes",
    "Pasta Dental", "Hilo Dental", "Enjuague Bucal", "Rasuradora", "Crema de Afeitar", "Perfume", "Desodorante", "Loción", "Esponja", "Bata",
    
    // Jardín
    "Maceta", "Regadera", "Manguera", "Semilla", "Tierra", "Abono", "Fertilizante", "Invernadero", "Cerca", "Puerta",
    "Columpio", "Tobogán", "Hamaca", "Parrilla", "Fogata", "Leña", "Carbón", "Piedra", "Roca", "Arena",
    
    // Clima y Estaciones
    "Primavera", "Verano", "Otoño", "Invierno", "Amanecer", "Atardecer", "Mediodía", "Medianoche", "Aurora", "Crepúsculo",
    
    // Emociones y Conceptos (sustantivados)
    "Amor", "Amistad", "Felicidad", "Tristeza", "Alegría", "Miedo", "Valentía", "Paz", "Guerra", "Libertad",
    "Justicia", "Verdad", "Mentira", "Sueño", "Pesadilla", "Esperanza", "Fe", "Confianza", "Respeto", "Honor",
    
    // Cuerpo Humano
    "Cabeza", "Cara", "Ojo", "Nariz", "Boca", "Oreja", "Cuello", "Hombro", "Brazo", "Codo",
    "Mano", "Dedo", "Uña", "Pecho", "Espalda", "Cintura", "Cadera", "Pierna", "Rodilla", "Pie",
    "Corazón", "Pulmón", "Cerebro", "Estómago", "Hígado", "Riñón", "Hueso", "Músculo", "Piel", "Cabello",
    
    // Formas y Colores
    "Círculo", "Cuadrado", "Triángulo", "Rectángulo", "Estrella de Forma", "Corazón de Forma", "Esfera", "Cubo", "Pirámide", "Cilindro",
    "Rojo", "Azul", "Verde", "Amarillo", "Naranja", "Morado", "Rosa", "Negro", "Blanco", "Gris",
    
    // Números y Símbolos
    "Cero", "Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve",
    "Diez", "Veinte", "Cincuenta", "Cien", "Mil", "Millón", "Signo", "Símbolo", "Letra", "Número",
    
    // Materiales
    "Madera", "Metal", "Hierro", "Acero", "Oro", "Plata", "Bronce", "Cobre", "Aluminio", "Plástico",
    "Vidrio", "Cristal", "Papel", "Cartón", "Tela", "Algodón", "Seda", "Lana", "Cuero", "Goma",
    "Cemento", "Ladrillo", "Piedra Natural", "Mármol", "Granito", "Arcilla", "Cerámica", "Porcelana", "Yeso", "Pintura",
    
    // Vehículos Especiales
    "Grúa", "Excavadora", "Bulldozer", "Montacargas", "Carretilla", "Carrito de Compras", "Carriola", "Silla de Ruedas", "Camilla", "Andadera",
    
    // Electrónica
    "Bombilla", "Foco", "Interruptor", "Enchufe", "Extensión", "Pila", "Batería Recargable", "Panel Solar", "Generador", "Transformador",
    
    // Juguetes Adicionales
    "Trompo", "Canica", "Balero", "Resortera", "Pistola de Agua", "Globo", "Burbujas", "Plastilina", "Crayones", "Acuarelas",
    
    // Recipientes
    "Caja", "Bolsa", "Canasta", "Balde", "Cubeta", "Barril", "Tanque", "Frasco", "Lata", "Tubo",
    
    // Documentos
    "Pasaporte", "Licencia", "Certificado", "Diploma", "Título", "Contrato", "Recibo", "Factura", "Boleto", "Ticket",
    
    // Joyas y Piedras
    "Diamante", "Rubí", "Esmeralda", "Zafiro", "Perla", "Ámbar", "Jade", "Topacio", "Amatista", "Turquesa",
    
    // Festividades
    "Navidad", "Año Nuevo", "Pascua", "Halloween", "Cumpleaños", "Boda", "Graduación", "Aniversario", "Fiesta", "Celebración",
    
    // Adicionales Variados
    "Bandera", "Escudo", "Corona", "Trono", "Cetro", "Espada", "Escudo de Guerra", "Armadura", "Casco", "Lanza",
    "Arco y Flecha", "Ballesta", "Cañón", "Bomba", "Mina", "Ancla", "Timón", "Vela de Barco", "Remo", "Salvavidas",
    "Brújula", "Mapa del Tesoro", "Cofre", "Tesoro", "Moneda", "Billete", "Cheque", "Tarjeta", "Medalla", "Trofeo",
    "Premio", "Regalo", "Sorpresa", "Paquete", "Envío", "Correo", "Carta", "Postal", "Telegrama", "Mensaje"
];

// Exportar el banco de palabras
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WORD_BANK;
}

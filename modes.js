// Los juegos del bingo. Cada modo tiene sus textos, sus categorías (icono + color) y sus casillas.
// Para añadir un modo nuevo: copia uno, cambia la clave y añade su estilo en styles.css ([data-mode=clave]).
const MODES={
calle:{
 name:'Bingo callejero',short:'Callejero',icon:'calle',blurb:'Para un paseo por la ciudad',
 kicker:'Paseo por la ciudad',title:'Bingo <em>callejero</em>',
 sub:'Sal a pasear, busca lo que pone tu cartón y táchalo. ¡Gana quien cante bingo primero!',
 theme:'#e8432e',fx:'confetti',fxColors:['#ffd23f','#2546d8','#ffffff','#e8432e','#0f766e'],
 free:'LIBRE',
 play:'Jugar en pareja',
 playText:'Mándale el enlace a tu pareja o a tus amigos. Sin nombre, tendréis el mismo cartón y será una carrera. Si cada uno pone su nombre, cada uno tendrá un cartón distinto.',
 customTitle:'Cartón personalizado',
 customText:'Escribe tus propias casillas, una por línea: cosas de tu barrio, bromas vuestras… Todas salen en tu cartón, y si no llegas a llenarlo se completa con casillas de serie.',
 customPh:'Vecino del 3º regando\nAlguien con camiseta del Córdoba\nBurro o caballo',
 rules:['Elige tamaño: 3×3 para un paseo corto, 5×5 para una tarde entera.','Toca una casilla cuando veas eso por la calle. Si te equivocas, tócala otra vez.','Fila, columna o diagonal completa: ¡línea!','Todo el cartón tachado: ¡BINGO! El que lo canta primero, invita al café.'],
 win:'¡Te toca elegir dónde merendáis!',
 cats:{animal:['animal','#c2410c'],gente:['gente','#2546d8'],ropa:['ropa','#a21caf'],vehiculo:['vehiculo','#0f766e'],calle:['calle','#57534e'],cielo:['cielo','#0284c7'],comida:['helado','#d97706'],raro:['raro','#be123c']},
 items:{
 animal:['Perro con ropa','Perro en un bolso o carrito','Dos perros iguales','Perro salchicha','Gato en una ventana','Paloma comiendo algo raro','Perro con lacito','Perro tirando de su dueño'],
 gente:['Niño con globo','Pareja vestida a juego','Alguien hablando solo con cascos','Abuelo con boina','Alguien corriendo tras el bus','Despedida de soltero/a','Turista con mapa','Alguien bailando en la calle','Señora con carro de la compra','Bebé llorando','Alguien haciéndose un selfie','Músico callejero','Alguien en zapatillas de casa','Alguien con un ramo de flores','Persona disfrazada','Alguien cargando un mueble','Grupo con guía y banderita','Abuelos de la mano'],
 ropa:['Calcetines con sandalias','Sombrero llamativo','Camiseta de fútbol','Alguien vestido de un solo color','Gafas de sol en la cabeza','Abrigo de pelo','Chándal completo','Riñonera','Camiseta con frase en inglés','Pijama en la calle','Botas de agua'],
 vehiculo:['Coche con la L','Moto de reparto','Coche tuneado','Bici con cesta','Furgoneta de mudanza','Coche mal aparcado','Camión de la basura','Descapotable','Taxi libre','Grúa llevándose un coche','Patinete eléctrico','Coche con pegatinas','Autobús turístico'],
 calle:['Obra con vallas','Alguien leyendo en un banco','Grafiti de un animal','Cartel con faltas','Zapato abandonado','Buzón amarillo','Cola en una tienda','Ropa tendida en un balcón','Bandera en un balcón','Carrito de súper abandonado','Charco enorme','Cartel de se vende','Terraza llena','Fuente','Peluche perdido','Bicicleta sin rueda'],
 cielo:['Avión en el cielo','Nube con forma de algo','Árbol en flor','Macetas en una ventana','Luna de día','Pájaro en un cable','Hoja gigante'],
 comida:['Alguien con helado','Churrería','Alguien con barra de pan','Puesto de castañas','Café para llevar','Alguien comiendo andando','Bolsa de la panadería','Alguien con pipas'],
 raro:['Estatua humana','Alguien empujando un coche','Animal exótico de paseo','Alguien con loro o hurón','Coche lleno de globos','Algo de otra época']
 }
},
navidad:{
 name:'Bingo de la cena de Navidad',short:'Cena de Navidad',icon:'campana',blurb:'Frases de la familia y líos en la mesa',
 kicker:'Nochebuena · Navidad',title:'Bingo de la <em>cena</em>',
 sub:'Tacha lo que pasa en la mesa y lo que dice la familia. Quien cante bingo primero <b>se libra de fregar</b>.',
 theme:'#0f2e23',fx:'snow',fxColors:['#ffffff','#ffffff','#d9ac4f','#e5484d','#46b17b'],
 free:'¡Feliz Navidad!',
 play:'Jugar entre primos',
 playText:'Todos jugáis en la misma <b>mesa</b>, pero cada uno con su nombre tiene un cartón distinto. Mándales el enlace, que pongan su nombre y a vigilar a la familia.',
 customTitle:'Frases de vuestra familia',
 customText:'Cada familia tiene sus clásicos: el tío que saca la guitarra, la anécdota de cada año… Escribidlos aquí, uno por línea. Al compartir el enlace, los primos reciben estas mismas frases repartidas en sus cartones.',
 customPh:'El tío Paco saca la guitarra\nLa abuela dice que no ha cocinado nada\nAlguien cuenta lo del coche en la boda',
 rules:['Cada primo abre el enlace en su móvil y pone su nombre.','Cuando alguien de la mesa diga o haga lo de una casilla, se tacha. Si te equivocas, tócala otra vez.','La primera fila, columna o diagonal completa se canta: «¡Línea!». En voz baja, que no se enteren los mayores.','Cartón entero: ¡BINGO! Quien lo cante primero se libra de fregar.','Prohibido provocar las frases. Si hay dudas, decide la mesa de los primos.'],
 win:'Hoy te libras de fregar: que friegue el resto de la mesa.',
 cats:{dice:['dice','#b3202a'],comida:['cubiertos','#b45309'],mesa:['copa','#7e22ce'],tele:['tele','#0369a1'],familia:['familia','#15803d'],lio:['rayo','#c2410c'],sofa:['luna','#475569'],tradicion:['campana','#a16207']},
 items:{
 dice:['«¿Y tú para cuándo novio/a?»','«¡Cómo has crecido!»','«Estás más delgado/a»','«Estás más gordo/a»','«¿Para cuándo la boda?»','«¿Para cuándo el niño?»','«Ni machismo ni feminismo»','«Come, que no has comido nada»','«En mis tiempos…»','«¿Y los estudios qué tal?»',
  '«Este año no compramos tanto»','«Yo turrón no quiero» (y come)','«Esto antes no pasaba»','«¿Quién quiere más?»','«Llévate un táper»','«Apaga la tele, que estamos comiendo»',
  '«Qué rico está todo»','«Hay comida para un regimiento»','«El año que viene lo hacemos en tu casa»','«Ya no hay Navidades como las de antes»','«¿Y el trabajo, bien?»','«Tu primo ya se ha comprado un piso»'],
 comida:['Sobran langostinos','Alguien se quema con la sopa','El asado tarda más de lo previsto','Pelea por el último trozo','Alguien pela gambas con cuchillo y tenedor',
  'Mancha en el mantel bueno','Alguien no prueba nada «porque está a dieta»','Turrón duro que no hay quien parta','Sale el mismo postre de todos los años','Alguien repite tres veces','Se acaba el pan'],
 mesa:['Brindis que nadie escucha','Alguien da golpecitos a la copa','Se rompe una copa o un plato','Alguien pide silencio y no lo consigue','Faltan sillas',
  'Mesa supletoria para los primos','Alguien se sienta en el sitio de otro','Se brinda dos veces'],
 tele:['Videollamada con quien no ha venido','Foto de grupo que hay que repetir','Alguien con el móvil en la mesa','Audio de WhatsApp a todo volumen',
  'Llega una felicitación en cadena','El abuelo no sabe colgar la videollamada','Alguien pone la tele «solo un momento»','Alguien sube una historia de la cena'],
 familia:['Alguien llega tarde','Anécdota de siempre contada otra vez','Se habla de un familiar que no está','Alguien llora de emoción','Comparan a dos primos',
  'Niño debajo de la mesa','El perro pidiendo comida','Alguien se ofrece a fregar y no le dejan','Jersey navideño','Gorro de Papá Noel','Alguien saca fotos viejas','Alguien sale a tomar el aire'],
 lio:['Sale la política','Alguien dice «no vamos a hablar de política»','Discusión por fútbol','Se habla del precio de la vivienda','Alguien defiende una teoría rara',
  'Alguien que lo sabe todo de todo','Debate sobre a qué hora se cenaba antes','Alguien se ofende por una broma'],
 sofa:['Alguien se duerme en el sofá','Alguien se desabrocha el pantalón','Alguien dice «no puedo más» y sigue','Sacan la baraja o el parchís','Alguien bosteza sin disimulo','Se habla del cansancio del día'],
 tradicion:['Se cantan villancicos','Sale la pandereta o la zambomba','Alguien canta desafinando con ganas','Se comenta el árbol o el belén','Se pone el discurso en la tele','Alguien habla de la lotería']
 }
},
coche:{
 name:'Bingo del viaje en coche',short:'Viaje en coche',icon:'vehiculo',blurb:'Kilómetros de carretera y «¿cuánto queda?»',
 kicker:'Carretera y manta',title:'Bingo del <em>viaje</em>',
 sub:'Mira por la ventanilla y escucha lo que se dice dentro del coche. Quien cante bingo primero <b>elige la música</b> el resto del viaje.',
 theme:'#1d2430',fx:'confetti',fxColors:['#f5c400','#ffffff','#0f7a43','#f97316','#38bdf8'],
 free:'Área de descanso',
 play:'Jugar en el coche',
 playText:'Pasa el enlace a los del asiento de atrás. Sin nombre, todos tenéis el mismo cartón y gana quien vea las cosas antes. Si cada uno pone su nombre, cada uno tendrá un cartón distinto.',
 customTitle:'Casillas de vuestro viaje',
 customText:'¿Vais a un sitio concreto? Escribid lo que sabéis que vais a ver o a oír, una casilla por línea. Viajan dentro del enlace al compartirlo.',
 customPh:'Ver el cartel de Burgos\nPapá dice «esto me lo conozco»\nParada en el bar de siempre',
 rules:['El conductor no juega: bastante tiene con conducir.','Toca una casilla cuando la veas o la oigas. Si te equivocas, tócala otra vez.','Fila, columna o diagonal completa: ¡línea!','Cartón completo: ¡BINGO! Quien lo cante primero elige la música.','Lo que se ve desde el otro lado del coche también vale.'],
 win:'Te has ganado elegir la música hasta llegar.',
 cats:{frases:['dice','#c2410c'],carretera:['senal','#b45309'],vehiculos:['vehiculo','#0f766e'],paisaje:['montana','#15803d'],parada:['gasolina','#2546d8'],raro:['raro','#be123c']},
 items:{
 frases:['«¿Cuánto queda?»','«Tengo pis»','«Me mareo»','«Bajad la música»','«Esa canción otra vez no»','«Por aquí no era»','«El GPS dice otra cosa»','«¿Paramos a comer?»','«Yo aquí ya he estado»','«¡Que no me toques!»','«No hay cobertura»','«Pon el aire»','«Tengo hambre»','«Mira, mira, ¡ahí!» (y ya ha pasado)','«¿Quién ha traído agua?»'],
 carretera:['Radar','Peaje','Túnel largo','Rotonda con escultura rara','Señal de curva peligrosa','Señal de animales sueltos','Obras en la carretera','Atasco','Puente sobre un río','Pueblo con nombre gracioso','Cartel de bienvenida a otra provincia','Toro gigante en una colina','Cartel de «cambio de sentido»','Carretera recta hasta el horizonte'],
 vehiculos:['Caravana o autocaravana','Camión de animales','Coche con bicis en el techo','Coche de autoescuela','Tractor','Coche de otro país','Coche cargado hasta arriba','Guardia Civil de tráfico','Camión que lleva coches','Matrícula capicúa','Coche igual que el nuestro','Moto con dos personas','Ambulancia'],
 paisaje:['Vacas','Ovejas','Caballos','Molinos de viento','Castillo','Campo de girasoles','Embalse','Nieve en las montañas','Arcoíris','Nido de cigüeña','Olivos hasta donde alcanza la vista','Viñedos','Mar a lo lejos'],
 parada:['Área de servicio','Bocadillo en el coche','Alguien se duerme','Cola para el baño','Alguien compra algo raro en la gasolinera','Llenar el depósito','Foto en un mirador','Cantar todos juntos','Discusión por la música','Se derrama algo en el coche','Alguien se olvida algo en la parada'],
 raro:['Algo atado en el techo de un coche','Persona haciendo autostop','Animal en el arcén','Coche lleno de pegatinas','Alguien saluda desde otro coche','Coche con un muñeco en la ventana']
 }
},
playa:{
 name:'Bingo de la playa',short:'En la playa',icon:'sombrilla',blurb:'Sombrillas, chanclas y cocos fresquitos',
 kicker:'Día de playa',title:'Bingo de la <em>playa</em>',
 sub:'Desde la toalla, tacha lo que ves en la arena y en el agua. Quien cante bingo primero <b>no carga con la nevera</b> a la vuelta.',
 theme:'#0b8fa8',fx:'confetti',fxColors:['#ffd166','#ffffff','#ff6b6b','#06b6d4','#f4a261'],
 free:'¡Al agua!',
 play:'Jugar en la toalla',
 playText:'Pasa el enlace a tu grupo. Sin nombre, tenéis el mismo cartón y gana quien tenga mejor vista. Si cada uno pone su nombre, cada uno tendrá un cartón distinto.',
 customTitle:'Casillas de vuestra playa',
 customText:'Cada playa tiene lo suyo: el vendedor de siempre, el chiringuito, la roca de los saltos… Escribidlo aquí, una casilla por línea.',
 customPh:'El señor de los cocos pasa dos veces\nAlguien salta desde la roca\nCola en el chiringuito Pepe',
 rules:['Elige tamaño: 3×3 para una mañana, 5×5 para todo el día.','Toca una casilla cuando veas eso en la playa. Si te equivocas, tócala otra vez.','Fila, columna o diagonal completa: ¡línea!','Cartón completo: ¡BINGO! Quien lo cante primero no carga con la nevera.'],
 win:'A la vuelta, que otro cargue con la nevera.',
 cats:{gente:['gente','#2546d8'],mar:['ola','#0284c7'],cosas:['sombrilla','#be123c'],comida:['helado','#d97706'],cielo:['sol','#ca8a04'],frases:['dice','#c2410c']},
 items:{
 gente:['Alguien rojo como una gamba','Bañador muy pequeño','Alguien enterrado en la arena','Niño llorando por la arena','Pareja haciéndose fotos','Alguien durmiendo la siesta','Gente jugando a las palas','Alguien leyendo un libro gordo','Sombrero de paja enorme','Alguien haciendo yoga','Alguien con detector de metales','Socorrista silbando','Chanclas con calcetines','Bebé con gorrito','Toalla de un equipo de fútbol'],
 mar:['Bandera amarilla','Bandera roja','Medusa','Ola que moja una toalla','Alguien en paddle surf','Moto de agua','Barco a lo lejos','Alguien con gafas de buceo','Pez','Cangrejo','Alguien que no se mete porque está fría','Flotador que se lleva el viento'],
 cosas:['Sombrilla volando','Nevera portátil','Castillo de arena','Flotador con forma de animal','Pelota de playa','Toalla gigante','Altavoz con música','Cometa','Hamaca de alquiler','Cubo y pala olvidados','Chancla perdida'],
 comida:['Vendedor de cocos o mojitos','Bocadillo con arena','Sandía','Helado derritiéndose','Alguien comiendo pipas','Tortilla en un táper','Chiringuito lleno','Alguien con una bebida fría'],
 cielo:['Avioneta con publicidad','Gaviota robando comida','Puesta de sol','Nube con forma de algo','Helicóptero','Viento que lo levanta todo'],
 frases:['«El agua está buenísima» (y está helada)','«Échate crema»','«Espera a hacer la digestión»','«¿Quién vigila las cosas?»','«Me he quemado»','«Una ola más y salimos»','«¿Dónde está la sombrilla?»','«Ya hay que irse»']
 }
}
};

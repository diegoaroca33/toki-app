// PRIMERA VERSIÓN — generada automáticamente siguiendo criterios del doc
// consolidado §4.2 (pedagogía del 22/04) y patrones del corpus original.
// REVISAR antes de deploy a producción. Diego validará y aprobará.
//
// Causa-efecto / "Piensa" en 3 niveles:
//   BÁSICO: relaciones causa-efecto directas y cotidianas (1 paso de razonamiento).
//   AVANZADO: causa-efecto con servicios, profesiones y conceptos sociales.
//   MASTER: autonomía adulta, magnitudes funcionales, situaciones sutiles.
//
// Cada ítem: { q, opts: [string], ans: string }. El componente añade los
// distractores de las otras opciones; ans debe coincidir EXACTO con uno de opts.

export const PIENSA_BASICO = [
  // Necesidades físicas básicas
  {q:'Si llueve... ¿qué cojo?',opts:['☂️ Paraguas','🕶️ Gafas de sol'],ans:'☂️ Paraguas'},
  {q:'Si tengo hambre... ¿qué hago?',opts:['🍽️ Como','😴 Duermo'],ans:'🍽️ Como'},
  {q:'Si tengo sed... ¿qué cojo?',opts:['💧 Un vaso de agua','🧥 Un abrigo'],ans:'💧 Un vaso de agua'},
  {q:'Si tengo sueño... ¿qué hago?',opts:['🛏️ Me voy a dormir','⚽ Juego al fútbol'],ans:'🛏️ Me voy a dormir'},
  {q:'Si tengo calor... ¿qué hago?',opts:['🪟 Abro la ventana','🧥 Me pongo abrigo'],ans:'🪟 Abro la ventana'},
  {q:'Si hace frío... ¿qué me pongo?',opts:['🧥 Abrigo','👙 Bañador'],ans:'🧥 Abrigo'},
  {q:'Si hace sol... ¿qué me pongo?',opts:['🕶️ Gafas de sol','🧣 Bufanda'],ans:'🕶️ Gafas de sol'},
  {q:'Si me pica algo... ¿qué hago?',opts:['🤲 Me lo digo a un adulto','🙊 Me lo callo'],ans:'🤲 Me lo digo a un adulto'},
  {q:'Si tengo pis... ¿qué hago?',opts:['🚽 Voy al baño','😴 Espero un día'],ans:'🚽 Voy al baño'},
  {q:'Si me he caído... ¿qué hago?',opts:['🩹 Pido ayuda','😴 Me quedo en el suelo'],ans:'🩹 Pido ayuda'},

  // Acciones cotidianas en casa
  {q:'Si está oscuro... ¿qué enciendo?',opts:['💡 La luz','🚰 El grifo'],ans:'💡 La luz'},
  {q:'Si es de noche... ¿qué hago?',opts:['💡 Enciendo la luz','🕶️ Me pongo gafas'],ans:'💡 Enciendo la luz'},
  {q:'Si me he manchado... ¿qué hago?',opts:['🧼 Me lavo','📺 Veo la tele'],ans:'🧼 Me lavo'},
  {q:'Si suena el timbre... ¿qué hago?',opts:['🚪 Voy a abrir','😴 Sigo durmiendo'],ans:'🚪 Voy a abrir'},
  {q:'Si tengo las manos sucias... ¿qué hago?',opts:['🧼 Me las lavo','🍽️ Como con ellas'],ans:'🧼 Me las lavo'},
  {q:'Si he ensuciado el suelo... ¿qué hago?',opts:['🧹 Lo limpio','👟 Lo piso más'],ans:'🧹 Lo limpio'},
  {q:'Si veo basura en el suelo... ¿qué hago?',opts:['🗑️ La tiro a la papelera','👟 La piso'],ans:'🗑️ La tiro a la papelera'},

  // Salud básica
  {q:'Si me duele la cabeza... ¿qué hago?',opts:['🛌 Descanso','⚽ Sigo corriendo'],ans:'🛌 Descanso'},
  {q:'Si tengo fiebre... ¿qué hago?',opts:['🛌 Me meto en la cama','🏊 Voy a la piscina'],ans:'🛌 Me meto en la cama'},
  {q:'Si me he hecho daño... ¿qué hago?',opts:['🩹 Pido ayuda','🙊 No digo nada'],ans:'🩹 Pido ayuda'},
  {q:'Si voy a comer... ¿qué hago antes?',opts:['🧼 Me lavo las manos','📱 Veo el móvil'],ans:'🧼 Me lavo las manos'},
  {q:'Si he comido... ¿qué hago después?',opts:['🪥 Me lavo los dientes','🛌 Sigo comiendo'],ans:'🪥 Me lavo los dientes'},

  // Lugares y dónde voy
  {q:'Si quiero comprar pan... ¿dónde voy?',opts:['🥖 A la panadería','🏥 Al hospital'],ans:'🥖 A la panadería'},
  {q:'Si quiero comprar fruta... ¿dónde voy?',opts:['🍎 A la frutería','💈 A la peluquería'],ans:'🍎 A la frutería'},
  {q:'Si quiero medicina... ¿dónde voy?',opts:['💊 A la farmacia','🍕 A la pizzería'],ans:'💊 A la farmacia'},
  {q:'Si necesito un libro... ¿dónde voy?',opts:['📚 A la biblioteca','🍕 A la pizzería'],ans:'📚 A la biblioteca'},
  {q:'Si quiero nadar... ¿dónde voy?',opts:['🏊 A la piscina','📚 A la biblioteca'],ans:'🏊 A la piscina'},
  {q:'Si quiero jugar al aire libre... ¿dónde voy?',opts:['🌳 Al parque','🏥 Al hospital'],ans:'🌳 Al parque'},
  {q:'Si estoy enfermo... ¿dónde voy?',opts:['🏥 Al médico','🎬 Al cine'],ans:'🏥 Al médico'},

  // Relaciones y normas básicas
  {q:'Si alguien me da un regalo...',opts:['🙏 Doy las gracias','😤 No digo nada'],ans:'🙏 Doy las gracias'},
  {q:'Si he hecho algo mal...',opts:['🙏 Pido perdón','😤 Me río'],ans:'🙏 Pido perdón'},
  {q:'Si quiero algo de alguien...',opts:['🙏 Lo pido por favor','💢 Lo cojo sin pedir'],ans:'🙏 Lo pido por favor'},
  {q:'Si me llaman por mi nombre...',opts:['🙋 Contesto','🙊 No digo nada'],ans:'🙋 Contesto'},
  {q:'Si veo a alguien conocido...',opts:['👋 Saludo','🙈 Me escondo'],ans:'👋 Saludo'},
  {q:'Si un amigo está triste...',opts:['🤗 Le doy un abrazo','🏃 Me voy corriendo'],ans:'🤗 Le doy un abrazo'},
  {q:'Si es el cumpleaños de un amigo...',opts:['🎂 Le felicito','😶 No digo nada'],ans:'🎂 Le felicito'},
  {q:'Si me piden ayuda...',opts:['🤝 Ayudo si puedo','😴 Me voy'],ans:'🤝 Ayudo si puedo'},

  // Seguridad básica en la calle
  {q:'Si quiero cruzar la calle... ¿qué miro?',opts:['🚦 El semáforo','🕐 El reloj'],ans:'🚦 El semáforo'},
  {q:'Si quiero cruzar... ¿por dónde paso?',opts:['🚶 Por el paso de cebra','🏃 Por donde sea'],ans:'🚶 Por el paso de cebra'},
  {q:'Si voy en coche... ¿qué me pongo?',opts:['🚗 El cinturón','🕶️ Solo gafas'],ans:'🚗 El cinturón'},
  {q:'Si voy en bici... ¿qué me pongo?',opts:['🪖 El casco','👙 El bañador'],ans:'🪖 El casco'},
  {q:'Si veo fuego... ¿qué hago?',opts:['📞 Aviso a un adulto','🎮 Sigo jugando'],ans:'📞 Aviso a un adulto'},
  {q:'Si un desconocido me ofrece algo...',opts:['🚫 Digo no, gracias','🍬 Lo cojo siempre'],ans:'🚫 Digo no, gracias'},
  {q:'Si me pierdo en una tienda...',opts:['🛒 Me quedo quieto y pido ayuda','🏃 Salgo corriendo'],ans:'🛒 Me quedo quieto y pido ayuda'},

  // Ropa por el tiempo
  {q:'Si nieva... ¿qué me pongo?',opts:['🧥 Abrigo y botas','👙 Bañador'],ans:'🧥 Abrigo y botas'},
  {q:'Si voy a la playa... ¿qué me pongo?',opts:['👙 Bañador','🧥 Abrigo'],ans:'👙 Bañador'},
  {q:'Si voy a dormir... ¿qué me pongo?',opts:['🌙 El pijama','🩲 El bañador'],ans:'🌙 El pijama'},
  {q:'Si llueve y no tengo paraguas...',opts:['🏠 Espero bajo un techo','🏃 Corro bajo la lluvia'],ans:'🏠 Espero bajo un techo'},

  // Acciones secuenciales sencillas
  {q:'Si quiero un yogur...',opts:['🥄 Cojo una cuchara','👃 Lo huelo'],ans:'🥄 Cojo una cuchara'},
  {q:'Si quiero leer un cuento...',opts:['📖 Abro el libro','📺 Pongo la tele'],ans:'📖 Abro el libro'},
  {q:'Si quiero llamar por teléfono...',opts:['📱 Cojo el móvil','🛏️ Me acuesto'],ans:'📱 Cojo el móvil'},
];

export const PIENSA_AVANZADO = [
  // Servicios públicos y profesiones
  {q:'Si hay un incendio... ¿a quién llamo?',opts:['🚒 A los bomberos','🌳 Al jardinero'],ans:'🚒 A los bomberos'},
  {q:'Si veo un ladrón... ¿a quién llamo?',opts:['👮 A la policía','📬 Al cartero'],ans:'👮 A la policía'},
  {q:'Si alguien se desmaya... ¿a quién llamo?',opts:['🚑 A la ambulancia','🧹 Al barrendero'],ans:'🚑 A la ambulancia'},
  {q:'Si la calle está sucia... ¿quién la limpia?',opts:['🧹 El barrendero','🚒 El bombero'],ans:'🧹 El barrendero'},
  {q:'Si se rompe una tubería en casa... ¿a quién llamo?',opts:['🔧 Al fontanero','👨‍🍳 Al cocinero'],ans:'🔧 Al fontanero'},
  {q:'Si quiero cortarme el pelo... ¿dónde voy?',opts:['💈 A la peluquería','🏥 Al hospital'],ans:'💈 A la peluquería'},
  {q:'Si me duele una muela... ¿a quién voy?',opts:['🦷 Al dentista','🛒 Al cajero'],ans:'🦷 Al dentista'},
  {q:'Si necesito gafas... ¿a quién voy?',opts:['👓 A la óptica','🥖 A la panadería'],ans:'👓 A la óptica'},
  {q:'Si mi mascota está enferma... ¿a quién voy?',opts:['🐶 Al veterinario','🦷 Al dentista'],ans:'🐶 Al veterinario'},
  {q:'Si quiero comprar zapatos... ¿dónde voy?',opts:['👟 A la zapatería','💊 A la farmacia'],ans:'👟 A la zapatería'},

  // Medios de comunicación
  {q:'Si quiero hablar con mamá ahora...',opts:['📱 La llamo por teléfono','✉️ Le mando una carta'],ans:'📱 La llamo por teléfono'},
  {q:'Si quiero ver dibujos animados...',opts:['📺 Enciendo la tele','📞 Llamo por teléfono'],ans:'📺 Enciendo la tele'},
  {q:'Si quiero mandar un mensaje a un amigo...',opts:['📱 Le mando un mensaje','📻 Pongo la radio'],ans:'📱 Le mando un mensaje'},
  {q:'Si quiero escuchar música en el coche...',opts:['📻 Pongo la radio','✉️ Mando una carta'],ans:'📻 Pongo la radio'},
  {q:'Si quiero saber el tiempo de mañana...',opts:['📺 Veo el tiempo en la tele','📚 Abro un libro viejo'],ans:'📺 Veo el tiempo en la tele'},
  {q:'Si quiero buscar una palabra...',opts:['📱 La busco en internet','🛒 Voy al supermercado'],ans:'📱 La busco en internet'},

  // Transporte
  {q:'Si voy en tren... ¿dónde voy a esperarlo?',opts:['🚉 A la estación','✈️ Al aeropuerto'],ans:'🚉 A la estación'},
  {q:'Si voy en avión... ¿dónde voy?',opts:['✈️ Al aeropuerto','⚓ Al puerto'],ans:'✈️ Al aeropuerto'},
  {q:'Si voy en barco... ¿dónde voy?',opts:['⚓ Al puerto','🚉 A la estación'],ans:'⚓ Al puerto'},
  {q:'Si cojo un autobús... ¿dónde espero?',opts:['🚏 En la parada','✈️ En el aeropuerto'],ans:'🚏 En la parada'},
  {q:'Si voy en metro... ¿dónde voy a esperarlo?',opts:['🚇 En el andén','🚏 En la calle'],ans:'🚇 En el andén'},
  {q:'Si quiero pagar el bus... ¿qué necesito?',opts:['🎫 Tarjeta o dinero','📚 Un libro'],ans:'🎫 Tarjeta o dinero'},

  // Estaciones y meteorología
  {q:'Si las hojas se caen... ¿qué estación es?',opts:['🍂 Otoño','☀️ Verano'],ans:'🍂 Otoño'},
  {q:'Si hace mucho calor y vamos a la piscina...',opts:['☀️ Es verano','❄️ Es invierno'],ans:'☀️ Es verano'},
  {q:'Si salen flores y los pájaros cantan...',opts:['🌸 Es primavera','🍂 Es otoño'],ans:'🌸 Es primavera'},
  {q:'Si nieva y todo está blanco...',opts:['❄️ Es invierno','☀️ Es verano'],ans:'❄️ Es invierno'},
  {q:'Si hay tormenta... ¿qué hago?',opts:['🏠 Me quedo en casa','🏊 Voy a nadar'],ans:'🏠 Me quedo en casa'},
  {q:'Si va a llover... ¿qué cojo al salir?',opts:['☂️ Paraguas','🕶️ Gafas de sol'],ans:'☂️ Paraguas'},

  // Comida — preparación y elección
  {q:'Si quiero cocinar pasta... ¿qué necesito primero?',opts:['💧 Agua hirviendo','🍦 Helado'],ans:'💧 Agua hirviendo'},
  {q:'Si quiero hacer un bocadillo... ¿qué necesito?',opts:['🍞 Pan','🍦 Helado'],ans:'🍞 Pan'},
  {q:'Si la leche está caducada... ¿qué hago?',opts:['🗑️ La tiro','🥤 Me la bebo'],ans:'🗑️ La tiro'},
  {q:'Si la fruta está blanda y oscura... ¿qué hago?',opts:['🗑️ La tiro','🍽️ Me la como'],ans:'🗑️ La tiro'},
  {q:'Si quiero un postre saludable...',opts:['🍎 Una manzana','🍰 Una tarta'],ans:'🍎 Una manzana'},

  // Lugares y normas sociales
  {q:'Si voy al cine... ¿qué hago durante la película?',opts:['🤫 Estoy en silencio','📢 Hablo alto'],ans:'🤫 Estoy en silencio'},
  {q:'Si voy a la biblioteca... ¿cómo hablo?',opts:['🤫 En voz baja','📢 Gritando'],ans:'🤫 En voz baja'},
  {q:'Si voy al museo... ¿qué hago con los objetos?',opts:['👀 Solo los miro','🤚 Los toco todos'],ans:'👀 Solo los miro'},
  {q:'Si subo en ascensor con gente...',opts:['🙏 Espero mi turno','💢 Empujo'],ans:'🙏 Espero mi turno'},
  {q:'Si en el bus va una persona mayor de pie...',opts:['🪑 Le ofrezco mi asiento','😴 Me quedo sentado'],ans:'🪑 Le ofrezco mi asiento'},
  {q:'Si en una cola alguien se cuela...',opts:['🙏 Le digo que es mi turno','💢 Le empujo'],ans:'🙏 Le digo que es mi turno'},

  // Tiempo del día
  {q:'Si me despierto... ¿qué parte del día es?',opts:['🌅 La mañana','🌙 La noche'],ans:'🌅 La mañana'},
  {q:'Si voy a la cama... ¿qué parte del día es?',opts:['🌙 La noche','🌅 La mañana'],ans:'🌙 La noche'},
  {q:'Si meriendo... ¿qué parte del día es?',opts:['🕓 La tarde','🌙 La medianoche'],ans:'🕓 La tarde'},
  {q:'Si desayuno... ¿qué parte del día es?',opts:['🌅 La mañana','🌆 El atardecer'],ans:'🌅 La mañana'},

  // Sentimientos en situaciones
  {q:'Si gano un juego... ¿cómo me siento?',opts:['😊 Contento','😢 Triste'],ans:'😊 Contento'},
  {q:'Si pierdo a mi mascota un rato... ¿cómo me siento?',opts:['😟 Preocupado','🤣 Riendo'],ans:'😟 Preocupado'},
  {q:'Si alguien me grita sin razón... ¿cómo me siento?',opts:['😠 Enfadado o triste','😄 Muy contento'],ans:'😠 Enfadado o triste'},
  {q:'Si me dan un regalo sorpresa... ¿cómo me siento?',opts:['😲 Sorprendido y contento','😴 Aburrido'],ans:'😲 Sorprendido y contento'},
];

export const PIENSA_MASTER = [
  // Trámites adultos
  {q:'Si caduca mi DNI... ¿qué hago?',opts:['🪪 Pido cita para renovarlo','😴 Lo tiro'],ans:'🪪 Pido cita para renovarlo'},
  {q:'Si quiero ver al médico de familia... ¿qué hago?',opts:['📞 Pido cita previa','🚪 Me presento sin avisar'],ans:'📞 Pido cita previa'},
  {q:'Si me piden el DNI... ¿qué hago?',opts:['🪪 Lo enseño','🤫 Me niego siempre'],ans:'🪪 Lo enseño'},
  {q:'Si recibo una factura por correo... ¿qué hago?',opts:['💶 La pago en plazo','🗑️ La tiro sin abrir'],ans:'💶 La pago en plazo'},
  {q:'Si tengo que firmar algo... ¿qué hago primero?',opts:['👀 Lo leo bien','✍️ Firmo sin mirar'],ans:'👀 Lo leo bien'},
  {q:'Si me piden la contraseña por teléfono...',opts:['🔒 No la doy','🔓 La digo enseguida'],ans:'🔒 No la doy'},
  {q:'Si recibo un mensaje raro con un enlace...',opts:['🚫 No pulso el enlace','👆 Lo abro siempre'],ans:'🚫 No pulso el enlace'},
  {q:'Si necesito coger transporte público diario... ¿qué saco?',opts:['🎫 Un abono mensual','💸 Pago billete cada vez'],ans:'🎫 Un abono mensual'},

  // Servicios — tarjeta, banco, hospital
  {q:'Si pierdo la tarjeta del banco... ¿qué hago?',opts:['📞 Llamo al banco para anularla','🤐 No digo nada'],ans:'📞 Llamo al banco para anularla'},
  {q:'Si necesito pedir cita en el hospital... ¿cómo lo hago?',opts:['📞 Llamo o uso la app','🚪 Voy directamente'],ans:'📞 Llamo o uso la app'},
  {q:'Si voy a sacar dinero del cajero... ¿qué necesito?',opts:['💳 La tarjeta y el PIN','📚 Un libro'],ans:'💳 La tarjeta y el PIN'},
  {q:'Si pierdo las llaves de casa... ¿qué hago?',opts:['🗝️ Llamo a un cerrajero','🚪 Rompo la puerta'],ans:'🗝️ Llamo a un cerrajero'},
  {q:'Si recibo dinero de las vueltas... ¿qué hago?',opts:['🧮 Cuento que está bien','💸 Lo cojo sin mirar'],ans:'🧮 Cuento que está bien'},

  // Magnitudes funcionales
  {q:'¿Cuánto pesa más o menos un kilo de manzanas?',opts:['🍎 Unas 5 o 6 manzanas','🍎 Unas 100 manzanas'],ans:'🍎 Unas 5 o 6 manzanas'},
  {q:'¿Cuánto pesa más o menos una sandía?',opts:['🍉 Unos 4 kilos','🍉 Unos 100 gramos'],ans:'🍉 Unos 4 kilos'},
  {q:'¿Cuánto cuesta más o menos una barra de pan?',opts:['🥖 Algo más de un euro','🥖 Cien euros'],ans:'🥖 Algo más de un euro'},
  {q:'¿Cuánto cuesta más o menos un café en un bar?',opts:['☕ Sobre dos euros','☕ Doscientos euros'],ans:'☕ Sobre dos euros'},
  {q:'¿Cuánto tarda más o menos en hacerse un huevo cocido?',opts:['⏱️ Unos 10 minutos','⏱️ Cinco horas'],ans:'⏱️ Unos 10 minutos'},
  {q:'¿Cuánto dura más o menos una película?',opts:['⏱️ Sobre dos horas','⏱️ Tres días'],ans:'⏱️ Sobre dos horas'},
  {q:'¿Cuánto cuesta más o menos un billete de metro?',opts:['🎫 Unos pocos euros','🎫 Mil euros'],ans:'🎫 Unos pocos euros'},
  {q:'¿Cuánto pesa más o menos una bolsa de la compra llena?',opts:['🛍️ Unos 4 kilos','🛍️ Cien kilos'],ans:'🛍️ Unos 4 kilos'},

  // Situaciones sociales sutiles
  {q:'Si estoy en una entrevista de trabajo... ¿cómo voy vestido?',opts:['👔 Arreglado y limpio','👙 En bañador'],ans:'👔 Arreglado y limpio'},
  {q:'Si me invitan a una boda... ¿cómo voy vestido?',opts:['👔 Elegante','👕 En chándal'],ans:'👔 Elegante'},
  {q:'Si voy a una cita médica... ¿qué llevo?',opts:['🪪 DNI y tarjeta sanitaria','🎮 Solo el móvil'],ans:'🪪 DNI y tarjeta sanitaria'},
  {q:'Si tengo una reunión a las 10... ¿a qué hora salgo?',opts:['🕘 Con tiempo de sobra','🕙 Justo a las 10'],ans:'🕘 Con tiempo de sobra'},
  {q:'Si llego tarde a un sitio... ¿qué hago?',opts:['📞 Aviso','🤐 No digo nada'],ans:'📞 Aviso'},
  {q:'Si en el trabajo no entiendo algo... ¿qué hago?',opts:['🙋 Pregunto','😶 Lo dejo sin hacer'],ans:'🙋 Pregunto'},

  // Autonomía y autocuidado
  {q:'Si tengo medicación diaria... ¿qué hago?',opts:['💊 La tomo siempre a la misma hora','💊 La tomo cuando me acuerdo'],ans:'💊 La tomo siempre a la misma hora'},
  {q:'Si voy a viajar... ¿qué reviso antes?',opts:['🧳 La maleta y los billetes','🎮 Solo los videojuegos'],ans:'🧳 La maleta y los billetes'},
  {q:'Si me siento mal pero estoy solo... ¿a quién aviso?',opts:['📞 A un familiar o emergencias','🤐 No aviso a nadie'],ans:'📞 A un familiar o emergencias'},
  {q:'Si tengo una cita importante... ¿cómo lo recuerdo?',opts:['📅 Lo apunto en el calendario','🤞 Confío en mi memoria'],ans:'📅 Lo apunto en el calendario'},
  {q:'Si tengo que ir solo a un sitio nuevo... ¿qué hago?',opts:['🗺️ Miro cómo llegar antes','🚶 Salgo y a ver'],ans:'🗺️ Miro cómo llegar antes'},

  // Trabajo y dinero
  {q:'Si trabajo y cobro a fin de mes... ¿qué hago primero?',opts:['💶 Pago lo importante (alquiler, comida)','🎮 Me lo gasto en juegos'],ans:'💶 Pago lo importante (alquiler, comida)'},
  {q:'Si me ofrecen mucho dinero por algo raro... ¿qué hago?',opts:['🚫 Desconfío y no acepto','💸 Acepto sin preguntar'],ans:'🚫 Desconfío y no acepto'},
  {q:'Si quiero ahorrar dinero... ¿qué hago?',opts:['🏦 Lo guardo poco a poco','💸 Me lo gasto todo'],ans:'🏦 Lo guardo poco a poco'},
  {q:'Si pierdo el trabajo... ¿qué hago?',opts:['📝 Busco otro y pido ayuda','😴 Me quedo en casa parado'],ans:'📝 Busco otro y pido ayuda'},

  // Vida en pareja y amistad
  {q:'Si tengo un problema con un amigo... ¿qué hago?',opts:['💬 Hablo con él tranquilo','💢 Dejo de hablarle para siempre'],ans:'💬 Hablo con él tranquilo'},
  {q:'Si mi pareja está triste... ¿qué hago?',opts:['🤗 Le pregunto y le escucho','😤 Le ignoro'],ans:'🤗 Le pregunto y le escucho'},
  {q:'Si alguien me trata mal repetidamente... ¿qué hago?',opts:['🛑 Pongo límites y pido ayuda','🤐 Lo aguanto callado'],ans:'🛑 Pongo límites y pido ayuda'},

  // Decisiones complejas
  {q:'Si voto en unas elecciones... ¿qué llevo?',opts:['🪪 El DNI','📱 Solo el móvil'],ans:'🪪 El DNI'},
  {q:'Si firmo un contrato... ¿qué hago antes?',opts:['📖 Lo leo despacio','✍️ Firmo enseguida'],ans:'📖 Lo leo despacio'},
  {q:'Si compro algo caro... ¿qué guardo?',opts:['🧾 El ticket o la factura','🗑️ Tiro todo'],ans:'🧾 El ticket o la factura'},
  {q:'Si no estoy de acuerdo en una decisión... ¿qué hago?',opts:['🙋 Lo digo con respeto','💢 Grito o me callo'],ans:'🙋 Lo digo con respeto'},
];

// Lista plana mantenida por compatibilidad con código legacy.
// Nuevos consumidores deben usar PIENSA_BASICO/AVANZADO/MASTER directamente.
export const PIENSA_ALL = [...PIENSA_BASICO, ...PIENSA_AVANZADO, ...PIENSA_MASTER];

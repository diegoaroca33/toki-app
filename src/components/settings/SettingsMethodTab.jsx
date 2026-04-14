import React from 'react'
import { GOLD, DIM, TXT } from '../../constants.js'
import { Card } from '../ui/index.js'

export default function SettingsMethodTab() {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <Card>
        <p style={{ fontSize: 20, fontWeight: 700, color: GOLD, margin: '0 0 14px' }}>Sobre el método de Toki</p>
        <div style={{ display: 'grid', gap: 12 }}>
          <p style={{ fontSize: 14, color: TXT, lineHeight: 1.55, margin: 0 }}>
            Toki está diseñado para personas que ya tienen producción oral y lectura funcional pero cuyo habla no es inteligible para su entorno. No es un comunicador alternativo ni una app de pictogramas — es un entrenador auditivo-motor intensivo.
          </p>
          <p style={{ fontSize: 14, color: TXT, lineHeight: 1.55, margin: 0 }}>
            El método es directo: el niño escucha un modelo claro, lo repite en voz alta, recibe retroalimentación inmediata y lo practica tantas veces como sea necesario hasta consolidar la dicción. La producción del habla es, en gran parte, un acto motor. Como toda destreza motora, mejora con práctica repetida y frecuente. Las personas con síndrome de Down y otras discapacidades intelectuales necesitan significativamente más repeticiones que sus pares neurotípicos para consolidar las secuencias motoras del habla.
          </p>
          <p style={{ fontSize: 14, color: TXT, lineHeight: 1.55, margin: 0 }}>
            Rvachew y Folden (2018, Universidad McGill) demostraron que este enfoque auditivo-motor — escuchar el modelo correcto y repetirlo — es significativamente superior a los apoyos visuales para la generalización del habla en síndrome de Down. El enfoque visual no fue mejor que no hacer nada. Una vez que la persona ya puede hablar, seguir dependiendo de apoyos visuales en lugar de entrenar la producción oral directa no produce mejora. Rvachew también estableció que conviene alcanzar al menos 100 producciones orales por sesión y que la dificultad debe ajustarse sobre la marcha para mantener al usuario en la zona óptima de aprendizaje.
          </p>
          <p style={{ fontSize: 14, color: TXT, lineHeight: 1.55, margin: 0 }}>
            Toki permite esa frecuencia de práctica diaria que sería imposible en el contexto clínico habitual de una o dos sesiones semanales de logopedia. No sustituye la intervención profesional — la complementa extendiendo la práctica al hogar con un sistema intensivo y guiado.
          </p>
        </div>
      </Card>

      <Card>
        <p style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '0 0 12px' }}>Evidencia científica</p>
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            { ref: 'Rvachew & Folden (2018, McGill)', text: 'La integración auditivo-motora es superior a los apoyos visuales para la generalización del habla. Recomiendan 100+ producciones orales por sesión y ajuste dinámico de dificultad. Enmarcan el trabajo en el Artículo 19 de la Declaración Universal de los Derechos Humanos: el derecho a expresarse.' },
            { ref: 'Hodson & Paden (1983)', text: 'La exposición repetida a modelos auditivos correctos genera representaciones internas del sonido que permiten al niño comparar lo que dice con lo que debería sonar, y autocorregirse progresivamente.' },
            { ref: 'Camarata, Yoder & Woynaroski (2006, 2016, Vanderbilt)', text: 'Con 51 niños durante 6 meses, demostraron que el número acumulado de modelos correctos que recibe el niño predice directamente su mejora. La dosis importa. Trabajar inteligibilidad y gramática a la vez es más eficaz que separarlas.' },
            { ref: 'Schmidt & Lee (2011)', text: 'La práctica frecuente, distribuida y con retroalimentación produce mejoras que se consolidan y se mantienen en el tiempo.' },
            { ref: 'Kumin (2006)', text: 'Muchas personas con síndrome de Down presentan dificultades de programación motora del habla que requieren entrenamiento deliberado, intenso y sostenido — no basta con exposición pasiva.' },
            { ref: 'Chapman et al. (1998, 2002)', text: 'Estudiaron a 47 personas de 5 a 20 años y no encontraron ningún punto en el que el aprendizaje del habla se detuviera. No hay techo de edad.' },
          ].map((r, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${GOLD}33`, paddingLeft: 12 }}>
              <p style={{ fontSize: 13, color: GOLD, fontWeight: 700, margin: '0 0 2px' }}>📖 {r.ref}</p>
              <p style={{ fontSize: 13, color: DIM, lineHeight: 1.45, margin: 0 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <p style={{ fontSize: 12, color: DIM + '99', margin: '10px 0 0', textAlign: 'center' }}>
        Toki · Aprende a decirlo © 2026
      </p>
    </div>
  )
}

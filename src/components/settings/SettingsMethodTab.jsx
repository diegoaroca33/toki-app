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
            Toki se basa en un enfoque de entrenamiento auditivo-motor intensivo: el niño escucha un modelo auditivo claro, lo repite en voz alta, recibe retroalimentación inmediata, y lo practica tantas veces como sea necesario hasta consolidar la producción.
          </p>
          <p style={{ fontSize: 14, color: TXT, lineHeight: 1.55, margin: 0 }}>
            La producción del habla es, en parte, una habilidad motora. Como toda habilidad motora, mejora con práctica repetida y frecuente. Las personas con síndrome de Down y otras discapacidades intelectuales necesitan significativamente más repeticiones que sus pares neurotípicos para consolidar las secuencias motoras del habla.
          </p>
          <p style={{ fontSize: 14, color: TXT, lineHeight: 1.55, margin: 0 }}>
            Toki permite una frecuencia de práctica diaria que sería imposible en el contexto clínico habitual de una o dos sesiones semanales de logopedia. No sustituye la intervención profesional — la complementa extendiendo la práctica al hogar.
          </p>
        </div>
      </Card>

      <Card>
        <p style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '0 0 12px' }}>Evidencia científica</p>
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            '📖 Hodson & Paden (1983) — Estimulación auditiva focalizada: la exposición repetida a modelos auditivos desarrolla representaciones internas que permiten al niño autocorregirse.',
            '📖 Camarata, Yoder & Camarata (2006, Vanderbilt University) — Intervención naturalista: el tratamiento simultáneo de inteligibilidad y gramática es eficaz en síndrome de Down.',
            '📖 Rvachew & Brosseau-Lapré (2018) — Integración auditivo-motora: demostró ser superior a la planificación visual para la generalización del habla en síndrome de Down.',
            '📖 Schmidt & Lee (2011) — Principios de aprendizaje motor: más práctica = mejor rendimiento = mayor aprendizaje.',
            '📖 Kumin (2006) — Apraxia verbal en síndrome de Down: las habilidades de programación del habla deben enseñarse y practicarse de forma deliberada e intensa.',
            '📖 Down Syndrome Education International — See and Learn Speech: la práctica repetitiva acelera el desarrollo fonológico.'
          ].map((ref, i) => (
            <p key={i} style={{ fontSize: 13, color: DIM, lineHeight: 1.45, margin: 0 }}>{ref}</p>
          ))}
        </div>
      </Card>

      <p style={{ fontSize: 12, color: DIM + '99', margin: '10px 0 0', textAlign: 'center' }}>
        Toki · Aprende a decirlo — by Diego Aroca © 2026
      </p>
    </div>
  )
}

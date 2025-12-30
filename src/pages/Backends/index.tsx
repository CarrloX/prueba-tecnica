import React from 'react'
import TopBar from '../../components/TopBar/TopBar'

export default function Backends() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <TopBar />

      {/* Contenido principal - espacio blanco debajo de la barra */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: 0,
        width: '100%',
        height: 'calc(100% - 60px)',
        backgroundColor: 'white'
      }} />
    </div>
  )
}

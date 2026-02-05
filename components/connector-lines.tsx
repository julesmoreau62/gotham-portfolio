"use client"

import { useEffect, useState } from "react"

export function ConnectorLines() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <svg
      className={`absolute w-full h-full pointer-events-none z-0 hidden md:block transition-opacity duration-1000 ${visible ? "opacity-20" : "opacity-0"}`}
      style={{ maxWidth: 1000, maxHeight: 800 }}
    >
      <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="hsl(217 91% 60%)" strokeWidth="1" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="hsl(217 91% 60%)" strokeWidth="1" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2.3s" repeatCount="indefinite" />
      </line>
      <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="hsl(217 91% 60%)" strokeWidth="1" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1.8s" repeatCount="indefinite" />
      </line>
      <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="hsl(217 91% 60%)" strokeWidth="1" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2.1s" repeatCount="indefinite" />
      </line>
      <line x1="50%" y1="50%" x2="35%" y2="50%" stroke="hsl(186 100% 50%)" strokeWidth="1" strokeDasharray="3,7">
        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1.5s" repeatCount="indefinite" />
      </line>
    </svg>
  )
}

"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie" 

export function useIsAdminUser(){
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = Cookies.get("aut-token")
    console.log("Token:", token)
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        console.log("Payload completo del token:", payload)
        const role = typeof payload.nombre_rol === "string" ? payload.nombre_rol.toLowerCase() : null
        console.log("Rol detectado:", role)
        setIsAdmin(role === "admin")
      } catch (e) {
        console.error("Error al parsear el token:", e)
        setIsAdmin(false)
      }
    } else {
      console.log("No hay token")
      setIsAdmin(false)
    }
  }, [])

  return {isAdmin}
}

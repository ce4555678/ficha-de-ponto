"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"

import db, { type Cadastro, type Horario } from "@/lib/pontodb"

type HorarioInput = Omit<Horario, "id" | "created_at">

type CadastroInput = Omit<Cadastro, "id" | "created_at">

type DbContextValue = {
  db: typeof db
  addHorario: (horario: HorarioInput) => Promise<number>
  updateHorario: (id: number, changes: Partial<HorarioInput>) => Promise<void>
  deleteHorario: (id: number) => Promise<void>
  addCadastro: (cadastro: CadastroInput) => Promise<number>
  updateCadastro: (id: number, changes: Partial<CadastroInput>) => Promise<void>
}

const DbContext = createContext<DbContextValue | undefined>(undefined)

export function DbProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({
      db,
      addHorario: async (horario: HorarioInput) => {
        return await db.horarios.add({ ...horario, created_at: new Date() })
      },
      updateHorario: async (id: number, changes: Partial<HorarioInput>) => {
        await db.horarios.update(id, { ...changes })
      },
      deleteHorario: async (id: number) => {
        await db.horarios.delete(id)
      },
      addCadastro: async (cadastro: CadastroInput) => {
        return await db.cadastro.add({ ...cadastro, created_at: new Date() })
      },
      updateCadastro: async (id: number, changes: Partial<CadastroInput>) => {
        await db.cadastro.update(id, { ...changes })
      },
    }),
    [],
  )

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>
}

export function useDb() {
  const context = useContext(DbContext)

  if (!context) {
    throw new Error("useDb must be used within DbProvider")
  }

  return context
}

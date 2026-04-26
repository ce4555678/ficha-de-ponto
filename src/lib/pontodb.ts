// db.js
import { Dexie, EntityTable } from "dexie"

interface Horario {
  id: number
  dia: number
  mes: number
  ano: number
  horario: string
  type: "inicio_expediente" | "inicio_almoco" | "retorno_almoco" | "inicio_cafe" | "retorno_cafe" | "termino_expediente"
  created_at: Date
}

interface Cadastro {
  id: number
  nome: string
  admissao: Date
  matricula: number
  contratante: string
  cnpj: string
  ctps: string
  created_at: Date
}

export const db = new Dexie("horarioDB") as Dexie & {
  horarios: EntityTable<
    Horario,
    "id" // primary key "id" (for the typings only)
  >,
  cadastro: EntityTable<
    Cadastro,
    "id" // primary key "id" (for the typings only)
  >
}

db.version(2).stores({
  horarios: "++id, dia, mes, ano, [ano+mes], horario, type, created_at", // Primary key and indexed props
  cadastro: "++id, nome, admissao, matricula, contratante, cnpj, ctps, created_at", // Primary key and indexed props
})

export default db
export type { Horario, Cadastro }
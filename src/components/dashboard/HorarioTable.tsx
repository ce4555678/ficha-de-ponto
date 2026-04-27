"use client"

import { Button } from "@/components/ui/button"
import type { Horario } from "@/lib/pontodb"

interface HorarioTableProps {
  horarios: Horario[]
  onEdit: (horario: Horario) => void
  onDelete: (horario: Horario) => void
}

const typeLabels: Record<Horario["type"], string> = {
  inicio_expediente: "Início expediente",
  inicio_almoco: "Início almoço",
  retorno_almoco: "Retorno almoço",
  inicio_cafe: "Início café",
  retorno_cafe: "Retorno café",
  termino_expediente: "Término expediente",
}

function formatDateCell(horario: Horario) {
  return `${String(horario.dia).padStart(2, "0")}/${String(horario.mes).padStart(2, "0")}/${horario.ano}`
}

export function HorarioTable({ horarios, onEdit, onDelete }: HorarioTableProps) {
  if (horarios.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-background/80 p-8 text-center text-sm text-muted-foreground">
        Nenhum horário registrado ainda. Clique em &quot;Novo horário&quot; para começar.
      </div>
    )
  }

  return (
    <div className="overflow-x-scroll rounded-3xl border border-border bg-card">
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Horário</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Registrado em</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((horario) => (
            <tr key={horario.id} className="border-t border-border even:bg-muted/40">
              <td className="px-4 py-3 align-middle">{formatDateCell(horario)}</td>
              <td className="px-4 py-3 align-middle font-semibold">{horario.horario}</td>
              <td className="px-4 py-3 align-middle text-sm text-muted-foreground">{typeLabels[horario.type]}</td>
              <td className="px-4 py-3 align-middle text-sm text-muted-foreground">
                {new Date(horario.created_at).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 align-middle text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(horario)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(horario)}>
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

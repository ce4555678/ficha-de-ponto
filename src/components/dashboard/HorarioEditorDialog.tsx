"use client"

import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Horario } from "@/lib/pontodb"

const monthOptions = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
] as const

const horarioTypes = [
  { value: "inicio_expediente", label: "Início expediente" },
  { value: "inicio_almoco", label: "Início almoço" },
  { value: "retorno_almoco", label: "Retorno almoço" },
  { value: "inicio_cafe", label: "Início café" },
  { value: "retorno_cafe", label: "Retorno café" },
  { value: "termino_expediente", label: "Término expediente" },
] as const

type HorarioFormData = Omit<Horario, "id" | "created_at"> 

interface HorarioEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Horario
  onSave: (data: HorarioFormData) => Promise<void>
}

export function HorarioEditorDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: HorarioEditorDialogProps) {
  const [form, setForm] = useState<HorarioFormData>(() => ({
    dia: initialData?.dia ?? 1,
    mes: initialData?.mes ?? new Date().getMonth() + 1,
    ano: initialData?.ano ?? new Date().getFullYear(),
    horario: initialData?.horario ?? "08:00",
    type: initialData?.type ?? "inicio_expediente",
  }))
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)

    try {
      await onSave(form)
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{initialData ? "Editar horário" : "Adicionar horário"}</DialogTitle>
        <DialogDescription>
          Salve a hora e o tipo de ponto usando a base Dexie. Esta alteração será exibida imediatamente.
        </DialogDescription>
      </DialogHeader>

      <DialogContent>
        <form id="horario-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="dia">Dia</Label>
              <Input
                id="dia"
                type="number"
                min={1}
                max={31}
                value={form.dia || ""}
                onChange={(event) => {
                  const value = (event.target as any).value
                  setForm((current) => ({ ...current, dia: value === "" ? 1 : Number(value) }))
                }}
              />
            </div>
            <div>
              <Label htmlFor="mes">Mês</Label>
              <select
                id="mes"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={form.mes}
                onChange={(event) => setForm((current) => ({ ...current, mes: Number((event.target as any).value) }))}
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                min={2000}
                max={2100}
                value={form.ano || ""}
                onChange={(event) => {
                  const value = (event.target as any).value
                  setForm((current) => ({ ...current, ano: value === "" ? new Date().getFullYear() : Number(value) }))
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={form.horario}
                onChange={(event) => setForm((current) => ({ ...current, horario: (event.target as any).value }))}
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: (event.target as any).value as HorarioFormData["type"] }))}
              >
                {horarioTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
          Cancelar
        </Button>
        <Button type="submit" form="horario-form" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

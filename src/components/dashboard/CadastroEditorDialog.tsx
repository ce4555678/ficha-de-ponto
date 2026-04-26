"use client"

import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Cadastro } from "@/lib/pontodb"

type CadastroFormData = {
  nome: string
  admissao: string
  matricula: number
  contratante: string
  cnpj: string
  ctps: string
}

interface CadastroEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Cadastro
  onSave: (data: CadastroFormData) => Promise<void>
}

export function CadastroEditorDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: CadastroEditorDialogProps) {
  const [form, setForm] = useState<CadastroFormData>(() => ({
    nome: initialData?.nome ?? "",
    admissao: initialData ? new Date(initialData.admissao).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    matricula: initialData?.matricula ?? 0,
    contratante: initialData?.contratante ?? "",
    cnpj: initialData?.cnpj ?? "",
    ctps: initialData?.ctps ?? "",
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
        <DialogTitle>{initialData ? "Editar cadastro" : "Novo cadastro"}</DialogTitle>
        <DialogDescription>
          Informe os dados do colaborador para salvar no banco local.
        </DialogDescription>
      </DialogHeader>

      <DialogContent>
        <form id="cadastro-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                type="text"
                value={form.nome}
                onChange={(event) => setForm((current) => ({ ...current, nome: (event.target as any).value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                type="number"
                min={1}
                value={form.matricula || ""}
                onChange={(event) => {
                  const value = (event.target as any).value
                  setForm((current) => ({ ...current, matricula: value === "" ? 0 : Number(value) }))
                }}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="admissao">Data de admissão</Label>
              <Input
                id="admissao"
                type="date"
                value={form.admissao}
                onChange={(event) => setForm((current) => ({ ...current, admissao: (event.target as any).value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="contratante">Contratante</Label>
              <Input
                id="contratante"
                type="text"
                value={form.contratante}
                onChange={(event) => setForm((current) => ({ ...current, contratante: (event.target as any).value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                type="text"
                value={form.cnpj}
                onChange={(event) => setForm((current) => ({ ...current, cnpj: (event.target as any).value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="ctps">CTPS</Label>
              <Input
                id="ctps"
                type="text"
                value={form.ctps}
                onChange={(event) => setForm((current) => ({ ...current, ctps: (event.target as any).value }))}
                required
              />
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
          Cancelar
        </Button>
        <Button type="submit" form="cadastro-form" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar cadastro"}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

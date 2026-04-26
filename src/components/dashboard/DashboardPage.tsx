"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useLiveQuery } from "dexie-react-hooks"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CadastroEditorDialog } from "@/components/dashboard/CadastroEditorDialog"
import { HorarioEditorDialog } from "@/components/dashboard/HorarioEditorDialog"
import { HorarioTable } from "@/components/dashboard/HorarioTable"
import { DbProvider, useDb } from "@/context/db-context"
import { db, type Cadastro, type Horario } from "@/lib/pontodb"

function formatType(type: Horario["type"]) {
  return {
    inicio_expediente: "Início expediente",
    inicio_almoco: "Início almoço",
    retorno_almoco: "Retorno almoço",
    inicio_cafe: "Início café",
    retorno_cafe: "Retorno café",
    termino_expediente: "Término expediente",
  }[type]
}

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

function DashboardContent() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const { addHorario, updateHorario, deleteHorario, addCadastro, updateCadastro } = useDb()
  const horarios = useLiveQuery<Horario[]>(() => db.horarios.orderBy("created_at").reverse().toArray(), [])
  const cadastro = useLiveQuery<Cadastro | undefined>(() => db.cadastro.orderBy("created_at").reverse().first(), [])
  const [editorOpen, setEditorOpen] = useState(false)
  const [cadastroOpen, setCadastroOpen] = useState(false)
  const [editingHorario, setEditingHorario] = useState<Horario | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<Horario | undefined>(undefined)
  const [filterMonth, setFilterMonth] = useState<number>(currentMonth)
  const [filterYear, setFilterYear] = useState<number>(currentYear)
  const [printAlertOpen, setPrintAlertOpen] = useState(false)

  const availableYears = useMemo(() => {
    const dataYears = Array.from(new Set((horarios ?? []).map((item) => item.ano)))
    const rangeStart = currentYear - 10
    const rangeEnd = currentYear + 2
    const allYears = new Set<number>(dataYears)

    for (let year = rangeStart; year <= rangeEnd; year += 1) {
      allYears.add(year)
    }

    return Array.from(allYears).sort((a, b) => b - a)
  }, [horarios, currentYear])

  const filteredHorarios = useMemo(() => {
    const list = horarios ?? []
    return list.filter((item) => {
      const monthMatches = item.mes === filterMonth
      const yearMatches = item.ano === filterYear
      return monthMatches && yearMatches
    })
  }, [horarios, filterMonth, filterYear])

  const summary = useMemo(() => {
    const list = horarios ?? []
    const total = list.length
    const uniqueDays = new Set(list.map((item) => `${item.dia}-${item.mes}-${item.ano}`)).size
    const last = list[0]

    return {
      total,
      uniqueDays,
      latest: last ? `${last.horario} — ${formatType(last.type)}` : "Sem registros",
    }
  }, [horarios])

  async function handleSave(data: Omit<Horario, "id" | "created_at">) {
    if (editingHorario) {
      await updateHorario(editingHorario.id, data)
    } else {
      await addHorario(data)
    }

    setEditingHorario(undefined)
  }

  async function handleCadastroSave(data: {
    nome: string
    admissao: string
    matricula: number
    contratante: string
    cnpj: string
    ctps: string
  }) {
    const payload = {
      ...data,
      admissao: new Date(data.admissao),
    }

    if (cadastro) {
      await updateCadastro(cadastro.id, payload)
    } else {
      await addCadastro(payload)
    }
  }

  function handleEditorOpenChange(open: boolean) {
    if (!open) {
      setEditorOpen(false)
      setEditingHorario(undefined)
      return
    }

    setEditorOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }

    await deleteHorario(deleteTarget.id)
    setDeleteTarget(undefined)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Painel de ponto</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Controle de horários</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Use o banco Dexie para armazenar seus registros de jornada no navegador, editar horários e gerenciar o cadastro do colaborador.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => {
            setEditingHorario(undefined)
            setEditorOpen(true)
          }}>
            Novo horário
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setCadastroOpen(true)}>
            {cadastro ? "Editar cadastro" : "Cadastrar colaborador"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (!cadastro) {
                setPrintAlertOpen(true)
                return
              }
              router.push(`/printer?mes=${filterMonth}&ano=${filterYear}`)
            }}
          >
            Imprimir
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Total de registros</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{summary.total}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Dias únicos</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{summary.uniqueDays}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Último registro</p>
            <p className="mt-3 text-lg font-semibold text-foreground">{summary.latest}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cadastro</p>
                  {cadastro ? (
                <div className="mt-4 space-y-3 text-sm text-foreground">
                  <div>
                    <span className="font-semibold">Nome:</span> {cadastro.nome}
                  </div>
                  <div>
                    <span className="font-semibold">Matrícula:</span> {cadastro.matricula}
                  </div>
                  <div>
                    <span className="font-semibold">Admissão:</span>{" "}
                    {new Date(cadastro.admissao).toLocaleDateString("pt-BR")}
                  </div>
                  <div>
                    <span className="font-semibold">Contratante:</span> {cadastro.contratante}
                  </div>
                  <div>
                    <span className="font-semibold">CNPJ:</span> {cadastro.cnpj}
                  </div>
                  <div>
                    <span className="font-semibold">CTPS:</span> {cadastro.ctps}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Nenhum cadastro encontrado. Insira um registro no IndexedDB usando seu processo de importação ou adicione manualmente um cadastro ao banco.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Registros de horário</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Encontre, edite ou exclua o horário de expediente, pausa ou retorno.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="filterMonth">
                Filtrar mês
              </label>
              <select
                id="filterMonth"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={filterMonth}
                onChange={(event) => setFilterMonth(Number(event.target.value))}
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="filterYear">
                Filtrar ano
              </label>
              <select
                id="filterYear"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={filterYear}
                onChange={(event) => setFilterYear(Number(event.target.value))}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {horarios === undefined ? (
          <div className="rounded-3xl border border-border bg-background/80 p-8 text-center text-sm text-muted-foreground">
            Carregando registros...
          </div>
        ) : (
          <HorarioTable
            horarios={filteredHorarios}
            onEdit={(horario) => {
              setEditingHorario(horario)
              setEditorOpen(true)
            }}
            onDelete={(horario) => setDeleteTarget(horario)}
          />
        )}
      </section>

      {editorOpen && (
        <HorarioEditorDialog
          key={editingHorario?.id ?? "new"}
          open={editorOpen}
          onOpenChange={handleEditorOpenChange}
          initialData={editingHorario}
          onSave={handleSave}
        />
      )}

      <CadastroEditorDialog
        open={cadastroOpen}
        onOpenChange={setCadastroOpen}
        initialData={cadastro ?? undefined}
        onSave={handleCadastroSave}
      />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(undefined)}>
        <DialogHeader>
          <DialogTitle>Excluir registro</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover este horário? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogContent>
          <p className="text-sm text-foreground">
            {deleteTarget ? (
              <>
                <strong>{formatType(deleteTarget.type)}</strong> de {deleteTarget.horario} em {String(deleteTarget.dia).padStart(2, "0")}/{String(deleteTarget.mes).padStart(2, "0")}/{deleteTarget.ano}
              </>
            ) : (
              "Selecionar registro para exclusão."
            )}
          </p>
        </DialogContent>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteTarget(undefined)} type="button">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Excluir
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={printAlertOpen} onOpenChange={setPrintAlertOpen}>
        <DialogHeader>
          <DialogTitle>Cadastro necessário</DialogTitle>
          <DialogDescription>
            Você precisa cadastrar um colaborador antes de imprimir o relatório.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setPrintAlertOpen(false)} type="button">
            Cancelar
          </Button>
          <Button onClick={() => {
            setPrintAlertOpen(false)
            setCadastroOpen(true)
          }}>
            Cadastrar agora
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DbProvider>
      <DashboardContent />
    </DbProvider>
  )
}

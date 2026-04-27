"use client";
import { useLiveQuery } from 'dexie-react-hooks';
import db, { Cadastro } from '@/lib/pontodb';
import { parseAsInteger, useQueryState } from 'nuqs';
import localFont from 'next/font/local'
import { Button } from './ui/button';
import { PrinterIcon } from 'lucide-react';
import { Activity, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useReactToPrint } from "react-to-print";

export const myFont = localFont({
  src: [
    {
      path: '../app/my-font.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-my-font', // Useful for Tailwind CSS
})



const Print = () => {
      const [mes] = useQueryState('mes', parseAsInteger.withDefault(0))
    const [ano] = useQueryState('ano', parseAsInteger.withDefault(2026))
  const dias = getDiasNoMes(mes, ano);
  const dataDe = new Date(ano, mes - 1, 1);
  const dataAte = new Date(ano, mes - 1, dias.length);
    const horarios = useLiveQuery(() => db.horarios.where('[ano+mes]')
  .equals([ano, mes]).toArray()) || []
  const contentRef = useRef<HTMLDivElement>(null);
const reactToPrintFn = useReactToPrint({ contentRef });

    const cadastroFind : Cadastro | undefined = useLiveQuery(() => db.cadastro.toArray(), [])?.[0]


  const diasDe = dataDe.toLocaleDateString("pt-BR");
  const diasAte = dataAte.toLocaleDateString("pt-BR");
  const nomeDoMes = new Date(ano, mes - 1).toLocaleString("pt-BR", { month: "long" }).toUpperCase();

  const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

  return (
    <div>
        <Button onClick={reactToPrintFn} className="print:hidden mb-10">
          <PrinterIcon/>
          Use Ctrl+P (ou Cmd+P) para imprimir</Button>
      <div ref={contentRef} className="w-[210mm] min-h-[297mm]  px-[12mm] py-[10mm] mx-auto bg-white text-[9px] uppercase font-sans leading-tight">

      {/* Cabeçalho Principal */}
      <div className="text-center py-2 border-t border-l border-r border-black">
        <h1 className=" text-[10px]">{cadastroFind?.contratante || 'CONTRATANTE NÃO ENCONTRADO'}</h1>
        <p className="text-[10px]">{cadastroFind?.cnpj || 'CNPJ NÃO ENCONTRADO'}</p>
      </div>

      <table className="border-collapse border border-black text-[9px]">
        <tbody>

          {/* Linha: DE / MÊS / ANO */}
          <tr>
            <td colSpan={9} className="border text-center border-black px-2 py-0.5 w-[35%]">
              DE: {diasDe} ATÉ {diasAte}
            </td>
            <td colSpan={9} className="border text-center border-black px-2 py-0.5 w-[35%]">
              MÊS: {nomeDoMes}
            </td>
            <td colSpan={9} className="border border-black px-2 py-0.5 w-[30%]">
              ANO: {ano}
            </td>
          </tr>

          {/* Linha: Funcionário / Matrícula */}
          <tr>
            <td colSpan={18} className="border border-black px-2 py-0.5  w-[75%]">
              FUNCIONÁRIO: {cadastroFind?.nome || 'NOME NÃO ENCONTRADO'}
            </td>
            <td colSpan={9} className="border border-black px-2 py-0.5">
              MATRÍCULA: {cadastroFind?.matricula || 'MATRÍCULA NÃO ENCONTRADA'}
            </td>
          </tr>

          {/* Linha: Admissão / Cargo / CTPS */}
          <tr>
            <td colSpan={9} className="border border-black px-2 py-0.5">
              ADMISSÃO: {cadastroFind?.admissao ? new Date(cadastroFind.admissao).toLocaleDateString("pt-BR") : 'DATA DE ADMISSÃO NÃO ENCONTRADA'}
            </td>
            <td colSpan={9} className="border border-black px-2 py-0.5">
              CARGO: TRABALHADOR RURAL (PD)
            </td>
            <td colSpan={9} className="border border-black px-2 py-0.5">
              CTPS: {cadastroFind?.ctps || 'CTPS NÃO ENCONTRADA'}
            </td>
          </tr>

          {/* Linha: Jornada */}
          <tr>
            <td colSpan={27} className="border border-black px-2 py-0.5 text-center">
              JORNADA: 07:00-10:00-11:00-14:00-14:30-16:30
            </td>
          </tr>

          {/* Cabeçalho da Tabela - Linha 1 */}
          <tr className="font-bold text-center text-[8px]">
            <td rowSpan={2} colSpan={3} className="border border-black px-1 py-1 align-middle">
              DIA
            </td>
            <td colSpan={4} className="border border-black py-1">
              MANHÃ
            </td>
            <td colSpan={4} className="border border-black py-1">
              TARDE
            </td>
            <td colSpan={4} className="border border-black py-1">
              ENCERRAMENTO
            </td>
            <td rowSpan={2} colSpan={12} className="border border-black px-1 py-1 align-middle">
              ASSINATURA
            </td>
          </tr>

          {/* Cabeçalho da Tabela - Linha 2 (sub-colunas) */}
          <tr className="text-center text-[7px] font-normal">
            <td colSpan={2} className="border border-black px-1 py-1 capitalize text-">
              Início<br />Expediente
            </td>
            <td colSpan={2} className="border border-black px-1 py-1 capitalize text-">
              Início<br />Almoço
            </td>
            <td colSpan={2} className="border border-black px-1 py-1 capitalize text-">
              Retorno<br />Almoço
            </td>
            <td colSpan={2} className="border border-black px-1 py-1 capitalize text-">
              Início<br />Café
            </td>
            <td colSpan={2} className="border border-black px-1 py-1 capitalize text-">
              Retorno<br />Café
            </td>
            <td colSpan={2} className="border border-black px-1 py-1 capitalize text-">
              Término<br />Expediente
            </td>
          </tr>

          {/* Linhas dos Dias */}
          {dias.map((diaNum) => {
            const date = new Date(ano, mes - 1, diaNum);
            const diaSemanaStr = diasSemana[date.getDay()];
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const rowClass = isWeekend ? "bg-gray-400" : "bg-white";

            return (
              <tr key={diaNum} className={`h-6 `}>
                {/* DIA */}
                <td colSpan={2} className={`border border-black px-1 text-center text-[8px] ${rowClass}`}>
                  {diaSemanaStr}
                </td>
                <td className={`border border-black px-1 text-center text-[8px]`}>
                  {diaNum}
                </td>
                {/* 6 colunas de horário */}
                <td colSpan={2} className={`border border-black relative`}>
                  <Activity mode={horarios.find(h => h.dia === diaNum && h.type === "inicio_expediente") ? "visible" : "hidden"}>
                    <p className={cn(myFont.className, "absolute -top-2 left-0 right-0 antialiased font-medium text-3xl text-center text-blue-900")}>
                      {horarios.find(h => h.dia === diaNum && h.type === "inicio_expediente")?.horario || ""}
                    </p>
                  </Activity>
                </td>

                                <td colSpan={2} className={`border border-black relative`}>
                  <Activity mode={horarios.find(h => h.dia === diaNum && h.type === "inicio_almoco") ? "visible" : "hidden"}>
                    <p className={cn(myFont.className, "absolute -top-2 left-0 right-0 antialiased font-medium text-3xl text-center text-blue-900")}>
                      {horarios.find(h => h.dia === diaNum && h.type === "inicio_almoco")?.horario || ""}
                    </p>
                  </Activity>
                </td>

                                <td colSpan={2} className={`border border-black relative`}>
                  <Activity mode={horarios.find(h => h.dia === diaNum && h.type === "retorno_almoco") ? "visible" : "hidden"}>
                    <p className={cn(myFont.className, "absolute -top-2 left-0 right-0 antialiased font-medium text-3xl text-center text-blue-900")}>
                      {horarios.find(h => h.dia === diaNum && h.type === "retorno_almoco")?.horario || ""}
                    </p>
                  </Activity>
                </td>

                                <td colSpan={2} className={`border border-black relative`}>
                  <Activity mode={horarios.find(h => h.dia === diaNum && h.type === "inicio_cafe") ? "visible" : "hidden"}>
                    <p className={cn(myFont.className, "absolute -top-2 left-0 right-0 antialiased font-medium text-3xl text-center text-blue-900")}>
                      {horarios.find(h => h.dia === diaNum && h.type === "inicio_cafe")?.horario || ""}
                    </p>
                  </Activity>
                </td>

                                <td colSpan={2} className={`border border-black relative`}>
                  <Activity mode={horarios.find(h => h.dia === diaNum && h.type === "retorno_cafe") ? "visible" : "hidden"}>
                    <p className={cn(myFont.className, "absolute -top-2 left-0 right-0 antialiased font-medium text-3xl text-center text-blue-900")}>
                      {horarios.find(h => h.dia === diaNum && h.type === "retorno_cafe")?.horario || ""}
                    </p>
                  </Activity>
                </td>

                                <td colSpan={2} className={`border border-black relative`}>
                  <Activity mode={horarios.find(h => h.dia === diaNum && h.type === "termino_expediente") ? "visible" : "hidden"}>
                    <p className={cn(myFont.className, "absolute -top-2 left-0 right-0 antialiased font-medium text-3xl text-center text-blue-900")}>
                      {horarios.find(h => h.dia === diaNum && h.type === "termino_expediente")?.horario || ""}
                    </p>
                  </Activity>
                </td>

                {/* Assinatura */}
                <td colSpan={12} className={`border border-black`}></td>
              </tr>
            );
          })}

        </tbody>
      </table>

   {/* Rodapé - Assinaturas */}
<div className="mt-6 text-[10px] float-end">
        {/* Bloco centralizado com largura definida */}
        <div className="mx-auto w-fit flex flex-col gap-4">
 
          {/* Linha 1: Concordo + Ass na mesma linha */}
          <div className="flex items-end gap-10">
            <div className="flex items-end gap-1">
              <span className="whitespace-nowrap capitalize">Concordo com o Saldo Banco de Horas de:</span>
              <div className="w-14 border-b border-black mb-px"></div>
              :
              <div className="w-14 border-b border-black mb-px"></div>
            </div>
            <div className="flex items-end gap-1 capitalize">
              <span className="whitespace-nowrap">Ass:</span>
              <div className="w-40 border-b border-black mb-px"></div>
            </div>
          </div>
 
          {/* Linha 2: Assinatura do Empregado */}
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap capitalize">Assinatura do Empregado:</span>
            <div className="w-64 border-b border-black mb-px"></div>
          </div>
 
          {/* Linha 3: Encarregado */}
          <div className="flex items-end gap-1">
            <span className="whitespace-nowrap capitalize">Encarregado:</span>
            <div className="w-48 border-b border-black mb-px"></div>
          </div>
 
        </div>
      
      </div>
 
      {/* CSS para Impressão */}
<style jsx global>{`
  @media print {
    body { margin: 0; padding: 0; }
    .no-print { display: none; }
    @page { size: A4; margin: 0; }

    /* Força impressão de cores de fundo */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`}</style>
    </div> 
    </div>
   
  );
};

function getDiasNoMes(mes: number, ano: number): number[] {
  const data = new Date(ano, mes, 0);
  const quantidadeDias = data.getDate();
  return Array.from({ length: quantidadeDias }, (_, i) => i + 1);
}

export default Print;
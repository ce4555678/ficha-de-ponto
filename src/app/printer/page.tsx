import { FullPageLoading } from "@/components/full-page-loading";
import Print from "@/components/print";
import { Button } from "@base-ui/react";
import { Suspense } from 'react'

export const metadata = {
    title: "Imprimir Relatório - Ficha de Ponto",
    description: "Visualize e imprima sua ficha de ponto mensal com todos os registros de horário organizados por data.",
    keywords: ["imprimir", "relatório", "ficha de ponto", "PDF", "registro de horário"],
    openGraph: {
        title: "Imprimir Relatório - Ficha de Ponto",
        description: "Visualize e imprima sua ficha de ponto mensal.",
        type: "website",
    },
}

function PrinterContent() {
    return (
        <div>
            <Print/>
        </div>
    )
}

export default function Printer () {
    return (
        <Suspense fallback={<FullPageLoading title="Carregando ficha de ponto..." description="Aguarde enquanto preparamos sua ficha de ponto para impressão." itemLabel="Gerando documento..." />}>
            <PrinterContent />
        </Suspense>
    )
}

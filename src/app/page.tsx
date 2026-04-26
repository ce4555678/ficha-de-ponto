import DashboardPage from "@/components/dashboard/DashboardPage"

export const metadata = {
  title: "Dashboard - Ficha de Ponto",
  description: "Gerencie seus horários e cadastros de ponto de forma fácil e eficiente. Registre entradas, saídas, intervalos e gere relatórios mensais.",
  keywords: ["dashboard", "horários", "cadastro", "ponto", "trabalho", "registro", "gestão"],
  openGraph: {
    title: "Dashboard - Ficha de Ponto",
    description: "Gerencie seus horários e cadastros de ponto de forma fácil e eficiente.",
    type: "website",
  },
}

export default function Page() {
  return <DashboardPage />
}

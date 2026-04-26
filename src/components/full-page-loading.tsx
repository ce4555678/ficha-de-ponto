import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"

interface FullPageLoadingProps {
  title?: string
  description?: string
  itemLabel?: string
}

export function FullPageLoading({
  title = "Carregando",
  description = "Aguarde um momento...",
  itemLabel = "Processando pagamento...",
}: FullPageLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-10" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="w-full max-w-xs [--radius:1rem]">
        <Item variant="muted">
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">{itemLabel}</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    </div>
  )
}
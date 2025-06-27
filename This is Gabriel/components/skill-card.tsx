import { Card, CardContent } from "@/components/ui/card"

interface SkillCardProps {
  name: string
  level: "Básico" | "Intermediário" | "Avançado"
}

export function SkillCard({ name, level }: SkillCardProps) {
  const getLevelColor = () => {
    switch (level) {
      case "Avançado":
        return "bg-blue-500"
      case "Intermediário":
        return "bg-blue-400"
      case "Básico":
        return "bg-blue-300"
      default:
        return "bg-blue-200"
    }
  }

  const getLevelWidth = () => {
    switch (level) {
      case "Avançado":
        return "w-full"
      case "Intermediário":
        return "w-2/3"
      case "Básico":
        return "w-1/3"
      default:
        return "w-0"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="font-medium mb-2">{name}</div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${getLevelColor()} ${getLevelWidth()}`} />
        </div>
        <div className="text-xs text-muted-foreground mt-2">{level}</div>
      </CardContent>
    </Card>
  )
}

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  services: string[]
  icon?: React.ReactNode
}

export function ServiceCard({ title, description, services, icon }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-2">
          {icon && <div className="text-primary">{icon}</div>}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 mb-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{service}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="p-6 pt-0">
        <Button size="sm" asChild className="w-full">
          <a href="https://wa.me/558599508814" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      </div>
    </Card>
  )
}

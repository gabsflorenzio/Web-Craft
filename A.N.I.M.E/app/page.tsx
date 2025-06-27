"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  Plus,
  Trash2,
  Star,
  Play,
  Heart,
  Upload,
  Edit,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SortAsc,
  SortDesc,
  Download,
  Save,
  RefreshCw,
  AlertTriangle,
  Filter,
  X,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Anime {
  id: string
  name: string
  rating: number
  category: "watched" | "watching" | "wishlist"
  genres: string[]
}

interface SortOption {
  value: string
  label: string
  icon: React.ReactNode
}

type SortType = "name-asc" | "name-desc" | "rating-asc" | "rating-desc"

const AVAILABLE_GENRES = [
  "Shounen",
  "Seinen",
  "Shoujo",
  "Josei",
  "Ecchi",
  "Terror",
  "Ação",
  "Aventura",
  "Comédia",
  "Drama",
  "Fantasia",
  "Romance",
  "Sobrenatural",
  "Mistério",
  "Sci-Fi",
  "Slice of Life",
  "Esporte",
  "Mecha",
  "Histórico",
  "Musical",
  "Psicológico",
  "Thriller",
  "Militar",
  "Escola",
  "Harem",
  "Yaoi",
  "Yuri",
  "Demônios",
  "Magia",
  "Samurai",
  "Ninja",
  "Vampiro",
  "Zumbi",
]

const GENRE_COLORS: Record<string, string> = {
  Shounen: "bg-blue-500",
  Seinen: "bg-purple-500",
  Shoujo: "bg-pink-500",
  Josei: "bg-rose-500",
  Ecchi: "bg-red-500",
  Terror: "bg-gray-800",
  Ação: "bg-orange-500",
  Aventura: "bg-green-500",
  Comédia: "bg-yellow-500",
  Drama: "bg-indigo-500",
  Fantasia: "bg-violet-500",
  Romance: "bg-pink-400",
  Sobrenatural: "bg-purple-600",
  Mistério: "bg-gray-600",
  "Sci-Fi": "bg-cyan-500",
  "Slice of Life": "bg-emerald-400",
  Esporte: "bg-lime-500",
  Mecha: "bg-slate-500",
  Histórico: "bg-amber-600",
  Musical: "bg-fuchsia-500",
  Psicológico: "bg-red-600",
  Thriller: "bg-gray-700",
  Militar: "bg-green-700",
  Escola: "bg-blue-400",
  Harem: "bg-pink-600",
  Yaoi: "bg-purple-400",
  Yuri: "bg-pink-300",
  Demônios: "bg-red-700",
  Magia: "bg-violet-600",
  Samurai: "bg-red-800",
  Ninja: "bg-gray-800",
  Vampiro: "bg-red-900",
  Zumbi: "bg-green-800",
}

const ANIME_SUGGESTIONS_WITH_GENRES = [
  { name: "One Piece", genres: ["Shounen", "Ação", "Aventura", "Comédia"] },
  { name: "One Punch Man", genres: ["Seinen", "Ação", "Comédia", "Sobrenatural"] },
  { name: "Attack on Titan", genres: ["Shounen", "Ação", "Drama", "Terror"] },
  { name: "Naruto", genres: ["Shounen", "Ação", "Aventura", "Ninja"] },
  { name: "Dragon Ball Z", genres: ["Shounen", "Ação", "Aventura", "Sobrenatural"] },
  { name: "Death Note", genres: ["Seinen", "Sobrenatural", "Thriller", "Psicológico"] },
  { name: "My Hero Academia", genres: ["Shounen", "Ação", "Escola", "Sobrenatural"] },
  { name: "Demon Slayer", genres: ["Shounen", "Ação", "Sobrenatural", "Histórico"] },
  { name: "Jujutsu Kaisen", genres: ["Shounen", "Ação", "Sobrenatural", "Escola"] },
  { name: "Tokyo Ghoul", genres: ["Seinen", "Ação", "Sobrenatural", "Terror"] },
  { name: "Fullmetal Alchemist", genres: ["Shounen", "Ação", "Aventura", "Drama"] },
  { name: "Hunter x Hunter", genres: ["Shounen", "Ação", "Aventura", "Fantasia"] },
  { name: "Bleach", genres: ["Shounen", "Ação", "Sobrenatural"] },
  { name: "Mob Psycho 100", genres: ["Seinen", "Ação", "Comédia", "Sobrenatural"] },
  { name: "Cowboy Bebop", genres: ["Seinen", "Ação", "Aventura", "Sci-Fi"] },
  { name: "Spirited Away", genres: ["Fantasia", "Aventura", "Slice of Life"] },
  { name: "Your Name", genres: ["Romance", "Drama", "Sobrenatural"] },
  { name: "Princess Mononoke", genres: ["Fantasia", "Aventura", "Drama"] },
  { name: "Akira", genres: ["Seinen", "Ação", "Sci-Fi", "Thriller"] },
  { name: "Ghost in the Shell", genres: ["Seinen", "Ação", "Sci-Fi", "Psicológico"] },
]

const SORT_OPTIONS: SortOption[] = [
  { value: "name-asc", label: "Nome (A–Z)", icon: <SortAsc className="w-4 h-4" /> },
  { value: "name-desc", label: "Nome (Z–A)", icon: <SortDesc className="w-4 h-4" /> },
  { value: "rating-asc", label: "Nota (crescente)", icon: <ArrowUp className="w-4 h-4" /> },
  { value: "rating-desc", label: "Nota (decrescente)", icon: <ArrowDown className="w-4 h-4" /> },
]

export default function AnimeManager() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAnime, setNewAnime] = useState({
    name: "",
    rating: [7],
    category: "wishlist" as const,
    genres: [] as string[],
  })
  const [draggedAnime, setDraggedAnime] = useState<Anime | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [sortOptions, setSortOptions] = useState<Record<Anime["category"], SortType>>({
    watched: "name-asc",
    watching: "name-asc",
    wishlist: "name-asc",
  })
  const [highlightedAnimes, setHighlightedAnimes] = useState<Set<string>>(new Set())
  const [lastSavedTime, setLastSavedTime] = useState<string>("")
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [selectedGenreFilters, setSelectedGenreFilters] = useState<string[]>([])

  // Enhanced save to localStorage with timestamp
  const saveToLocalStorage = () => {
    const dataToSave = {
      animes,
      sortOptions,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("animeLibraryData", JSON.stringify(dataToSave))
    setLastSavedTime(new Date().toLocaleTimeString())
  }

  // Auto-save whenever data changes
  useEffect(() => {
    if (animes.length > 0 || Object.keys(sortOptions).length > 0) {
      saveToLocalStorage()
    }
  }, [animes, sortOptions])

  // Enhanced load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("animeLibraryData")

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)

        if (parsedData.animes) {
          // Migrate old data format to include genres
          const animesWithGenres = parsedData.animes.map((anime: any) => ({
            ...anime,
            genres: anime.genres || [],
          }))
          setAnimes(animesWithGenres)
        }

        if (parsedData.sortOptions) {
          setSortOptions(parsedData.sortOptions)
        }

        if (parsedData.timestamp) {
          setLastSavedTime(new Date(parsedData.timestamp).toLocaleTimeString())
        }
      } catch (error) {
        console.error("Error loading saved data:", error)
        showNotification("error", "Erro ao carregar dados salvos")
      }
    }
  }, [])

  // Filter animes based on search and genre filters
  const filteredAnimes = useMemo(() => {
    let filtered = animes

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((anime) => {
        const nameMatch = anime.name.toLowerCase().includes(searchTerm.toLowerCase())
        const genreMatch = anime.genres.some((genre) => genre.toLowerCase().includes(searchTerm.toLowerCase()))
        return nameMatch || genreMatch
      })
    }

    // Filter by selected genres
    if (selectedGenreFilters.length > 0) {
      filtered = filtered.filter((anime) =>
        selectedGenreFilters.every((selectedGenre) => anime.genres.includes(selectedGenre)),
      )
    }

    return filtered
  }, [animes, searchTerm, selectedGenreFilters])

  // Get suggestions for autocomplete
  const suggestions = useMemo(() => {
    if (!searchTerm) return []
    return ANIME_SUGGESTIONS_WITH_GENRES.filter(
      (anime) =>
        (anime.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          anime.genres.some((genre) => genre.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        !animes.some((existingAnime) => existingAnime.name === anime.name),
    ).slice(0, 5)
  }, [searchTerm, animes])

  // Get suggestions for new anime input
  const newAnimeSuggestions = useMemo(() => {
    if (!newAnime.name) return []
    return ANIME_SUGGESTIONS_WITH_GENRES.filter(
      (anime) =>
        anime.name.toLowerCase().includes(newAnime.name.toLowerCase()) &&
        !animes.some((existingAnime) => existingAnime.name === anime.name),
    ).slice(0, 5)
  }, [newAnime.name, animes])

  const addAnime = () => {
    if (!newAnime.name.trim()) return

    const anime: Anime = {
      id: Date.now().toString(),
      name: newAnime.name.trim(),
      rating: newAnime.rating[0],
      category: newAnime.category,
      genres: newAnime.genres,
    }

    setAnimes((prev) => [...prev, anime])
    setNewAnime({ name: "", rating: [7], category: "wishlist", genres: [] })
    setIsModalOpen(false)
  }

  const deleteAnime = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este anime?")) {
      setAnimes((prev) => prev.filter((anime) => anime.id !== id))
    }
  }

  const moveAnime = (animeId: string, newCategory: Anime["category"]) => {
    setAnimes((prev) => prev.map((anime) => (anime.id === animeId ? { ...anime, category: newCategory } : anime)))
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const manualSave = () => {
    saveToLocalStorage()
    showNotification("success", "Estado salvo com sucesso!")
  }

  const exportToCSV = () => {
    setExportLoading(true)

    try {
      const csvHeaders = "nome,nota,categoria,generos\n"
      const csvData = animes
        .map((anime) => {
          const categoryName =
            anime.category === "watched"
              ? "Assistido"
              : anime.category === "watching"
                ? "Assistindo"
                : "Lista de Desejos"
          const genresString = anime.genres.join(", ")
          return `"${anime.name}",${anime.rating},"${categoryName}","${genresString}"`
        })
        .join("\n")

      const csvContent = csvHeaders + csvData
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `minha-biblioteca-animes-${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      showNotification("success", "Arquivo CSV exportado com sucesso!")
    } catch (error) {
      showNotification("error", "Erro ao exportar arquivo CSV")
    } finally {
      setExportLoading(false)
    }
  }

  const resetAllData = () => {
    localStorage.removeItem("animeLibraryData")
    localStorage.removeItem("animes")
    localStorage.removeItem("sortOptions")
    setAnimes([])
    setSortOptions({
      watched: "name-asc",
      watching: "name-asc",
      wishlist: "name-asc",
    })
    setSelectedGenreFilters([])
    setLastSavedTime("")
    setIsResetModalOpen(false)
    showNotification("success", "Todos os dados foram resetados!")
  }

  const importCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split("\n").filter((line) => line.trim())

        if (lines.length < 2) {
          showNotification("error", "CSV deve conter pelo menos um cabeçalho e uma linha de dados")
          return
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
        const requiredHeaders = ["nome", "nota", "categoria"]

        const hasRequiredHeaders = requiredHeaders.every((header) => headers.includes(header))

        if (!hasRequiredHeaders) {
          showNotification("error", "CSV deve conter as colunas: nome, nota, categoria")
          return
        }

        const nameIndex = headers.indexOf("nome")
        const ratingIndex = headers.indexOf("nota")
        const categoryIndex = headers.indexOf("categoria")
        const genresIndex = headers.indexOf("generos")

        const newAnimes: Anime[] = []
        let errorCount = 0
        let duplicateCount = 0

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim())

          if (values.length < 3) continue

          const name = values[nameIndex]?.replace(/"/g, "")
          const rating = Number.parseFloat(values[ratingIndex])
          const categoryValue = values[categoryIndex]?.toLowerCase().replace(/"/g, "")

          if (!name || isNaN(rating) || rating < 1 || rating > 10) {
            errorCount++
            continue
          }

          let category: Anime["category"]
          if (categoryValue.includes("assistido") && !categoryValue.includes("assistindo")) {
            category = "watched"
          } else if (categoryValue.includes("assistindo")) {
            category = "watching"
          } else if (categoryValue.includes("desejo") || categoryValue.includes("wishlist")) {
            category = "wishlist"
          } else {
            errorCount++
            continue
          }

          // Parse genres if column exists
          let genres: string[] = []
          if (genresIndex !== -1 && values[genresIndex]) {
            const genresString = values[genresIndex].replace(/"/g, "")
            genres = genresString
              .split(",")
              .map((g) => g.trim())
              .filter((g) => AVAILABLE_GENRES.includes(g))
          }

          // Check if anime already exists
          const existingAnime = animes.find((anime) => anime.name.toLowerCase() === name.toLowerCase())

          if (existingAnime) {
            duplicateCount++
          } else {
            newAnimes.push({
              id: `${Date.now()}-${i}`,
              name,
              rating,
              category,
              genres,
            })
          }
        }

        if (newAnimes.length > 0) {
          setAnimes((prev) => [...prev, ...newAnimes])

          let message = `${newAnimes.length} animes importados com sucesso!`
          if (duplicateCount > 0) message += ` (${duplicateCount} duplicatas ignoradas)`
          if (errorCount > 0) message += ` (${errorCount} linhas com erro ignoradas)`

          showNotification("success", message)
        } else {
          showNotification("error", "Nenhum anime válido encontrado no CSV")
        }
      } catch (error) {
        showNotification("error", "Erro ao processar o arquivo CSV")
      }
    }

    reader.readAsText(file)
    event.target.value = ""
  }

  const openEditModal = (anime: Anime) => {
    setEditingAnime({ ...anime })
    setIsEditModalOpen(true)
  }

  const saveEditedAnime = () => {
    if (!editingAnime) return

    setAnimes((prev) => prev.map((anime) => (anime.id === editingAnime.id ? editingAnime : anime)))

    setIsEditModalOpen(false)
    setEditingAnime(null)
    showNotification("success", "Anime atualizado com sucesso!")
  }

  const handleDragStart = (anime: Anime) => {
    setDraggedAnime(anime)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, category: Anime["category"]) => {
    e.preventDefault()
    if (draggedAnime && draggedAnime.category !== category) {
      moveAnime(draggedAnime.id, category)
    }
    setDraggedAnime(null)
  }

  const getCategoryAnimes = (category: Anime["category"]) => {
    return filteredAnimes.filter((anime) => anime.category === category)
  }

  const sortAnimes = (animes: Anime[], sortType: SortType): Anime[] => {
    return [...animes].sort((a, b) => {
      switch (sortType) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "rating-asc":
          return a.rating - b.rating
        case "rating-desc":
          return b.rating - a.rating
        default:
          return 0
      }
    })
  }

  const getSortedCategoryAnimes = (category: Anime["category"]) => {
    const categoryAnimes = filteredAnimes.filter((anime) => anime.category === category)
    return sortAnimes(categoryAnimes, sortOptions[category])
  }

  const handleSortChange = (category: Anime["category"], sortType: SortType) => {
    setSortOptions((prev) => ({ ...prev, [category]: sortType }))

    // Highlight reorganized animes
    const categoryAnimes = filteredAnimes.filter((anime) => anime.category === category)
    const animeIds = new Set(categoryAnimes.map((anime) => anime.id))
    setHighlightedAnimes(animeIds)

    // Remove highlight after animation
    setTimeout(() => {
      setHighlightedAnimes(new Set())
    }, 1000)
  }

  const toggleGenreFilter = (genre: string) => {
    setSelectedGenreFilters((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const clearGenreFilters = () => {
    setSelectedGenreFilters([])
  }

  const selectSuggestionWithGenres = (suggestion: { name: string; genres: string[] }) => {
    setNewAnime((prev) => ({
      ...prev,
      name: suggestion.name,
      genres: suggestion.genres,
    }))
  }

  const getCategoryIcon = (category: Anime["category"]) => {
    switch (category) {
      case "watched":
        return <Play className="w-4 h-4" />
      case "watching":
        return <Star className="w-4 h-4" />
      case "wishlist":
        return <Heart className="w-4 h-4" />
    }
  }

  const getCategoryTitle = (category: Anime["category"]) => {
    switch (category) {
      case "watched":
        return "🎬 Assistidos"
      case "watching":
        return "📺 Assistindo"
      case "wishlist":
        return "🌟 Lista de Desejos"
    }
  }

  const getGenreColor = (genre: string) => {
    return GENRE_COLORS[genre] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">🎌 Minha Biblioteca de Animes</h1>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar animes ou gêneros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-md mt-1 z-10">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 hover:bg-gray-600 first:rounded-t-md last:rounded-b-md"
                        onClick={() => setSearchTerm(suggestion.name)}
                      >
                        <div className="flex flex-col gap-1">
                          <span>{suggestion.name}</span>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.genres.slice(0, 3).map((genre) => (
                              <Badge key={genre} className={`${getGenreColor(genre)} text-white text-xs px-1 py-0`}>
                                {genre}
                              </Badge>
                            ))}
                            {suggestion.genres.length > 3 && (
                              <Badge className="bg-gray-500 text-white text-xs px-1 py-0">
                                +{suggestion.genres.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent ${
                      selectedGenreFilters.length > 0 ? "border-blue-500 text-blue-400" : ""
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    {selectedGenreFilters.length > 0 && (
                      <Badge className="ml-1 bg-blue-500 text-white">{selectedGenreFilters.length}</Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-gray-800 border-gray-600">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">Filtrar por Gênero</h4>
                      {selectedGenreFilters.length > 0 && (
                        <Button onClick={clearGenreFilters} variant="ghost" size="sm" className="text-gray-400">
                          Limpar
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {AVAILABLE_GENRES.map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox
                            id={genre}
                            checked={selectedGenreFilters.includes(genre)}
                            onCheckedChange={() => toggleGenreFilter(genre)}
                          />
                          <label htmlFor={genre} className="text-sm text-white cursor-pointer flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getGenreColor(genre)}`} />
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                onClick={manualSave}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                title="Salvar Estado Atual"
              >
                <Save className="w-4 h-4" />
              </Button>

              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                disabled={exportLoading || animes.length === 0}
                title="Exportar CSV"
              >
                <Download className="w-4 h-4" />
              </Button>

              <input type="file" accept=".csv" onChange={importCSV} className="hidden" id="csv-import" />
              <label
                htmlFor="csv-import"
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                title="Importar CSV"
              >
                <Upload className="w-4 h-4" />
              </label>

              <Button
                onClick={() => setIsResetModalOpen(true)}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                title="Resetar Tudo"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span>Total de animes: {animes.length}</span>
              {selectedGenreFilters.length > 0 && (
                <div className="flex items-center gap-2">
                  <span>Filtros ativos:</span>
                  <div className="flex gap-1">
                    {selectedGenreFilters.map((genre) => (
                      <Badge
                        key={genre}
                        className={`${getGenreColor(genre)} text-white text-xs cursor-pointer`}
                        onClick={() => toggleGenreFilter(genre)}
                      >
                        {genre}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {lastSavedTime && <span>Último salvamento: {lastSavedTime}</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(["watched", "watching", "wishlist"] as const).map((category) => {
            const categoryAnimes = getSortedCategoryAnimes(category)
            return (
              <div
                key={category}
                className="bg-gray-800 rounded-lg p-4 min-h-[400px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {getCategoryTitle(category)}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Select
                      value={sortOptions[category]}
                      onValueChange={(value: SortType) => handleSortChange(category, value)}
                    >
                      <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white text-xs">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="w-3 h-3" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-white">
                            <div className="flex items-center gap-2">
                              {option.icon}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="secondary" className="bg-gray-700">
                      {categoryAnimes.length}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {categoryAnimes.map((anime) => (
                      <motion.div
                        key={anime.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`bg-gray-700 border-gray-600 cursor-move hover:bg-gray-650 transition-all duration-300 ${
                            highlightedAnimes.has(anime.id) ? "ring-2 ring-blue-400 shadow-lg shadow-blue-400/20" : ""
                          }`}
                          draggable
                          onDragStart={() => handleDragStart(anime)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="font-medium text-white mb-1">{anime.name}</h3>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-300">{anime.rating}/10</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  onClick={() => openEditModal(anime)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => deleteAnime(anime.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {anime.genres.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {anime.genres.slice(0, 4).map((genre) => (
                                  <Badge key={genre} className={`${getGenreColor(genre)} text-white text-xs px-2 py-0`}>
                                    {genre}
                                  </Badge>
                                ))}
                                {anime.genres.length > 4 && (
                                  <Badge className="bg-gray-500 text-white text-xs px-2 py-0">
                                    +{anime.genres.length - 4}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Button */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Anime</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">Nome do Anime</label>
              <Input
                placeholder="Digite o nome do anime..."
                value={newAnime.name}
                onChange={(e) => setNewAnime((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              {newAnimeSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-md mt-1 z-10">
                  {newAnimeSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-gray-600 first:rounded-t-md last:rounded-b-md"
                      onClick={() => selectSuggestionWithGenres(suggestion)}
                    >
                      <div className="flex flex-col gap-1">
                        <span>{suggestion.name}</span>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} className={`${getGenreColor(genre)} text-white text-xs px-1 py-0`}>
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nota: {newAnime.rating[0]}/10</label>
              <Slider
                value={newAnime.rating}
                onValueChange={(value) => setNewAnime((prev) => ({ ...prev, rating: value }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <Select
                value={newAnime.category}
                onValueChange={(value: Anime["category"]) => setNewAnime((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="wishlist">🌟 Lista de Desejos</SelectItem>
                  <SelectItem value="watching">📺 Assistindo</SelectItem>
                  <SelectItem value="watched">🎬 Assistidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Gêneros
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto bg-gray-700 p-3 rounded-md border border-gray-600">
                {AVAILABLE_GENRES.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={`new-${genre}`}
                      checked={newAnime.genres.includes(genre)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewAnime((prev) => ({ ...prev, genres: [...prev.genres, genre] }))
                        } else {
                          setNewAnime((prev) => ({ ...prev, genres: prev.genres.filter((g) => g !== genre) }))
                        }
                      }}
                    />
                    <label htmlFor={`new-${genre}`} className="text-xs text-white cursor-pointer">
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
              {newAnime.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newAnime.genres.map((genre) => (
                    <Badge key={genre} className={`${getGenreColor(genre)} text-white text-xs`}>
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={addAnime}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!newAnime.name.trim()}
            >
              Salvar Anime
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Anime</DialogTitle>
          </DialogHeader>

          {editingAnime && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Anime</label>
                <Input
                  placeholder="Digite o nome do anime..."
                  value={editingAnime.name}
                  onChange={(e) => setEditingAnime((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nota: {editingAnime.rating}/10</label>
                <Slider
                  value={[editingAnime.rating]}
                  onValueChange={(value) => setEditingAnime((prev) => (prev ? { ...prev, rating: value[0] } : null))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <Select
                  value={editingAnime.category}
                  onValueChange={(value: Anime["category"]) =>
                    setEditingAnime((prev) => (prev ? { ...prev, category: value } : null))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="wishlist">🌟 Lista de Desejos</SelectItem>
                    <SelectItem value="watching">📺 Assistindo</SelectItem>
                    <SelectItem value="watched">🎬 Assistidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Gêneros
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto bg-gray-700 p-3 rounded-md border border-gray-600">
                  {AVAILABLE_GENRES.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${genre}`}
                        checked={editingAnime.genres.includes(genre)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditingAnime((prev) => (prev ? { ...prev, genres: [...prev.genres, genre] } : null))
                          } else {
                            setEditingAnime((prev) =>
                              prev ? { ...prev, genres: prev.genres.filter((g) => g !== genre) } : null,
                            )
                          }
                        }}
                      />
                      <label htmlFor={`edit-${genre}`} className="text-xs text-white cursor-pointer">
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
                {editingAnime.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {editingAnime.genres.map((genre) => (
                      <Badge key={genre} className={`${getGenreColor(genre)} text-white text-xs`}>
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={saveEditedAnime}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!editingAnime.name.trim()}
              >
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Modal */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Resetar Todos os Dados
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="border-red-600 bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                <strong>Atenção!</strong> Esta ação não pode ser desfeita.
              </AlertDescription>
            </Alert>

            <p className="text-gray-300">Tem certeza que deseja apagar todas as informações da sua biblioteca?</p>

            <p className="text-sm text-gray-400">
              Isso incluirá todos os animes, gêneros, configurações de ordenação e preferências salvas.
            </p>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsResetModalOpen(false)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button onClick={resetAllData} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                Sim, Resetar Tudo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

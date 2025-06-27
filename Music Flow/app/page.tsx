"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  Plus,
  Search,
  Grid3X3,
  List,
  SortAsc,
  Folder,
  Music,
  Trash2,
  MoreHorizontal,
  Download,
} from "lucide-react"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  file: File
  cover?: string
}

interface Playlist {
  id: string
  name: string
  songs: string[]
  createdAt: Date
}

type ViewMode = "grid" | "list"
type SortBy = "title" | "artist" | "duration"

export default function SpotifyClone() {
  // Estados principais
  const [songs, setSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none")

  // Estados da UI
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortBy>("title")
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [draggedSong, setDraggedSong] = useState<string | null>(null)

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar playlists do localStorage
  useEffect(() => {
    const savedPlaylists = localStorage.getItem("music-flow-playlists")
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists))
    }
  }, [])

  // Salvar playlists no localStorage
  useEffect(() => {
    localStorage.setItem("music-flow-playlists", JSON.stringify(playlists))
  }, [playlists])

  // Configurar áudio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0
        audio.play()
      } else {
        playNext()
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSong, repeatMode])

  // Função para selecionar pasta
  const handleFolderSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsLoading(true)
    const audioFiles = Array.from(files).filter(
      (file) => file.type.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|flac)$/i.test(file.name),
    )

    const songPromises = audioFiles.map(async (file, index) => {
      // Simular extração de metadados (em produção usaria jsmediatags)
      const fileName = file.name.replace(/\.[^/.]+$/, "")
      const parts = fileName.split(" - ")

      return {
        id: `song-${index}`,
        title: parts[1] || fileName,
        artist: parts[0] || "Artista Desconhecido",
        album: "Álbum Desconhecido",
        duration: 180 + Math.random() * 120, // Duração simulada
        file,
        cover: `/placeholder.svg?height=300&width=300`,
      }
    })

    const newSongs = await Promise.all(songPromises)
    setSongs(newSongs)
    setIsLoading(false)
  }

  // Controles do player
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    if (!currentSong) return
    const currentIndex = filteredSongs.findIndex((song) => song.id === currentSong.id)
    const nextIndex = isShuffled
      ? Math.floor(Math.random() * filteredSongs.length)
      : (currentIndex + 1) % filteredSongs.length

    if (repeatMode === "all" || nextIndex > currentIndex || isShuffled) {
      playSong(filteredSongs[nextIndex])
    }
  }

  const playPrevious = () => {
    if (!currentSong) return
    const currentIndex = filteredSongs.findIndex((song) => song.id === currentSong.id)
    const prevIndex = currentIndex === 0 ? filteredSongs.length - 1 : currentIndex - 1
    playSong(filteredSongs[prevIndex])
  }

  const playSong = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.src = URL.createObjectURL(song.file)
      audioRef.current.load()
    }
    setCurrentSong(song)
    setIsPlaying(true)
    setTimeout(() => audioRef.current?.play(), 100)
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  // Funções de playlist
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      songs: [],
      createdAt: new Date(),
    }

    setPlaylists([...playlists, newPlaylist])
    setNewPlaylistName("")
  }

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(playlists.filter((p) => p.id !== playlistId))
    if (selectedPlaylist === playlistId) {
      setSelectedPlaylist(null)
    }
  }

  const addToPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, songs: [...playlist.songs, songId] } : playlist,
      ),
    )
  }

  // Drag and drop
  const handleDragStart = (songId: string) => {
    setDraggedSong(songId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, playlistId: string) => {
    e.preventDefault()
    if (draggedSong) {
      addToPlaylist(playlistId, draggedSong)
      setDraggedSong(null)
    }
  }

  // Filtros e busca
  const filteredSongs = songs
    .filter((song) => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())

      if (selectedPlaylist) {
        const playlist = playlists.find((p) => p.id === selectedPlaylist)
        return matchesSearch && playlist?.songs.includes(song.id)
      }

      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "artist":
          return a.artist.localeCompare(b.artist)
        case "duration":
          return a.duration - b.duration
        default:
          return 0
      }
    })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Music className="w-8 h-8 text-green-400" />
            <h1 className="text-2xl font-bold">Music Flow</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar músicas, artistas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800 text-white w-64"
              />
            </div>

            <Button onClick={() => fileInputRef.current?.click()} className="bg-green-500 hover:bg-green-600">
              <Folder className="w-4 h-4 mr-2" />
              Importar Músicas
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-950 border-r border-gray-800 p-4">
          <div className="space-y-4">
            <Button
              variant={selectedPlaylist === null ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedPlaylist(null)}
            >
              <Music className="w-4 h-4 mr-2" />
              Todas as Músicas
            </Button>

            <Separator />

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400 uppercase">Playlists</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle>Nova Playlist</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Nome da playlist"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                    <Button onClick={createPlaylist} className="w-full">
                      Criar Playlist
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-64">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-800 ${
                    selectedPlaylist === playlist.id ? "bg-gray-800" : ""
                  }`}
                  onClick={() => setSelectedPlaylist(playlist.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, playlist.id)}
                >
                  <span className="text-sm truncate">{playlist.name}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-900 border-gray-800 animate-in slide-in-from-bottom-2 duration-200">
                      <DropdownMenuItem onClick={() => deletePlaylist(playlist.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-32">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="w-4 h-4 mr-2" />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("title")}>Por Título</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("artist")}>Por Artista</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("duration")}>Por Duração</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Badge variant="secondary">
              {filteredSongs.length} música{filteredSongs.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && songs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Music className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma música encontrada</h3>
              <p className="text-center mb-4">Clique em "Importar Músicas" para adicionar suas músicas locais</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Download className="w-4 h-4 mr-2" />
                Importar Músicas
              </Button>
            </div>
          )}

          {/* Songs Grid/List */}
          {!isLoading && filteredSongs.length > 0 && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  : "space-y-2"
              }
            >
              {filteredSongs.map((song) => (
                <Card
                  key={song.id}
                  className={`bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 cursor-pointer group transform hover:scale-105 hover:shadow-xl ${
                    currentSong?.id === song.id ? "ring-2 ring-green-400 scale-105 shadow-lg shadow-green-400/20" : ""
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(song.id)}
                  onClick={() => playSong(song)}
                >
                  <CardContent className={viewMode === "grid" ? "p-4" : "p-3 flex items-center gap-4"}>
                    {viewMode === "grid" ? (
                      <>
                        <div className="relative mb-4">
                          <img
                            src={song.cover || "/placeholder.svg"}
                            alt={song.title}
                            className="w-full aspect-square object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center rounded-md">
                            <Button
                              size="sm"
                              className="rounded-full transform hover:scale-125 active:scale-95 transition-all duration-150 bg-green-500 hover:bg-green-400"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <h4 className="font-semibold truncate transition-colors duration-200 group-hover:text-green-400">
                          {song.title}
                        </h4>
                        <p className="text-sm text-gray-400 truncate transition-colors duration-200 group-hover:text-white">
                          {song.artist}
                        </p>
                        <p className="text-xs text-gray-500">{formatTime(song.duration)}</p>
                      </>
                    ) : (
                      <>
                        <img
                          src={song.cover || "/placeholder.svg"}
                          alt={song.title}
                          className="w-12 h-12 object-cover rounded transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate transition-colors duration-200 group-hover:text-green-400">
                            {song.title}
                          </h4>
                          <p className="text-sm text-gray-400 truncate transition-colors duration-200 group-hover:text-white">
                            {song.artist}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">{formatTime(song.duration)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transform hover:scale-125 active:scale-95 transition-all duration-200"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Enhanced Dynamic Player */}
      {currentSong && (
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-950 via-black to-gray-950 border-t border-gray-800 p-4 backdrop-blur-lg z-50">
          <div className="max-w-screen-2xl mx-auto">
            {/* Progress Bar - Full Width */}
            <div className="mb-3">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={([value]) => seekTo(value)}
                className="w-full cursor-pointer hover:scale-y-150 transition-transform duration-150"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span className="transition-colors duration-200 hover:text-white">{formatTime(currentTime)}</span>
                <span className="transition-colors duration-200 hover:text-white">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Song Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative group">
                  <img
                    src={currentSong.cover || "/placeholder.svg"}
                    alt={currentSong.title}
                    className="w-16 h-16 object-cover rounded-lg shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white transform hover:scale-110 transition-transform duration-150"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white truncate text-lg transition-colors duration-200 hover:text-green-400 cursor-pointer">
                    {currentSong.title}
                  </h4>
                  <p className="text-sm text-gray-300 truncate transition-colors duration-200 hover:text-white cursor-pointer">
                    {currentSong.artist}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{currentSong.album}</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-400 transform hover:scale-110 transition-all duration-150"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-green-400 transform hover:scale-110 transition-all duration-150"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-900 border-gray-800 animate-in slide-in-from-bottom-2 duration-200">
                      {playlists.map((playlist) => (
                        <DropdownMenuItem
                          key={playlist.id}
                          onClick={() => addToPlaylist(playlist.id, currentSong.id)}
                          className="text-white hover:bg-gray-700 transition-colors duration-150"
                        >
                          Adicionar a "{playlist.name}"
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Main Player Controls - Super Dynamic */}
              <div className="flex flex-col items-center gap-3 flex-1">
                {/* Control Buttons */}
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`transition-all duration-200 transform hover:scale-125 active:scale-95 ${
                      isShuffled
                        ? "text-green-400 hover:text-green-300 scale-110 animate-pulse"
                        : "text-gray-400 hover:text-white hover:rotate-12"
                    }`}
                    title="Aleatório"
                  >
                    <Shuffle className="w-5 h-5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={playPrevious}
                    className="text-gray-300 hover:text-white transform hover:scale-125 active:scale-90 transition-all duration-150 hover:-translate-x-1"
                    title="Anterior"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>

                  <Button
                    className={`rounded-full w-16 h-16 bg-white text-black hover:bg-gray-100 transform transition-all duration-200 shadow-lg hover:shadow-2xl ${
                      isPlaying ? "hover:scale-110 active:scale-95 animate-pulse" : "hover:scale-115 active:scale-100"
                    }`}
                    onClick={togglePlay}
                    title={isPlaying ? "Pausar" : "Reproduzir"}
                  >
                    <div
                      className={`transform transition-all duration-200 ${isPlaying ? "scale-100" : "scale-110 translate-x-0.5"}`}
                    >
                      {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
                    </div>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={playNext}
                    className="text-gray-300 hover:text-white transform hover:scale-125 active:scale-90 transition-all duration-150 hover:translate-x-1"
                    title="Próxima"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setRepeatMode(repeatMode === "none" ? "all" : repeatMode === "all" ? "one" : "none")}
                    className={`transition-all duration-200 relative transform hover:scale-125 active:scale-95 ${
                      repeatMode !== "none"
                        ? "text-green-400 hover:text-green-300 scale-110 animate-pulse"
                        : "text-gray-400 hover:text-white hover:rotate-180"
                    }`}
                    title={`Repetir: ${repeatMode === "none" ? "Desligado" : repeatMode === "all" ? "Todas" : "Uma"}`}
                  >
                    <Repeat className="w-5 h-5" />
                    {repeatMode === "one" && (
                      <span className="absolute -top-1 -right-1 text-xs bg-green-400 text-black rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                        1
                      </span>
                    )}
                  </Button>
                </div>

                {/* Dynamic Status Indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isPlaying ? "bg-green-400 animate-pulse shadow-lg shadow-green-400/50" : "bg-gray-500"
                    }`}
                  ></div>
                  <span className={`transition-colors duration-300 ${isPlaying ? "text-green-400" : "text-gray-400"}`}>
                    {isPlaying ? "Reproduzindo" : "Pausado"}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{songs.length} músicas</span>
                </div>
              </div>

              {/* Volume Control & Additional Options */}
              <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="hidden md:flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleMute}
                    className={`transition-all duration-200 transform hover:scale-125 active:scale-95 ${
                      isMuted ? "text-red-400 animate-pulse" : "text-gray-400 hover:text-white"
                    }`}
                    title={isMuted ? "Ativar som" : "Silenciar"}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <div className="flex items-center gap-2 group">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={([value]) => {
                        changeVolume(value)
                        setIsMuted(value === 0)
                      }}
                      className="w-28 cursor-pointer transform group-hover:scale-105 transition-transform duration-200"
                    />
                    <span
                      className={`text-xs w-8 transition-all duration-200 ${
                        volume > 0.7 ? "text-green-400" : volume > 0.3 ? "text-yellow-400" : "text-gray-400"
                      }`}
                    >
                      {Math.round((isMuted ? 0 : volume) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Queue/Playlist Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white transform hover:scale-125 active:scale-95 transition-all duration-150 hover:rotate-12"
                  title="Fila de reprodução"
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        webkitdirectory=""
        multiple
        accept="audio/*"
        onChange={handleFolderSelect}
        className="hidden"
      />

      {/* Audio Element */}
      <audio ref={audioRef} />
    </div>
  )
}

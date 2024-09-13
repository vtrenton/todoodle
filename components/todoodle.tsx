'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PenIcon, DownloadIcon, SaveIcon, TrashIcon, LogInIcon, LogOutIcon, RefreshCwIcon, CheckIcon, XIcon } from 'lucide-react'

interface Note {
  id: number;
  title: string;
  content: string;
}

export function TodoodleComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isTearing, setIsTearing] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) {
      context.lineWidth = 2
      context.lineCap = 'round'
      context.strokeStyle = 'rgba(0, 0, 0, 0.7)'
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    context?.beginPath()
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context && canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
      const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top
      context.lineTo(x, y)
      context.stroke()
      context.beginPath()
      context.moveTo(x, y)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically validate the login with a backend service
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  const handleSaveNote = () => {
    setIsTranscribing(true)
    setIsTearing(true)
    // Simulate AI transcription process
    setTimeout(() => {
      const newNote: Note = {
        id: Date.now(),
        title: `Note ${notes.length + 1}`,
        content: `Transcribed content from doodle at ${new Date().toLocaleString()}`
      }
      setNotes([...notes, newNote])
      setIsTranscribing(false)
      clearCanvas()
      setTimeout(() => setIsTearing(false), 1000) // Reset tearing state after animation
    }, 2000)
  }

  const handleDeleteNote = (id: number) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    // Here you would typically delete the note from a backend service if logged in
  }

  const handleEditNote = (id: number) => {
    setEditingNoteId(id)
  }

  const handleUpdateNote = (id: number, updatedTitle: string, updatedContent: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, title: updatedTitle, content: updatedContent } : note
    )
    setNotes(updatedNotes)
    setEditingNoteId(null)
    // Here you would typically update the note in a backend service if logged in
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([notes.map(note => `${note.title}\n\n${note.content}\n\n`).join('---\n\n')], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = "todoodle_notes.txt"
    document.body.appendChild(element)
    element.click()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  return (
    <div className="min-h-screen bg-notepad bg-repeat bg-[length:100px_100px] p-4">
      <style jsx global>{`
        .bg-notepad {
          background-image: 
            linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
            linear-gradient(#eee .1em, transparent .1em);
          background-size: 100% 1.2em;
        }
        .canvas-container {
          position: relative;
          overflow: hidden;
        }
        .canvas-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
            linear-gradient(#eee .1em, transparent .1em);
          background-size: 100% 1.2em;
          opacity: 0.5;
          pointer-events: none;
        }
        @keyframes tear {
          0% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 85% 90%, 70% 100%, 55% 90%, 40% 100%, 25% 90%, 10% 100%, 0 90%); }
        }
        .tearing {
          animation: tear 1s forwards;
        }
      `}</style>
      <div className="container mx-auto">
        <Card className="mb-4 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between border-b border-blue-200">
            <CardTitle className="text-3xl font-bold text-blue-800">Todoodle.ai{isLoggedIn ? `, ${username}` : ''}!</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  {isLoggedIn ? <><LogOutIcon className="w-4 h-4 mr-2" />Logout</> : <><LogInIcon className="w-4 h-4 mr-2" />Login</>}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isLoggedIn ? 'Logout' : 'Login'}</DialogTitle>
                </DialogHeader>
                {isLoggedIn ? (
                  <Button onClick={handleLogout}>Confirm Logout</Button>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="doodle" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="doodle">Doodle</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="doodle">
                <div className={`canvas-container border-2 border-blue-300 rounded-lg overflow-hidden bg-transparent ${isTearing ? 'tearing' : ''}`}>
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="w-full h-auto touch-none"
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <Button onClick={clearCanvas} variant="outline" className="border-blue-300">
                    <RefreshCwIcon className="w-4 h-4 mr-2" />
                    Clear Canvas
                  </Button>
                  <Button onClick={handleSaveNote} disabled={isTranscribing} className="bg-blue-600 hover:bg-blue-700">
                    <SaveIcon className="w-4 h-4 mr-2" />
                    {isTranscribing ? 'Transcribing...' : 'Save Note'}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <ScrollArea className="h-[400px] w-full rounded-md border-2 border-blue-300 p-4 bg-white/50">
                  {notes.length === 0 ? (
                    <p className="text-center text-blue-600">No notes yet. Start doodling to create some!</p>
                  ) : (
                    notes.map((note) => (
                      <Card key={note.id} className="mb-4 border border-blue-200 bg-white/70">
                        <CardContent className="pt-4">
                          {editingNoteId === note.id ? (
                            <div className="space-y-2">
                              <Input
                                value={note.title}
                                onChange={(e) => {
                                  const updatedNotes = notes.map(n => 
                                    n.id === note.id ? { ...n, title: e.target.value } : n
                                  )
                                  setNotes(updatedNotes)
                                }}
                                className="font-bold"
                              />
                              <Textarea
                                value={note.content}
                                onChange={(e) => {
                                  const updatedNotes = notes.map(n => 
                                    n.id === note.id ? { ...n, content: e.target.value } : n
                                  )
                                  setNotes(updatedNotes)
                                }}
                                rows={4}
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="font-bold mb-2">{note.title}</h3>
                              <p className="text-blue-800">{note.content}</p>
                            </>
                          )}
                        </CardContent>
                        <CardFooter className="justify-end space-x-2">
                          {editingNoteId === note.id ? (
                            <>
                              <Button size="sm" onClick={() => handleUpdateNote(note.id, note.title, note.content)}>
                                <CheckIcon className="w-4 h-4 mr-2" />Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <XIcon className="w-4 h-4 mr-2" />Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" onClick={() => handleEditNote(note.id)}>
                                <PenIcon className="w-4 h-4 mr-2" />Edit
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteNote(note.id)}>
                                <TrashIcon className="w-4 h-4 mr-2" />Delete
                              </Button>
                            </>
                          )}
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="justify-end border-t border-blue-200">
            <Button onClick={handleDownload} disabled={notes.length === 0} className="bg-blue-600 hover:bg-blue-700">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download Notes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
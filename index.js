import express from 'express'
import morgan from 'morgan'
import cors from 'cors'


let notes = [
  {
    "id": 1,
    "content": "ntoa loca",
    "important": true
  },
  {
    "id": 2,
    "content": "ni idea capo",
    "important": false
  }
]

const app = express();

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.send('<h1>¡Servidor corriendo! 🚀</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const body = req.body

  const noteIndex = notes.findIndex(n => n.id === Number(id))
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'nota no encontrada' })
  }

  const updatedNote = {
    ...notes[noteIndex],
    content: body.content,
    important: body.important
  }

  notes[noteIndex] = updatedNote
  res.json(updatedNote)
})


app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.filter(n => n.id === id)

  if(!note) {
    res.status(404).send('nota no encontrada')
  }
  res.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

const PORT = 3000
app.listen(PORT, () => console.log(`Server running on port: localhost:${PORT} 🚀`))
import express from 'express'
import sampleHabits from './data/sampleHabits.js'

const app = express()
const PORT = 3000

app.get("/sampleHabits" , (req, res) => {
    return res.json(sampleHabits)
})

app.post("/sampleHabits" , (req, res) => {
    const newHabit = req.body
    sampleHabits.push(newHabit)
    return res.status(201).json({ message: "Habit added successfully" })
})

app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`)
})
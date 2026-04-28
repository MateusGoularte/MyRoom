const express = require('express')
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/booksController')
const authMidlleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', authMidlleware, createBook)
router.get('/', authMidlleware, getBooks)
router.put('/:id', authMidlleware, updateBook)
router.delete('/:id', authMidlleware, deleteBook)

module.exports = router
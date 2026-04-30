const express = require('express');
const { Todo } = require('../mongo')
const RedisClient = require('../redis/index');
const router = express.Router();
const { REDIS_KEY } = require('../util/config')



/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  RedisClient.get(REDIS_KEY) .then(value => {
    const parsed = Number.parseInt(value ?? '0', 10)
    const counter = Number.isNaN(parsed) ? 0 : parsed
    RedisClient.set(REDIS_KEY, String(counter + 1))
  })

  res.send(todo);
});

// GET by id
router.get('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  if (todo) {
    res.json(todo)
  } else {
    res.status(404).end()
  }
})

// PUT
router.put('/:id', async (req, res) => {
  const { text, done } = req.body
  const todo = await Todo.findById(req.params.id)
  if (todo) {
    todo.text = text
    todo.done = done
    const changedTodo = await todo.save()
    res.json(changedTodo)
  } else {
    return res.status(404).end()
  }
})


const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.sendStatus(405); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  res.sendStatus(405); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;

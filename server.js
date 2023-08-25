// server side
const express = require('express')
const {Pool} = require('pg')

// allow cross resourse
const cors = require('cors')

var pool
pool = new Pool({
    user: 'postgres',
    host: 'db',
    password: 'password',
    port: 5432,
})

const PORT = 3001

const app = express()

app.use(express.json()); 

app.use(cors({
    origin: 'http://localhost:3000', // allowed front-end resourse
    methods: 'GET,POST, DELETE, PUT', // allowed request method
    allowedHeaders: 'Content-Type', // 允许的请求头
}));

// request from main page:

// create recipe and ingredient table
// recipe table has id as primary key, ingredient table has recipeId as foreign key reference id
// on delete cascade make when deleting recipe, also delete corresponding ingredients
app.post('/', async(requ,resp) => {
    console.log("/")
    console.log(requ.method)
    try {
        const sqlRecipe = `CREATE TABLE IF NOT EXISTS recipe (id serial primary key, title varchar(255), recipeInstructions text, timeLastModified text)`;
        await pool.query(sqlRecipe);
        const sqlIngredient = `CREATE TABLE IF NOT EXISTS ingredient (id serial primary key, name varchar(255), recipeId int references recipe(id) ON DELETE CASCADE)`;
        await pool.query(sqlIngredient);

        resp.send("Tables created successfully")
    }
    catch (e) {
        resp.end(e)
    }
})
// simply drop table, for testing
app.delete('/deleteAll', async function(requ,resp){
    console.log(requ.method)
    try {
        // drop two tables
        var dropIngredient = `DROP TABLE IF EXISTS ingredient`
        await pool.query(dropIngredient)
        var dropRecipe = `DROP TABLE IF EXISTS recipe`
        await pool.query(dropRecipe)

        resp.send('All Tables deleted');
    } catch (e) {
        resp.send(e)
    }
})

// request from add and recipe list page:

// insert recipe into database
app.post('/add', async(requ,resp) => {
    console.log(requ.method)
    try {
        // here recipe is data from front end
        const recipe = requ.body;
        var insertRecipe = `INSERT INTO recipe (id, title, recipeInstructions, timeLastModified) VALUES ($1, $2, $3, $4) RETURNING *`
        const newRecipe = await pool.query(insertRecipe, [recipe.id, recipe.name, recipe.directions, recipe.savedTime]);
        var insertIngredient = `INSERT INTO ingredient (name, recipeId) VALUES ($1, $2) RETURNING *`
        const newRecipeIngredient = await pool.query(insertIngredient, [recipe.ingredients, recipe.id]);
        resp.json(newRecipe.rows[0] + newRecipeIngredient.rows[0]);
    }
    catch (e) {
        resp.send(e); // 或者 JSON.stringify(e)
    }
    
})
// get all recipes in database, by order of id
app.get('/list', async(requ,resp) => {
    console.log(requ.method)
    try {
        var recipes = `SELECT * FROM recipe ORDER BY id ASC `
        const result = await pool.query(recipes);
        resp.json(result.rows);
    }
    catch (e) {
        resp.send(e);
    }
})
// get recipe in database of id
app.get('/list/:id', async function(req,res){
    console.log(req.method)
    console.log([req.params.id])
    try {
        var recipe = `SELECT * FROM recipe WHERE id = $1 `
        const result = await pool.query(recipe, [req.params.id])
        res.json(result.rows)
    } catch (e) {
        res.end(e)
    }
})
// get ingredients according to recipeId
app.get('/listIngredients/:id', async(requ, resp) => {
    console.log(requ.method)
    try {
        var ingredient = `SELECT * FROM ingredient WHERE recipeid = $1 `
        const result = await pool.query(ingredient, [requ.params.id])
        resp.json(result.rows)
    }
    catch (e) {
        resp.send(e);
    }
})
// delete recipe and ingredient according to id
app.delete('/list/:id', async function(req,res){
    console.log(req.method)
    console.log([req.params.id])
    try {
        const recipeId = req.params.id;
        
        // Delete the associated ingredients
        const deleteIngredientsQuery = 'DELETE FROM ingredient WHERE recipeid = $1';
        await pool.query(deleteIngredientsQuery, [recipeId]);

        // Delete the recipe
        const deleteRecipeQuery = 'DELETE FROM recipe WHERE id = $1';
        await pool.query(deleteRecipeQuery, [recipeId]);
        
        res.status(204).end(); // 返回 204 状态码，表示删除成功，响应体为空
    } catch (e) {
        const error = getSomeError(); 
        res.end(error.toString());
    }
})
// edit and update changes
app.put('/edit/:id', async(req, res) => {
    console.log(req.method)
    try {
      const recipe = req.body;
      console.log([recipe.title, recipe.recipeinstructions, recipe.time, req.params.id])
      const updatedRecipe = await pool.query(`UPDATE recipe SET title = $1, recipeInstructions = $2, timeLastModified = $3 WHERE id = $4 RETURNING *`, [recipe.title, recipe.recipeinstructions, recipe.time, req.params.id]);
      await pool.query(`UPDATE ingredient SET name = $1 WHERE recipeId = $2`, [recipe.ingredient, req.params.id]);
      res.json(updatedRecipe.rows[0]);
    }
    catch (e) {
      res.status(500).send({error: e.toString()})
    }
  });
  
app.listen(PORT, '0.0.0.0')
console.log(`Running on port ${PORT}`)

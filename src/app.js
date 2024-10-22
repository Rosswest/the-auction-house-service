
const { Catalogue } = require("./catalogue/catalogue");
const { Inventory } = require("./inventory/inventory");

const express = require('express')

const app = express()
const port = 3000

const catalogue = new Catalogue();
const inventory = new Inventory(catalogue);

console.log("Catalogue populated with " + catalogue.items.size + " items");
console.log("Inventory populated with " + inventory.items.size + " items");

app.get('/', (req, res) => {
  const items = inventory.items;
  
  res.send(Array.from(inventory.items));
})

app.get('/cost', (req, res) => {
  console.log(req);
  const min = req.query.min;
  const max = req.query.max;
  const results = inventory.getByValue(min,max);
  // console.log(results);
  res.send(Array.from(results));
})

app.get('/name', (req, res) => {
  const name = req.query.q;
  const search = req.query.search;
  const results = inventory.getByName(name,search);
  // console.log(results);
  res.send(Array.from(results));
})

app.get('/catalogue', (req, res) => {
  const search_params = req.query.search;
  const results = inventory.search(search_params);
  res.send(Array.from(results));
})

app.get('/inventory', (req, res) => {
  const search_params = req.query;
  const results = inventory.search(search_params);
  res.send(Array.from(results));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
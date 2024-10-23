
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
  const results = {
    "Catalogue": catalogue.items.size + " items",
    "Inventory": inventory.items.size + " items"
  };
  
  res.send(results);
})

app.get('/catalogue', (req, res) => {
  let results = null;
  console.log(req.query);
  
  if (isEmpty(req.query)) {
    // warning for no search params
    res.status(400);
    res.send('No search parameters provided');

  } else if (req.query.ids != undefined && req.query.ids != null) {
    // ids take priority
    const ids = req.query.ids;
    results = catalogue.filterByIds(catalogue.items,ids);
  } else {

    //otherwise do a normal search
    const search_params = req.query;
    results = catalogue.search(search_params);
  }

  res.send(Array.from(results));
})


app.get('/catalogue/all', (req, res) => {
  res.send(Array.from(catalogue.items));
})

app.get('/inventory', (req, res) => {
  let results = null;
  console.log(req.query);

  if (isEmpty(req.query)) {
    // warning for no search params
    res.status(400);
    res.send('No search parameters provided');

  } else if (req.query.ids != undefined && req.query.ids != null) {
    // ids take priority
    const ids = JSON.parse(req.query.ids);
    results = inventory.filterByIds(inventory.items,ids);
  } else {

    //otherwise do a normal search
    const search_params = req.query;
    results = inventory.search(search_params);
  }

  

  res.send(Array.from(results));
})

app.get('/inventory/all', (req, res) => {
  res.send(Array.from(inventory.items));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function isEmpty(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true
}
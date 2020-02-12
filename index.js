const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const _ = require('lodash');

var BreakException = {};
const port = 3000;
app.use(bodyParser.urlencoded({extended: false}));

/* the API should implement the following commands:
 *		- /products - returns a list of the attributes of all prods
 *		- /products/id - returns the attributes of the prod. whose id is spec'd
 *		- /delete/id - removes the product w/ the spec'd id from inv
 *		- /delete - removes all products from the inventory
 *		- /add_product/id - adds a new product w/ spec'd id into inventory
 *		- /update_product/id
*/

var products = [{id: 0,
				 name: "apple",
				 quantity: 5,
				 price: 2.99},
				{id: 2,
				 name: "test",
				 quantity: 2,
				 price: 3.00},
				{id: 1,
				 name: "orange",
				 quantity: 10,
				 price: 5.99},
				{id: 3,
				 name: "banana",
				 quantity: 12,
				 price: 8.99}];

app.get('/', (req, res) => {
	res.statusCode = 200; // OK
	res.sendFile(__dirname + '/index.html');
});

app.get('/products', (req, res) =>{
	response = '<h1>Products</h1>';
	products.forEach(product => {
		response = response + '<div>';
		response = response + `Product ID:\t${product.id}\tName:\t${product.name}\t\tQuantity:\t${product.quantity}\tPrice:\t$${product.price}`;
		response = response + '</div>';
	});
	console.log(response);
	res.status(200).send(response);
});

// get product by id
app.get('/products/:id', (req, res) => {
	console.log('Product ID ' + req.params.id + ' requested');
	reqProduct = products.find(product => product.id == req.params.id);
	if (reqProduct === undefined)
		res.end(`<html><h1>Product not found.</h1><p>Product ID ${req.params.id} not in inventory.</p></html>`);
	else
		res.end(`<html><h1>Requested Product:</h1><p>ID: ${reqProduct.id}, Name: ${reqProduct.name}, Quantity: ${reqProduct.quantity}, Price: $${reqProduct.price}</p>`);
});

app.get('/delete/:id', (req, res) => {
	console.log('Product ID:' + req.params.id + ' requested for deletion.');
	// delete the product
	products.forEach(product => {
		if (product.id == req.params.id) {
			_.remove(products, product);
			productFound = true;
			res.end(`<html>Product ID = ${req.params.id} deleted.</html>`);
		}
	});
	if (!productFound)
		res.end(`<html>Product ID ${req.params.id} did not exist.</html>`);
	sortProducts(products);
	console.log(products);
});

app.get('/delete', (req, res) => {
	console.log('Request for deletion of all products received.');
	products = [];
	res.end('All products deleted.');
});

app.post('/add_product/id', (req, res) => {
	new_product = {};
	if (products.find(product => product.id == req.body.id) !== undefined) {
		res.end('<html><h1>Product already exists</h1><p>Click <a href="http://localhost:3000">here</a> to return to dashboard.</p></html>');
	}
	else {
		new_product.id = Number(req.body.id);
		new_product.name = req.body.name;
		new_product.quantity = Number(req.body.quantity);
		new_product.price = Number(req.body.price);
		console.log(`New product added: ${JSON.stringify(new_product)}`);
		products.push(new_product);
		sortProducts(products);
		console.log('Products state: ' + products);
		res.sendFile(__dirname + '/productadded.html');
	}
});

app.post('/update_product/id', (req, res) => {
	var updated_product = {id: "", name: "", quantity: "", price: ""};
	flag = false;
	products.forEach((product) => {
		if (req.body.id == product.id) {
			Object.keys(product).forEach((key) => {
				if (req.body[key] == "") {
					updated_product[key] = product[key];
				}
				else {
					product[key] = req.body[key];
					updated_product[key] = product[key];
				};
			});
			// product updated
			updated_product.id = Number(updated_product.id);
			updated_product.quantity = Number(updated_product.quantity);
			updated_product.price = Number(updated_product.price);
			
			product.id = Number(product.id);
			product.quantity = Number(product.quantity);
			product.price = Number(product.price);
			
			console.log('Updated product: ' + JSON.stringify(updated_product));
			products[product.id] = product;
			sortProducts(products);
			console.log(products);
			flag = true;
			res.sendFile(__dirname + '/updatedproduct.html');
		}
	});
	if (!flag) {
		res.end('<html><head><title>Product not found</title></head><body>Product was not found under that ID. Click <a href=\"http://localhost:3000/\">here</a> to return home and try again.</body></html>');
	}
});

app.listen(port, () => {
	console.log(`server listening on port ${port}`);
})

function sortProducts(array) {
	array.sort((a, b) => {
		return a.id < b.id ? -1
			 : b.id < a.id ?  1
			 : 0;
	});
	return array;
}

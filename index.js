const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 3000;

let products = [{id: 0,
				 name: "apple",
				 quantity: 5,
				 price: 2.99},
				{id: 1,
				 name: "orange",
				 quantity: 10,
				 price: 5.99},
				{id: 2,
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
	console.log('Product ' + req.params.id + ' requested');
	res.end(JSON.stringify(products[req.params.id]));
});

/* app.get('/products/delete/:id', (req, res) => {
	console.log('Product ID:' + req.params.id + ' requested for deletion.');
	// delete the product
	
}); */

/* app.post('/add_product', (req, res) => {
	
}); */

app.listen(port, () => {
	console.log(`server listening on port ${port}`);
})


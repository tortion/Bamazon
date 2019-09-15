var mysql = require("mysql");
var inquirer = require("inquirer");
var clear = require('clear');

var globalResults = [];
var item = 0;
var itemPtr = 0;
var qty = 0;

function purchaseProduct() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        globalResults = results;
        console.log("\n\n[Item  Product                          Department          Price     Inv]");
        console.log("[-----|--------------------------------|----------------|--------|-------]")
        for (let i = 0; i < results.length; i++) {
            var pricePad = "";
            var invPad = "";

            if ((results[i].price.toString(10)).includes('.'))
                pricePad = results[i].price.toString(10)
            else
                pricePad = results[i].price.toString(10) + '.00';
            if ((results[i].stock_quantity.toString(10)).includes('.'))
                invPad = results[i].stock_quantity.toString(10)
            else
                invPad = results[i].stock_quantity.toString(10) + '.00'
            console.log(' ' + results[i].item_id.toString(10).padStart(4) + ' |' +
                results[i].product_name.padEnd(32) + '|' +
                results[i].department_name.padEnd(16) + '|' +
                pricePad.padStart(8) + '|' +
                invPad.padStart(7));
        }
        console.log("[-----|--------------------------------|----------------|--------|-------]\n\n\n.")
    
    inquirer
        .prompt([
            {
                name: "itemNum",
                type: "input",
                message: "Which item would you like to purchase?"
            },
            {
                name: "qtyDesired",
                type: "input",
                message: "Enter the quantity required"
            }
        ])
        .then(function (answer) {
            item = answer.itemNum;
            itemPtr = item - 1;
            qty = answer.qtyDesired;
            if (globalResults[itemPtr].stock_quantity < qty) {
                console.log("\n\nSo sorry; we do not have enough " + globalResults[itemPtr].product_name + " to fill your order.\n\n\n\n");
            } else {
                var inventoryLeft = globalResults[itemPtr].stock_quantity - qty;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: inventoryLeft
                        },
                        {
                            item_id: item
                        }
                    ],
                    function (error) {
                        if (error) throw error
                        else {
                            clear();
                            console.log("You purchased " + qty + " of [" + globalResults[itemPtr].product_name + "]'s for a total of $" + qty * globalResults[itemPtr].price + "\n\nThank you for your order!\n\n");
                        }
                    }
                );
            }
            start();
        })
    })
}

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt([{
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["Purchase a product from Bamm", "EXIT"]
        }])
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            switch (answer.action) {

                case "Purchase a product from Bamm": purchaseProduct();
                    break;

                case "EXIT": connection.end();
                    break;
            }
        });
}

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

// connect to the mysql server and sql database
// console.log(connection);
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
});

clear();
start();

var mysql = require("mysql");
var inquirer = require("inquirer");

var debug = false;
var globalResults = [];
var item = 0;
var qty = 0;

function displayInventory() {
    // query the database for all items being auctioned
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
    })
}

function purchaseProduct() {
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
            qty = answer.qtyDesired;

            console.log(globalResults[item].stock_quantity)
            console.log(qty);
            if (globalResults[item].stock_quantity < qty) {
                console.log("\n\nSo sorry; we do not have enough " + globalResults[item].product_name + " to fill your order.\n\n");
            } else {
                var inventoryLeft = globalResults[item].stock_quantity - qty;
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
                        else
                            console.log("You purchased " + qty + " of " + globalResults[item].product_name + "'s for a total of " + qty * globalResults[item].price + "\n\nThank you for your order!\n\n");
                    }
                );
            }
        })
}

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["Purchase a product from Bamm", "Display Inventory", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            switch (answer.action) {

                case "Purchase a product from Bamm": purchaseProduct();
                    start();
                    break;

                case "Display Inventory": displayInventory();
                    start();
                    break;

                case "EXIT": connection.end();
                    break;
            }
        });
}


//       // once you have the items, prompt the user for which they'd like to bid on
//       for (let i = 0; i < results.length; i++) {
//           console.log( )
//         .then(function(answer) {
//           // get the information of the chosen item
//           var chosenItem;
//           for (var i = 0; i < results.length; i++) {
//             if (results[i].item_name === answer.choice) {
//               chosenItem = results[i];
//             }
//           }

//           // determine if bid was high enough
//           if (chosenItem.highest_bid < parseInt(answer.bid)) {
//             // bid was high enough, so update db, let the user know, and start over
//             connection.query(
//               "UPDATE auctions SET ? WHERE ?",
//               [
//                 {
//                   highest_bid: answer.bid
//                 },
//                 {
//                   id: chosenItem.id
//                 }
//               ],
//               function(error) {
//                 if (error) throw err;
//                 console.log("Bid placed successfully!");
//                 start();
//               }
//             );
//           }
//           else {
//             // bid wasn't high enough, so apologize and start over
//             console.log("Your bid was too low. Try again...");
//             start();
//           }
//         });
//     });
//   }   

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

start();


// function queryArtist() {
//  inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function (value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function (answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid || 0,
//           highest_bid: answer.startingBid || 0
//         },
//         function (err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }

// function bysong() {


//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM top5000 where ?",
//     {
//       artist: userArtist
//     }
//   ],
//   function (error) {
//     if (error) throw err;
//     console.log("Bid placed successfully!");
//     start();
//   }
// );



// ?", function (err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function () {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then(function (answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             function (error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }

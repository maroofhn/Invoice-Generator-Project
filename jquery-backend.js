// Declare Item Object
        const item = {
            name: "",
            code: "",
            price: 0,
            vat: 0
        };

        // Declare Item Array
        const itemArray = [];

        // Add Item to the array and update the Item Management section
        $(".addbutton").click(function() {
            item.name = $("#itemName").val();
            item.code = $("#itemCode").val();
            item.price = parseFloat($("#itemPrice").val()) || 0;
            item.vat = parseFloat($("#itemVAT").val()) || 0;

            // Push the item object into the array
            itemArray.push({ ...item });

            // Log and Alert
            console.log(item);
            console.log(itemArray);
            alert(`${item.name} with code ${item.code} and price of SAR ${item.price} has been added.`);

            // Reset item object
            item.name = "";
            item.code = "";
            item.price = 0;
            item.vat = 0;

            // Update the Item Management section
            updateItemDivs();
            updateItemDropdown();
        });

        // Update the Item Management Divs
        function updateItemDivs() {
            $("#INameDiv").html("<h4>Name</h4>");
            $("#ICodeDiv").html("<h4>Code</h4>");
            $("#IPriceDiv").html("<h4>Price</h4>");
            $("#IVATDiv").html("<h4>VAT</h4>");

            // Loop through and display items
            itemArray.forEach(item => {
                $("#INameDiv").append(`<p>${item.name}</p>`);
                $("#ICodeDiv").append(`<p>${item.code}</p>`);
                $("#IPriceDiv").append(`<p>${item.price}</p>`);
                $("#IVATDiv").append(`<p>${item.vat}</p>`);
            });
        }

        // Update the dropdown with all the items
        function updateItemDropdown() {
            const itemDropdown = $("#itemDropdown");
            itemDropdown.html("<option>-</option>"); // Reset the dropdown

            itemArray.forEach(item => {
                itemDropdown.append(`<option value="${item.name}">${item.name}</option>`);
            });
        }

        // -------------------------- Customer Section --------------------------

        // Declare Customer Object
        const customer = {
            name: "",
            address: "",
            vatreg: ""
        };

        const customerArray = [];

        // Add Customer to the array and update the Customer Management section
        $(".addbutton2").click(function() {
            customer.name = $("#customerName").val();
            customer.address = $("#customerAddress").val();
            customer.vatreg = $("#customerVAT").val();

            // Push the customer object into the array
            customerArray.push({ ...customer });

            // Log and Alert
            console.log(customer);
            console.log(customerArray);
            alert(`${customer.name} with VAT Registration Number of ${customer.vatreg} has been added.`);

            // Reset customer object
            customer.name = "";
            customer.address = "";
            customer.vatreg = "";

            updateItemDivs2();
            updateCustomerDropdown();
        });

        // Update the Customer Management Divs
        function updateItemDivs2() {
            $("#CNameDiv").html("<h4>Name</h4>");
            $("#CAddrDiv").html("<h4>Address</h4>");
            $("#CVATDiv").html("<h4>VAT Registration</h4>");

            customerArray.forEach(customer => {
                $("#CNameDiv").append(`<p>${customer.name}</p>`);
                $("#CAddrDiv").append(`<p>${customer.address}</p>`);
                $("#CVATDiv").append(`<p>${customer.vatreg}</p>`);
            });
        }

        // Update the Customer Dropdown for invoice selection
        function updateCustomerDropdown() {
            const customerDropdown = $("#CustomerDD");
            customerDropdown.html("<option>-</option>"); // Reset the dropdown

            customerArray.forEach(customer => {
                customerDropdown.append(`<option value="${customer.name}">${customer.name}</option>`);
            });
        }

        // -------------------- Invoice Section --------------------

        // When the "Add Item to Invoice" button is clicked
        $("#addItemToInvoice").click(function() {
            const selectedItemName = $("#itemDropdown").val();
            const selectedQuantity = parseInt($("#itemQuantity").val()) || 1;

            // If the item name is not selected, alert user.
            if (selectedItemName === "-") {
                alert("Please select an item.");
                return;
            }

            // Find the selected item from the array
            const selectedItem = itemArray.find(item => item.name === selectedItemName);

            if (selectedItem) {
                addItemToInvoice(selectedItem, selectedQuantity);
                updateInvoiceTotals();
            } else {
                alert("Item not found.");
            }
        });

        // Add item to the invoice table
        function addItemToInvoice(item, quantity) {
            const tbody = $("#invoiceTable tbody");
            const row = $("<tr></tr>");

            // Item Name
            const nameCell = $("<td></td>").text(item.name);
            row.append(nameCell);

            // Price
            const priceCell = $("<td></td>").text(item.price.toFixed(2));
            row.append(priceCell);

            // Quantity input
            const qtyCell = $("<td></td>");
            const qtyInput = $("<input>").attr({
                type: "number",
                value: quantity,
                min: 1,
                style: "width: 60px",
                onchange: "updateSubtotal(this)"
            });
            qtyCell.append(qtyInput);
            row.append(qtyCell);

            // Subtotal
            const subtotalCell = $("<td></td>").text((item.price * quantity).toFixed(2));
            row.append(subtotalCell);

            tbody.append(row);
        }

        // Update Subtotal for the item rows
        function updateSubtotal() {
            const rows = $("#invoiceTable tbody tr"); 
            let total = 0;

            // Loop through each row to update the subtotal
            rows.each(function() {
                const qtyInput = $(this).find("input");  
                const qty = parseInt(qtyInput.val()) || 0;  
                const price = parseFloat($(this).children().eq(1).text());  
                const subtotal = qty * price;  
                $(this).children().eq(3).text(subtotal.toFixed(2));  

                total += subtotal; 
            });

            updateInvoiceTotals(total);  
        }

        // Calculate total and VAT
        function updateInvoiceTotals() {
            let total = 0; // Start with 0 total

            // Loop through all rows in the invoice table to sum the subtotals
            const tbody = $("#invoiceTable tbody");
            tbody.find("tr").each(function() {
                const subtotal = parseFloat($(this).children().eq(3).text()) || 0;
                total += subtotal; // Add each item's subtotal to the total
            });

            // Get the selected VAT option
            const vatOption = $("input[name='vatOption']:checked").val();
            let vat = 0;

            // Calculate VAT based on the selected option
            if (vatOption === "exclusive") {
                vat = total * 0.15;
                total += vat; // Add VAT to the total if exclusive
            } else if (vatOption === "none") {
                vat = total * 0.15 / 1.15; // Remove VAT from the total if no VAT
                total -= vat;
            } else if (vatOption === "inclusive") {
                vat = total * 0.15 / 1.15; // Calculate VAT included in the price
            }

            // Calculate Discount based on user input
            const discountPercentage = parseFloat($("#discount").val()) || 0;
            const discountAmount = (total * discountPercentage) / 100;
            total -= discountAmount; // Subtract the discount from the total

            // Update the discount and total displayed on the page
            $("#totalDiscount").text(discountAmount.toFixed(2));

            // Update the total and VAT displayed on the page
            $("#totalPrice").text(total.toFixed(2));
            $("#totalVAT").text(vat.toFixed(2));
        }

        // Listen for changes to the VAT option and update totals immediately
        $("input[name='vatOption']").change(updateInvoiceTotals);

        // Update the dropdown with available items
        updateItemDropdown();

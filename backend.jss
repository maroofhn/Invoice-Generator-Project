// Update Subtotal for the item rows
function updateSubtotal() {
    const rows = document.querySelectorAll("#invoiceTable tbody tr");  // Get all rows in the invoice table
    let total = 0;

    // Loop through each row to update the subtotal
    rows.forEach(row => {
        const qtyInput = row.querySelector("input");  
        const qty = parseInt(qtyInput.value) || 0;  
        const price = parseFloat(row.cells[1].textContent);  
        const subtotal = qty * price;  
        row.cells[3].textContent = subtotal.toFixed(2);  

        total += subtotal;  // Add the subtotal to the total
    });

    updateInvoiceTotals(total);  
}


// Calculate total and VAT
function updateInvoiceTotals() {
    let total = 0; // Start with 0 total

    // Loop through all rows in the invoice table to sum the subtotals
    const tbody = document.querySelector("#invoiceTable tbody");
    tbody.querySelectorAll("tr").forEach(row => {
        const subtotal = parseFloat(row.cells[3].textContent) || 0;
        total += subtotal; // Add each item's subtotal to the total
    });

    // Get the selected VAT option
    const vatOption = document.querySelector('input[name="vatOption"]:checked').value;
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

    // Update the total and VAT displayed on the page
    document.getElementById("totalPrice").textContent = total.toFixed(2);
    document.getElementById("totalVAT").textContent = vat.toFixed(2);
}


// Listen for changes to the VAT option and update totals immediately
document.querySelectorAll('input[name="vatOption"]').forEach(input => {
    input.addEventListener('change', updateInvoiceTotals);
});


// Update the dropdown with available items
updateItemDropdown();

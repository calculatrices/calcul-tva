document.addEventListener('DOMContentLoaded', () => {
    const calculationTypeSelect = document.getElementById('calculation-type');
    const amountInput = document.getElementById('amount');
    const vatRateSelect = document.getElementById('vat-rate-select');
    const customVatRateGroup = document.getElementById('custom-vat-rate-group');
    const customVatRateInput = document.getElementById('custom-vat-rate');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultsDiv = document.getElementById('results');
    const netAmountSpan = document.getElementById('net-amount');
    const vatAmountSpan = document.getElementById('vat-amount');
    const grossAmountSpan = document.getElementById('gross-amount');
    const errorMessageDiv = document.getElementById('error-message');

    vatRateSelect.addEventListener('change', () => {
        if (vatRateSelect.value === 'custom') {
            customVatRateGroup.style.display = 'flex';
            customVatRateInput.focus();
        } else {
            customVatRateGroup.style.display = 'none';
        }
    });

    calculateBtn.addEventListener('click', calculateVat);
    clearBtn.addEventListener('click', clearForm);
    amountInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            calculateVat();
        }
    });
     customVatRateInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            calculateVat();
        }
    });


    function displayError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
    }

    function clearError() {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
    }

    function calculateVat() {
        clearError();
        const calculationType = calculationTypeSelect.value;
        const amount = parseFloat(amountInput.value);
        let vatRate;

        if (vatRateSelect.value === 'custom') {
            vatRate = parseFloat(customVatRateInput.value);
            if (isNaN(vatRate) || vatRate < 0) {
                displayError('Veuillez entrer un taux de TVA personnalisé valide.');
                return;
            }
        } else {
            vatRate = parseFloat(vatRateSelect.value);
        }

        if (isNaN(amount) || amount < 0) {
            displayError('Veuillez entrer un montant valide.');
            return;
        }
        if (isNaN(vatRate)) { // Should not happen with select but good practice
            displayError('Veuillez sélectionner un taux de TVA valide.');
            return;
        }

        let netAmount, vatAmountValue, grossAmount;
        const rateAsDecimal = vatRate / 100;

        if (calculationType === 'net') { // Calculate from Net Amount
            netAmount = amount;
            vatAmountValue = netAmount * rateAsDecimal;
            grossAmount = netAmount + vatAmountValue;
        } else { // Calculate from Gross Amount (calculationType === 'gross')
            grossAmount = amount;
            netAmount = grossAmount / (1 + rateAsDecimal);
            vatAmountValue = grossAmount - netAmount;
        }

        netAmountSpan.textContent = netAmount.toFixed(2);
        vatAmountSpan.textContent = vatAmountValue.toFixed(2);
        grossAmountSpan.textContent = grossAmount.toFixed(2);
        resultsDiv.style.display = 'block';
    }

    function clearForm() {
        amountInput.value = '';
        vatRateSelect.value = '20'; // Reset to default
        customVatRateInput.value = '';
        customVatRateGroup.style.display = 'none';
        resultsDiv.style.display = 'none';
        netAmountSpan.textContent = '';
        vatAmountSpan.textContent = '';
        grossAmountSpan.textContent = '';
        calculationTypeSelect.value = 'net';
        amountInput.focus();
        clearError();
    }
});


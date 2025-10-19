document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('login-message');

    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');

    const welcomeUsernameHeader = document.getElementById('welcome-username');
    const dashboardUsernameSpan = document.getElementById('dashboard-username');
    const logoutBtn = document.getElementById('logout-btn');

    const accountBalanceSpan = document.getElementById('account-balance');
    const amountInput = document.getElementById('amount');
    const depositBtn = document.getElementById('deposit-btn');
    const withdrawBtn = document.getElementById('withdraw-btn');
    const transactionMessage = document.getElementById('transaction-message');
    const transactionList = document.getElementById('transaction-list');

    let currentUser = null; // Store logged-in user's name
    let account = {
        balance: 0.00, // Start at 0 for a fresh login based on Image 2
        transactions: []
    };

    function updateDisplay() {
        accountBalanceSpan.textContent = account.balance.toFixed(2);
        renderTransactions();
        if (currentUser) {
            welcomeUsernameHeader.textContent = currentUser;
            dashboardUsernameSpan.textContent = currentUser;
            logoutBtn.classList.remove('hidden');
        } else {
            welcomeUsernameHeader.textContent = 'Guest';
            logoutBtn.classList.add('hidden');
        }
    }

    function renderTransactions() {
        transactionList.innerHTML = ''; // Clear previous transactions
        if (account.transactions.length === 0) {
            const row = transactionList.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 4;
            cell.textContent = 'No transactions yet.';
            cell.style.textAlign = 'center';
            cell.style.padding = '20px';
            cell.style.color = 'var(--text-light)';
            return;
        }

        // Render in reverse order to show latest first
        [...account.transactions].reverse().forEach(tx => {
            const row = transactionList.insertRow();
            const typeCell = row.insertCell(0);
            const amountCell = row.insertCell(1);
            const dateCell = row.insertCell(2);
            const balanceAfterCell = row.insertCell(3);

            typeCell.textContent = tx.type;
            typeCell.classList.add(tx.type === 'Deposit' ? 'type-deposit' : 'type-withdraw');
            amountCell.textContent = `$${tx.amount.toFixed(2)}`;
            dateCell.textContent = tx.date;
            balanceAfterCell.textContent = `$${tx.balanceAfter.toFixed(2)}`;
        });
    }

    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = `message ${type}`;
        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 3000);
    }

    // --- Event Listeners ---

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Simple validation (mimics Java logic - NOT SECURE for real banking!)
        if (username === 'shivam' && password === 'password123') { // Example credentials
            currentUser = username;
            account.balance = 0.00; // Reset balance on login as per Image 2
            account.transactions = []; // Clear transactions
            authSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            updateDisplay();
            showMessage(loginMessage, 'Login successful!', 'success');
        } else {
            showMessage(loginMessage, 'Invalid username or password.', 'error');
        }
        passwordInput.value = ''; // Clear password field
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        account.balance = 0.00;
        account.transactions = [];
        dashboardSection.classList.add('hidden');
        authSection.classList.remove('hidden');
        usernameInput.value = '';
        updateDisplay();
        showMessage(loginMessage, 'Logged out successfully!', 'success');
    });


    depositBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            showMessage(transactionMessage, 'Please enter a valid positive amount.', 'error');
            return;
        }

        account.balance += amount;
        const newTx = {
            type: 'Deposit',
            amount: amount,
            date: new Date().toLocaleDateString('en-US'),
            balanceAfter: account.balance
        };
        account.transactions.push(newTx);
        updateDisplay();
        showMessage(transactionMessage, `Successfully deposited $${amount.toFixed(2)}.`, 'success');
        amountInput.value = '';
    });

    withdrawBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            showMessage(transactionMessage, 'Please enter a valid positive amount.', 'error');
            return;
        }

        if (account.balance - amount < 0) {
            showMessage(transactionMessage, 'Insufficient funds.', 'error');
        } else {
            account.balance -= amount;
            const newTx = {
                type: 'Withdraw',
                amount: amount,
                date: new Date().toLocaleDateString('en-US'),
                balanceAfter: account.balance
            };
            account.transactions.push(newTx);
            updateDisplay();
            showMessage(transactionMessage, `Successfully withdrew $${amount.toFixed(2)}.`, 'success');
            amountInput.value = '';
        }
    });

    // Initial display setup (always start at login)
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    updateDisplay(); // Ensures header user info is 'Guest' initially
});
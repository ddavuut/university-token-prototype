// Simple in-memory data for prototype

const demoStudents = [
    { id: "S001", name: "Student 1", balance: 120 },
    { id: "S002", name: "Student 2", balance: 80 },
    { id: "S003", name: "Student 3", balance: 45 }
];

let adminLogEntries = [];
let walletTransactions = [];

// Helper: format timestamp
function nowShort() {
    const d = new Date();
    return d.toLocaleTimeString();
}

/* ------------------ ADMIN DASHBOARD ------------------ */

function initAdminDashboard() {
    const tableBody = document.querySelector("#student-table tbody");
    const logList = document.getElementById("admin-log");
    if (!tableBody || !logList) return; // not on admin page

    function renderStudents() {
        tableBody.innerHTML = "";
        demoStudents.forEach((s, index) => {
            const tr = document.createElement("tr");

            const nameTd = document.createElement("td");
            nameTd.textContent = s.name;

            const idTd = document.createElement("td");
            idTd.textContent = s.id;

            const balanceTd = document.createElement("td");
            balanceTd.textContent = s.balance + " TOK";

            const actionsTd = document.createElement("td");
            const btn10 = document.createElement("button");
            btn10.textContent = "+10";
            btn10.className = "btn secondary";
            btn10.style.marginRight = "4px";
            btn10.addEventListener("click", () => assignTokens(index, 10));

            const btn50 = document.createElement("button");
            btn50.textContent = "+50";
            btn50.className = "btn primary";
            btn50.addEventListener("click", () => assignTokens(index, 50));

            actionsTd.appendChild(btn10);
            actionsTd.appendChild(btn50);

            tr.appendChild(nameTd);
            tr.appendChild(idTd);
            tr.appendChild(balanceTd);
            tr.appendChild(actionsTd);

            tableBody.appendChild(tr);
        });
    }

    function renderLog() {
        logList.innerHTML = "";
        adminLogEntries.slice().reverse().forEach(entry => {
            const li = document.createElement("li");
            li.textContent = entry;
            logList.appendChild(li);
        });
    }

    function assignTokens(studentIndex, amount) {
        const s = demoStudents[studentIndex];
        s.balance += amount;
        adminLogEntries.push(
            `[${nowShort()}] Assigned ${amount} TOK to ${s.name} (${s.id}).`
        );
        renderStudents();
        renderLog();
    }

    renderStudents();
    renderLog();
}

/* ------------------ STUDENT WALLET ------------------ */

function initStudentWallet() {
    const balanceEl = document.getElementById("wallet-balance");
    const txList = document.getElementById("tx-list");
    const sendSection = document.getElementById("send-section");
    const receiveSection = document.getElementById("receive-section");
    const btnSendToggle = document.getElementById("btn-send-toggle");
    const btnReceiveToggle = document.getElementById("btn-receive-toggle");
    const sendForm = document.getElementById("send-form");
    const btnSimReceive = document.getElementById("btn-simulate-receive");

    if (!balanceEl || !txList) return; // not on wallet page

    let balance = 120; // start value – in real app this would come from backend

    function renderBalance() {
        balanceEl.textContent = balance + " TOK";
    }

    function renderTransactions() {
        txList.innerHTML = "";
        walletTransactions.slice().reverse().forEach(tx => {
            const li = document.createElement("li");

            const left = document.createElement("span");
            left.textContent = `[${tx.time}] ${tx.description}`;

            const right = document.createElement("span");
            right.textContent = (tx.amount > 0 ? "+" : "") + tx.amount + " TOK";
            right.className =
                "tx-amount " + (tx.amount > 0 ? "plus" : "minus");

            li.appendChild(left);
            li.appendChild(right);
            txList.appendChild(li);
        });
    }

    // Initial dummy transactions
    walletTransactions.push(
        { time: nowShort(), description: "Initial reward from Lecturer", amount: 50 },
        { time: nowShort(), description: "Cafeteria payment", amount: -20 }
    );

    // Toggle sections
    btnSendToggle.addEventListener("click", () => {
        sendSection.classList.toggle("hidden");
        receiveSection.classList.add("hidden");
    });

    btnReceiveToggle.addEventListener("click", () => {
        receiveSection.classList.toggle("hidden");
        sendSection.classList.add("hidden");
    });

    // Handle sending
    sendForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const recipient = document.getElementById("send-recipient").value.trim();
        const amount = Number(document.getElementById("send-amount").value);

        if (!recipient || !amount || amount <= 0) {
            alert("Please enter a valid recipient and amount.");
            return;
        }
        if (amount > balance) {
            alert("Not enough tokens.");
            return;
        }

        balance -= amount;
        walletTransactions.push({
            time: nowShort(),
            description: "Sent to " + recipient,
            amount: -amount
        });

        renderBalance();
        renderTransactions();
    });

    // Simulate receiving tokens (QR)
    btnSimReceive.addEventListener("click", () => {
        const amount = 20;
        balance += amount;
        walletTransactions.push({
            time: nowShort(),
            description: "Received via QR payment",
            amount
        });
        renderBalance();
        renderTransactions();
    });

    renderBalance();
    renderTransactions();
}

/* ------------------ ENTRY POINT ------------------ */

document.addEventListener("DOMContentLoaded", () => {
    initAdminDashboard();
    initStudentWallet();
});

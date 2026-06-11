
/* =========================================
   7. CANCELLATION & REFUNDS
   ========================================= */

window.searchPNR = function () {
    const input = document.getElementById('cancel-pnr-input').value;
    if (!input || input.length < 5) {
        alert("Please enter a valid PNR Number.");
        return;
    }

    // UX: Show searching state
    const btn = document.querySelector('#cancel-section button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Searching...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;

        // Mock Data or State Data
        const data = {
            train: "12951 - Rajdhani Express",
            date: "14 Feb, 2026",
            pnr: input,
            passengers: [
                { name: "Rahul Sharma", age: 28, seat: "CNF/B1/45" },
                { name: "Guest User", age: 30, seat: "CNF/B1/46" }
            ]
        };

        // Enhance with Real State if available and relevant
        if (state.booking.train && state.booking.seats && state.booking.seats.length > 0) {
            data.train = state.booking.train;
            data.date = state.booking.date || "14 Feb, 2026";
            data.passengers = state.booking.seats.map((s, i) => ({
                name: `Passenger ${i + 1}`,
                age: 28, // Dummy
                seat: `CNF/B1/${s}`
            }));
        }

        // Render Details
        document.getElementById('c-train-name').textContent = data.train;
        document.getElementById('c-date').textContent = data.date;
        document.getElementById('c-pnr-display').textContent = data.pnr;

        const list = document.getElementById('c-passenger-list');
        list.innerHTML = '';

        data.passengers.forEach((p, idx) => {
            const html = `
                <div class="passenger-cancel-item" style="padding:15px; background:white; border:1px solid #eee; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <input type="checkbox" class="cancel-check" checked onchange="window.updateRefundCalc()" style="width:20px; height:20px; cursor:pointer;">
                        <div>
                            <div style="font-weight:700; font-size:1rem;">${p.name}</div>
                            <div style="font-size:0.85rem; color:#666;">Age: ${p.age} • Seat: <span style="color:var(--success-green); font-weight:700;">${p.seat}</span></div>
                        </div>
                    </div>
                </div>`;
            list.innerHTML += html;
        });

        document.getElementById('cancel-details').classList.remove('hidden');
        document.getElementById('cancel-success').classList.add('hidden');

        // Initial Calc
        window.updateRefundCalc();

    }, 1500); // Simulate network delay
};

window.updateRefundCalc = function () {
    const checkedCount = document.querySelectorAll('.cancel-check:checked').length;
    // Logic: Ticket Price (1250) - Cancellation Charge (120 for AC)
    const refundPerTicket = 1250 - 120;
    const totalRefund = checkedCount * refundPerTicket;

    document.getElementById('c-refund-amount').textContent = totalRefund > 0 ? totalRefund.toLocaleString() : 0;

    const btn = document.querySelector('#cancel-details button.btn-primary');
    if (checkedCount === 0) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    } else {
        btn.disabled = false;
        btn.style.opacity = '1';
    }
};

window.confirmCancellation = function () {
    const amount = document.getElementById('c-refund-amount').textContent;
    const checkedCount = document.querySelectorAll('.cancel-check:checked').length;

    if (checkedCount === 0) return;

    if (!confirm(`Are you sure you want to cancel ${checkedCount} passenger(s)? Refund of ₹${amount} will be initiated.`)) {
        return;
    }

    // Show Success
    document.getElementById('cancel-details').classList.add('hidden');
    document.getElementById('cancel-success').classList.remove('hidden');

    document.getElementById('final-refund').textContent = amount;

    // Random Ref ID
    const refId = "IRCTC" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    document.getElementById('ref-id').textContent = refId;
};

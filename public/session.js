// session.js – Idle logout with centered popup – only buttons reset the timer
(function() {
    // ----- Configuration -----
    const IDLE_TIME = 30000;      // 30 seconds idle before popup appears
    const WARNING_TIME = 30000;    // 30 seconds popup countdown

    // ----- State -----
    let idleTimer = null;
    let countdownTimer = null;
    let popupVisible = false;
    let popupElement = null;
    let countdownDisplay = null;

    // ----- Helper: logout -----
    function logout() {
        if (idleTimer) clearTimeout(idleTimer);
        if (countdownTimer) clearInterval(countdownTimer);
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('userCountry');
        window.location.href = 'index.html';
    }

    // ----- Create popup (once) -----
    function createPopup() {
        if (popupElement) return;

        popupElement = document.createElement('div');
        popupElement.id = 'idle-warning-popup';
        popupElement.innerHTML = `
            <div class="popup-content">
                <p>You've been inactive. Your session will expire soon.</p>
                <p id="countdown-display">Logging out in 30 seconds...</p>
                <div class="popup-buttons">
                    <button id="stay-loggedin-btn">Stay logged in</button>
                    <button id="logout-now-btn">Logout now</button>
                </div>
            </div>
        `;
        popupElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 20px 24px;
            z-index: 10000;
            font-family: 'DM Sans', sans-serif;
            width: 320px;
            text-align: center;
            display: none;
        `;
        // Optional: style buttons
        const style = document.createElement('style');
        style.textContent = `
            #idle-warning-popup .popup-buttons { margin-top: 16px; display: flex; gap: 12px; justify-content: center; }
            #idle-warning-popup button { padding: 8px 16px; font-family: inherit; font-size: 14px; cursor: pointer; border-radius: 6px; border: 1px solid #ccc; background: #f0f0f0; }
            #idle-warning-popup button:hover { background: #e0e0e0; }
            #idle-warning-popup #stay-loggedin-btn { background: #111; color: white; border: none; }
            #idle-warning-popup #stay-loggedin-btn:hover { background: #333; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(popupElement);
        countdownDisplay = document.getElementById('countdown-display');

        // Button events
        document.getElementById('stay-loggedin-btn').addEventListener('click', () => {
            // Reset the timer and hide popup
            resetIdleTimer();
            hidePopup();
        });
        document.getElementById('logout-now-btn').addEventListener('click', logout);
    }

    // ----- Show popup with countdown -----
    function showPopup() {
        if (popupVisible) return;
        createPopup();
        popupVisible = true;
        popupElement.style.display = 'block';
        let secondsLeft = WARNING_TIME / 1000;
        countdownDisplay.textContent = `Logging out in ${secondsLeft} seconds...`;

        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = setInterval(() => {
            secondsLeft--;
            if (secondsLeft <= 0) {
                clearInterval(countdownTimer);
                logout();
            } else {
                countdownDisplay.textContent = `Logging out in ${secondsLeft} seconds...`;
            }
        }, 1000);
    }

    // ----- Hide popup and clean up -----
    function hidePopup() {
        if (!popupVisible) return;
        if (countdownTimer) clearInterval(countdownTimer);
        if (popupElement) popupElement.style.display = 'none';
        popupVisible = false;
    }

    // ----- Reset the idle timer (starts a new 5-minute period) -----
    function resetIdleTimer() {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            showPopup();
        }, IDLE_TIME);
    }

    // ----- Initialize on page load (skip payment page) -----
    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem('username')) {
            // Start the initial idle timer
            resetIdleTimer();
            // No activity listeners – mouse/keyboard do nothing
        }
    });
})();

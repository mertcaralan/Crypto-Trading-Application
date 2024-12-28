$(function () {
    let states = {};

    let storedData = localStorage.getItem("states");
    states = storedData ? JSON.parse(storedData) : { active: null, users: [] };

    function update(fns) {
        for (let fn of fns) fn();
        localStorage.setItem("states", JSON.stringify(states));
    }

    if (!Array.isArray(states.users)) {
        states.users = [];
    }

    $(".container").on("click",'.new_profile', function(event){
        renderNewProfilePopup();
        $('#new_user_input').focus();
    });

    $(".container").on("click",".user_container", function(event){
        if ($(event.target).hasClass("close_img")) {
            return;
        }
        const userName = $(this).data('name');
        const user = states.users.find(u => u.name === userName);

        if (user) {
            states.active = userName;
            localStorage.setItem("states", JSON.stringify(states));
            renderTradePage();
        }
    });

    $(".container").on("click","#logout_button", function(){
        states.active = null;
        localStorage.setItem("states", JSON.stringify(states));
        renderCreateUserPage();
    });

    function renderNewProfilePopup(){
        let out = `
        <div class="new_profile_container">
            <input type="text" id="new_user_input" placeholder="Enter the new profile name">
            <button type="button" class="btn add">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>
        `;

        $(".navbar").after(out);
    }
    function renderCreateUserPage(){
        let out = `<div class="navbar">
            <div class="logo_container">
                <span class="logo">CTIS</span>
                <span class="logo-name">Crypto Trading Information System</span>
            </div>
        </div>
        
        <section class="users">
        </section>

        <button type="button" class="btn new_profile">
            <span>+</span> New Profile
        </button>`;

        $(".container").html(out);

        states.users.forEach(user => {
            const userHTML = `
                <div class="user_container" data-name="${user.name}">
                    <img src="icons/close-ellipse-svgrepo-com.svg" class="close_img" alt="Close icon">
                    <img src="icons/user-icon-svgrepo-com.svg" alt="User icon">
                    <div class="username-box">${user.name}</div>
                </div>`;
            $('.users').append(userHTML);
        });
    }

    function renderTradePage(){
        let out = `
        <div class="navbar">
            <div class="logo_container">
                <span class="logo">CTIS</span>
                <span class="logo-name">Crypto Trading Information System</span>
            </div>
            <div class="right_nav">
                <div class="nav_user_container">
                    <img src="icons/user-icon-svgrepo-com.svg" alt="User icon">
                    <div class="username-box">${states.active}</div>
                </div>
                <div class="nav_user_container" id="logout_button">
                    <img src="icons/logout-svgrepo-com.svg" alt="Logout icon">
                    <div class="username-box">Logout</div>
                </div>
            </div>
        </div>
        
        <div class="trade_page">
            <h1>DAY 2</h1>
            <h3>02 January 2021</h3>
            <div class="buttons">
                <button type="button" class="play_btn">
                    <img src="icons/logout-svgrepo-com.svg" alt="User icon">
                    <div>
                        Next Day
                    </div>
                </button>

                <button type="button" class="play_btn">
                    <img src="icons/logout-svgrepo-com.svg" alt="User icon">
                    <div>
                        Play
                    </div>
                </button>

            </div>
            <div class="main_part">
                <div class="coins_part">
                    <img src="images/ada.png">
                    <img src="images/avax.png">
                    <img src="images/btc.png">
                    <img src="images/doge.png">
                    <img src="images/eth.png">
                    <img src="images/pol.png">
                    <img src="images/snx.png">
                    <img src="images/trx.png">
                    <img src="images/xrp.png">
                </div>
                <div class="selected_coin_part">
                    <img src="images/btc.png">
                    <div>
                        Bitcoin
                    </div>
                </div>
                <div class="graph_part">

                </div>
            </div>
            <div class="wallet_part">
                $1000.00
            </div>
            <div class="bottom_part">
                <div class="trading_part">
                    <div>Trading</div>
                    <div class="buy_sell_buttons">
                        <button type="button">
                            BUY
                        </button>
                        <button type="button">
                            SELL
                        </button>
                    </div>
                    <div class="amount_part">
                        <input type="text" name="amount_input" id="amount_input" placeholder="Amount">
                        <label for="amount_input">= $</label>
                    </div>
                    <button type="button">
                        BUY
                    </button>
                </div>
                <div class="detailed_wallet_part">
                    <div>Wallet</div>
                    <table>
                        <th>
                            <td>Coin</td>
                            <td>Amount</td>
                            <td>Subtotal</td>
                            <td>Last Close</td>
                        </th>
                        <tr>
                            <td>Dolar</td>
                            <td>$1000</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>`;

        $(".container").html(out);
    }

    $(".container").on("click",'.btn.add',function () {
        const newProfileName = $('#new_user_input').val().trim();

        if (newProfileName) {
            states.users.push({
                name: newProfileName,
                day: 2,
                selectedCoin: "Bitcoin",
                wallet: { cash: 1000, coins: [] },
            });

            const newUser = `
                <div class="user_container" data-name="${newProfileName}">
                    <img src="icons/close-ellipse-svgrepo-com.svg" class="close_img" alt="Close icon">
                    <img src="icons/user-icon-svgrepo-com.svg" alt="User icon">
                    <div class="username-box">${newProfileName}</div>
                </div>`;
            $('.users').prepend(newUser);

            localStorage.setItem("states", JSON.stringify(states));

            $('#new_user_input').val('');
            $('.new_profile_container').css("display","none");
        } else {
            alert('Please enter a profile name');
        }
    });

    $('body').on('click', '.close_img', function () {
        const userContainer = $(this).closest('.user_container');
        const userName = userContainer.data('name');

        states.users = states.users.filter(user => user.name !== userName);
        if (states.active === userName) {
            states.active = null;
        }
        localStorage.setItem("states", JSON.stringify(states));

        userContainer.remove();
        if (!states.active) {
            renderCreateUserPage();
        }
    });

    states.users.forEach(user => {
        const userHTML = `
            <div class="user_container" data-name="${user.name}">
                <img src="icons/close-ellipse-svgrepo-com.svg" class="close_img" alt="Close icon">
                <img src="icons/user-icon-svgrepo-com.svg" alt="User icon">
                <div class="username-box">${user.name}</div>
            </div>`;
        $('.users').append(userHTML);
    });

    if (states.active) {
        renderTradePage();
    } else {
        renderCreateUserPage();
    }
});

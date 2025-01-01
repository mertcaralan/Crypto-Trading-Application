$(function () {
    /****************************************************
   * 1) Global states + localStorage
   ****************************************************/
  const states = JSON.parse(localStorage.getItem("states")) || {
    active: null,   // Current active username
    users: [],      // List of all users
  };

  const saveStates = () => {
    localStorage.setItem("states", JSON.stringify(states));
  };

  /****************************************************
   * 2) Initial Load: Team Members or Trade Page?
   ****************************************************/
  states.active ? renderTradePage() : renderTeamMembersPage();

  /****************************************************
   * 3) Team Members Page
   ****************************************************/
  function renderTeamMembersPage() {
    const content = `
      <div class="navbar">
        <div class="logo_container">
          <span class="logo">CTIS</span>
          <span class="logo-name">Crypto Trading Information System</span>
        </div>
      </div>
      <section class="team_members">
        <h1>Team Members</h1>
        <ul>
          <li>Zeynep Günal</li>
          <li>Mert Çaralan</li>
        </ul>
        <button class="btn go_to_profiles">Go to Profiles</button>
      </section>
    `;
    $(".container").html(content);
  }

  $(".container").on("click", ".go_to_profiles", renderProfilesPage);

  /****************************************************
   * 4) Profiles Page (User Management)
   ****************************************************/
  function renderProfilesPage() {
    const content = `
      <div class="navbar">
        <div class="logo_container">
          <span class="logo">CTIS</span>
          <span class="logo-name">Crypto Trading Information System</span>
        </div>
      </div>
      <section class="users">
        ${states.users.length ? renderUserList(states.users) : '<div class="empty_text">EMPTY</div>'}
      </section>
      <button type="button" class="btn new_profile">
        <span>+</span> New Profile
      </button>
      <div class="new_profile_container" style="display:none;">
        <input type="text" id="new_user_input" placeholder="Enter new profile name">
        <button type="button" class="btn add">
          <i class="fas fa-plus"></i> Add
        </button>
      </div>
    `;
    $(".container").html(content);
  }

  function renderUserList(users) {
    return users
      .map(
        (user) => `
        <div class="user_container" data-name="${user.name}">
          <img src="icons/close-ellipse-svgrepo-com.svg" class="close_img" alt="Close icon">
          <img src="icons/user-icon-svgrepo-com.svg" alt="User icon">
          <div class="username-box">${user.name}</div>
        </div>`
      )
      .join("");
  }

  $(".container").on("click", ".new_profile", function () {
    $(".new_profile_container").show();
    $("#new_user_input").val("").focus();
  });

  $(".container").on("click", ".btn.add", function () {
    const newName = $("#new_user_input").val().trim();
    if (!newName) {
      alert("Please enter a profile name");
      return;
    }

    states.users.push({
      name: newName,
      day: 2,
      selectedCoin: "btc",
      wallet: {
        cash: 1000,
        coins: [],
      },
    });
    saveStates();
    renderProfilesPage();
  });
    
      // Profil kutusuna tıklayınca => aktif kullanıcı seç
  $(".container").on("click", ".user_container", function (e) {
    if ($(e.target).hasClass("close_img")) return; // Eğer X butonuna basıldıysa (kullanıcı silme) => durdur
    const username = $(this).data("name");
    states.active = username;
    saveStates();
    renderTradePage();
  });

  // Kullanıcı silme (X ikonu)
  $(".container").on("click", ".close_img", function (e) {
    e.stopPropagation();
    const userName = $(this).closest(".user_container").data("name");
    states.users = states.users.filter(user => user.name !== userName);

    if (states.active === userName) {
        states.active = null;
    }
    saveStates();
    renderProfilesPage();
  });

  /****************************************************
  * Trade Page (asıl al-sat ve grafik ekranı)
  ****************************************************/
  function renderTradePage() {
    const user = states.users.find(user => user.name === states.active);
    if (!user) return;

    const out = `
        <div class="navbar">
            <div class="logo_container">
                <span class="logo">CTIS</span>
                <span class="logo-name">Crypto Trading Information System</span>
            </div>
            <div class="right_nav">
                <div class="nav_user_container">
                    <img src="icons/user-icon-svgrepo-com.svg" alt="User icon">
                    <div class="username-box">${user.name}</div>
                </div>
                <div class="nav_user_container" id="logout_button">
                    <img src="icons/logout-svgrepo-com.svg" alt="Logout icon">
                    <div class="username-box">Logout</div>
                </div>
            </div>
        </div>

        <div class="trade_page">
            <h1>DAY ${user.day}</h1>
            <h3>${formatDayDate(user.day)}</h3>

            <div class="buttons">
                <button type="button" class="play_btn next_day_btn">
                    <img src="icons/arrow-right-svgrepo-com.svg" alt="Next icon">
                    <div>Next Day</div>
                </button>
                <button type="button" class="play_btn play_sim_btn" data-playing="false">
                    <img src="icons/play-svgrepo-com.svg" alt="Play icon">
                    <div>Play</div>
                </button>
            </div>

            <div class="main_part">
                <div class="coins_part">
                    ${coins.map(coin => `
                        <img src="${coin.image}" data-code="${coin.code}"
                            title="${coin.name}"
                            class="coin_icon ${coin.code === user.selectedCoin ? "coin_heartbeat" : ""}">
                    `).join("")}
                </div>

                <div class="selected_coin_part">
                    <img src="${coins.find(c => c.code === user.selectedCoin).image}" alt="coin">
                    <div>${coins.find(c => c.code === user.selectedCoin).name}</div>
                </div>

                <div class="graph_part">
                    <div class="candle_tooltip"></div>
                </div>
            </div>

            <div class="wallet_part">
                $${user.wallet.cash.toFixed(2)}
            </div>

            <div class="bottom_part">
                <div class="trading_part">
                    <h2>Trading</h2>
                    <div class="buy_sell_buttons">
                        <button type="button" class="buy_btn">BUY</button>
                        <button type="button" class="sell_btn">SELL</button>
                    </div>
                    <div class="amount_part">
                        <input type="text" id="amount_input" placeholder="Amount">
                        <label>= $</label>
                    </div>
                    <button type="button" class="trade_confirm_btn">CONFIRM</button>
                </div>

                <div class="detailed_wallet_part">
                    <h2>Wallet</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Coin</th>
                                <th>Amount</th>
                                <th>Subtotal</th>
                                <th>Last Close</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Dollar</td>
                                <td colspan="3">$${user.wallet.cash.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    $(".container").html(out);
    drawChart();
    fillWalletTable();
  }

  /****************************************************
  * Logout Butonu
  ****************************************************/
  $(".container").on("click", "#logout_button", function () {
    states.active = null;
    saveStates();
    renderProfilesPage();
  });

  /****************************************************
  * Coin seçimi
  ****************************************************/
  $(".container").on("click", ".coin_icon", function () {
    const code = $(this).data("code");
    const user = states.users.find(user => user.name === states.active);
    if (!user) return;

    user.selectedCoin = code;
    saveStates();
    renderTradePage();
  });

  /****************************************************
  * Next Day Butonu
  ****************************************************/
  $(".container").on("click", ".next_day_btn", function () {
    goNextDay();
  });

  function goNextDay() {
    const user = states.users.find(user => user.name === states.active);
    if (!user || user.day >= 365) return;

    user.day++;
    saveStates();

    if (user.day === 366) {
        endSimulation();
    } else {
        renderTradePage();
    }
  }

  /****************************************************
  * Simülasyon Bitişi
  ****************************************************/
  function endSimulation() {
    const user = states.users.find(user => user.name === states.active);
    if (!user) return;

    renderTradePage();
    $(".trading_part, .next_day_btn, .play_sim_btn").remove();
    $(".wallet_part").addClass("final_wallet_value");
  }

    
      /****************************************************
   * Play / Pause (Toggle Mantığı)
   ****************************************************/
  let playInterval = null;
  $(".container").on("click", ".play_sim_btn", function () {
      // O anki durum
      let isPlaying = $(this).data("playing") === true;

      if (isPlaying) {
          // Durdur
          clearInterval(playInterval);
          playInterval = null;
          $(this).find("img").attr("src", "icons/play-svgrepo-com.svg");
          $(this).find("div").text("Play");
          $(this).data("playing", false);
      } else {
          // Başlat
          $(this).find("img").attr("src", "icons/pause-button.svg");
          $(this).find("div").text("Pause");
          $(this).data("playing", true);

          playInterval = setInterval(() => {
              let user = states.users.find(u => u.name === states.active);
              if (!user) return;

              if (user.day >= 365) {
                  clearInterval(playInterval);
                  playInterval = null;
                  $(this).data("playing", false);
                  $(this).find("img").attr("src", "icons/play-svgrepo-com.svg");
                  $(this).find("div").text("Play");

                  endSimulation();
              } else {
                  goNextDay();
              }
          }, 100);
      }
  });

  /****************************************************
   * Grafiği Oluşturma (Candle)
   ****************************************************/
  function drawChart() {
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;

      let dayIndex = user.day - 1;
      if (dayIndex < 0) return;

      let startIndex = Math.max(0, dayIndex - 119);
      let relevantDays = market.slice(startIndex, dayIndex + 1);

      let priceArray = [];
      relevantDays.forEach(dayObj => {
          let cObj = dayObj.coins.find(cc => cc.code === user.selectedCoin);
          if (cObj) {
              priceArray.push(cObj.low, cObj.high);
          }
      });
      if (!priceArray.length) return;

      let minP = Math.min(...priceArray);
      let maxP = Math.max(...priceArray);

      let graph = $(".graph_part");
      let h = graph.height();
      let graphWidth = graph.width();

      let maxCandles = 120; 
      let candleWidth = Math.max(3, Math.floor((graphWidth - (maxCandles - 1) * 3) / maxCandles));
      let gap = 3;

      graph.find(".wick").remove();
      graph.find(".candle_body").remove();
      graph.find(".last_close_line").remove();
      graph.find(".last_close_label").remove();

      relevantDays.forEach((dObj, i) => {
          let coinObj = dObj.coins.find(cc => cc.code === user.selectedCoin);
          if (!coinObj) return;

          let x = i * (candleWidth + gap);

          let range = maxP - minP;
          let scaleY = val => h - ((val - minP) / range) * h;

          let topY = scaleY(coinObj.high);
          let bottomY = scaleY(coinObj.low);
          let openY = scaleY(coinObj.open);
          let closeY = scaleY(coinObj.close);

          let bodyTop = Math.min(openY, closeY);
          let bodyHeight = Math.abs(openY - closeY);

          let isRed = coinObj.close < coinObj.open;
          let colorClass = isRed ? "red" : "green";

          let wickDiv = $(`
              <div class="wick"
                  style="left: ${x + candleWidth / 2}px; top: ${topY}px; height: ${bottomY - topY}px;">
              </div>
          `);

          let candleBodyDiv = $(`
              <div class="candle_body ${colorClass}"
                  style="left: ${x}px; top: ${bodyTop}px; width: ${candleWidth}px; height: ${bodyHeight}px;">
              </div>
          `);

          graph.append(wickDiv, candleBodyDiv);
      });

      let lastCoinObj = relevantDays[relevantDays.length - 1]
          .coins.find(cc => cc.code === user.selectedCoin);

      if (lastCoinObj) {
          let closeY = h - ((lastCoinObj.close - minP) / (maxP - minP)) * h;

          graph.append(`
              <div class="last_close_line" style="top:${closeY}px;"></div>
          `);

          let labelLeft = graphWidth - 60; 
          graph.append(`
              <div class="last_close_label"
                  style="top:${closeY - 10}px; left:${labelLeft}px;">
                $${lastCoinObj.close.toFixed(2)}
              </div>
          `);
      }
  }     
      // Candle hover => tooltip
  $(".container").on("mousemove", ".candle", function (e) {
    const dayIdx = $(this).data("day-idx");
    const user = states.users.find(u => u.name === states.active);
    if (!user) return;

    const dayData = market[dayIdx];
    const coinData = dayData?.coins.find(cc => cc.code === user.selectedCoin);
    if (!coinData) return;

    const coinName = coins.find(c => c.code === user.selectedCoin)?.name || user.selectedCoin;
    const tooltip = $(".candle_tooltip");
    tooltip.html(`
        <b>${coinName}</b><br/>
        O: ${coinData.open}<br/>
        C: ${coinData.close}<br/>
        L: ${coinData.low}<br/>
        H: ${coinData.high}
    `);

    const offset = $(".graph_part").offset();
    tooltip.css({ 
        left: `${e.pageX - offset.left + 10}px`, 
        top: `${e.pageY - offset.top + 10}px`, 
        display: "block" 
    });
  });

  $(".container").on("mouseleave", ".candle", function () {
    $(".candle_tooltip").hide();
  });

  /****************************************************
  * Trade Actions: Buy and Sell
  ****************************************************/
  let currentTradeType = "BUY";

  $(".container").on("click", ".buy_btn", function () {
    currentTradeType = "BUY";
    $(this).css("background-color", "green");
    $(".sell_btn").css("background-color", "white");

    const user = states.users.find(u => u.name === states.active);
    if (!user) return;

    $(".trade_confirm_btn").text(`BUY ${user.selectedCoin}`).css("background-color", "green");
  });

  $(".container").on("click", ".sell_btn", function () {
    currentTradeType = "SELL";
    $(this).css("background-color", "red");
    $(".buy_btn").css("background-color", "black");

    const user = states.users.find(u => u.name === states.active);
    if (!user) return;

    $(".trade_confirm_btn").text(`SELL ${user.selectedCoin}`).css("background-color", "red");
  });

  $(".container").on("click", ".trade_confirm_btn", function () {
    const amtStr = $("#amount_input").val().trim();
    const amt = parseFloat(amtStr);
    if (isNaN(amt) || amt <= 0) {
        alert("Invalid amount");
        return;
    }

    const user = states.users.find(u => u.name === states.active);
    if (!user) return;

    const dayData = market[user.day - 1];
    const coinObj = dayData?.coins.find(cc => cc.code === user.selectedCoin);
    if (!coinObj) {
        alert("Coin data not found for today");
        return;
    }

    const price = coinObj.close;

    if (currentTradeType === "BUY") {
        const cost = amt * price;
        if (cost > user.wallet.cash) {
            alert("Not enough cash!");
            return;
        }
        user.wallet.cash -= cost;
        const found = user.wallet.coins.find(c => c.code === user.selectedCoin);
        if (!found) {
            user.wallet.coins.push({ code: user.selectedCoin, amount: amt });
        } else {
            found.amount += amt;
        }
    } else {
        const found = user.wallet.coins.find(c => c.code === user.selectedCoin);
        if (!found || found.amount < amt) {
            alert("Not enough coins to sell!");
            return;
        }
        found.amount -= amt;
        const income = amt * price;
        user.wallet.cash += income;
        if (found.amount <= 0) {
            user.wallet.coins = user.wallet.coins.filter(c => c.code !== user.selectedCoin);
        }
    }

    saveStates();
    renderTradePage();
  });

  /****************************************************
  * Populate Wallet Table
  ****************************************************/
  function fillWalletTable() {
    const user = states.users.find(u => u.name === states.active);
    if (!user) return;

    const dayData = market[user.day - 1];
    const tbody = $(".detailed_wallet_part table tbody");

    tbody.find("tr:gt(0)").remove();

    user.wallet.coins.forEach(wcoin => {
        const cInfo = coins.find(c => c.code === wcoin.code);
        const cName = cInfo ? cInfo.name : wcoin.code;
        const cData = dayData?.coins.find(cd => cd.code === wcoin.code);
        const lastClose = cData ? cData.close : 0;
        const subtotal = wcoin.amount * lastClose;

        const row = `
            <tr>
                <td>${cName}</td>
                <td>${wcoin.amount.toFixed(6)}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>$${lastClose}</td>
            </tr>
        `;
        tbody.append(row);
    });

    const sumCoins = user.wallet.coins.reduce((sum, wc) => {
        const cData = dayData?.coins.find(cd => cd.code === wc.code);
        return cData ? sum + wc.amount * cData.close : sum;
    }, 0);

    const totalVal = user.wallet.cash + sumCoins;
    $(".wallet_part").text(`$${totalVal.toFixed(2)}`);
  }

  /****************************************************
  * Format Date
  ****************************************************/
  function formatDayDate(dayNum) {
    const index = dayNum - 1;
    if (index < 0 || index >= market.length) return "???";

    const rawDate = market[index].date;
    const [dd, mm, yyyy] = rawDate.split("-");

    const monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];

    const monIndex = parseInt(mm, 10) - 1;
    return `${dd} ${monthNames[monIndex]} ${yyyy}`;
  }

});
  
$(function () {
    /****************************************************
     * 1) Global states + localStorage
     ****************************************************/
    let states = JSON.parse(localStorage.getItem("states")) || {
      active: null,   // Şu anki aktif kullanıcı adı
      users: [],      // Tüm kullanıcılar listesi
    };
  
    // States güncellenince localStorage'a kaydeden yardımcı fonksiyon
    function saveStates() {
      localStorage.setItem("states", JSON.stringify(states));
    }
  
    /****************************************************
     * 2) İlk açılış: Team Members mı, yoksa Trade Page mi?
     ****************************************************/
    if (!states.active) {
      // Hiç aktif kullanıcı yoksa => Team Members sayfası
      renderTeamMembersPage();
    } else {
      // Bir aktif kullanıcı varsa => direkt Trade Page
      renderTradePage();
    }
  
    /****************************************************
     * 3) Team Members Page
     ****************************************************/
    function renderTeamMembersPage() {
      // container'ı tamamen yeni HTML ile dolduruyoruz
      let out = `
        <div class="navbar">
          <div class="logo_container">
            <span class="logo">CTIS</span>
            <span class="logo-name">Crypto Trading Information System</span>
          </div>
        </div>
        <section class="team_members">
          <h1>Team Members</h1>
          <ul>
            <li>Student 1: Name Surname</li>
            <li>Student 2: Name Surname</li>
            <li>Student 3: Name Surname</li>
            <li>Student 4: Name Surname</li>
          </ul>
          <button class="btn go_to_profiles">Go to Profiles</button>
        </section>
      `;
      $(".container").html(out);
    }
  
    // "Go to Profiles" butonuna basılınca
    $(".container").on("click", ".go_to_profiles", function () {
      renderProfilesPage();
    });
  
    /****************************************************
     * 4) Profiles Page (kullanıcı yönetimi)
     ****************************************************/
    function renderProfilesPage() {
      // Profil sayfasının HTML'ini yaz
      let out = `
        <div class="navbar">
          <div class="logo_container">
            <span class="logo">CTIS</span>
            <span class="logo-name">Crypto Trading Information System</span>
          </div>
        </div>
  
        <section class="users"></section>
  
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
  
      $(".container").html(out);
  
      // Mevcut kullanıcıları ekranda göster
      let $usersSection = $(".users");
      states.users.forEach((user) => {
        $usersSection.append(`
          <div class="user_container" data-name="${user.name}">
            <img src="icons/close-ellipse-svgrepo-com.svg" class="close_img" alt="Close icon">
            <img src="icons/user-icon-svgrepo-com.svg" alt="User icon">
            <div class="username-box">${user.name}</div>
          </div>
        `);
      });
    }
  
    // "+ New Profile" butonuna tıklanınca popup'ı aç
    $(".container").on("click", ".new_profile", function () {
      $(".new_profile_container").show();
      $("#new_user_input").val("").focus();
    });
  
    // Yeni profil ekleme
    $(".container").on("click", ".btn.add", function () {
      let newName = $("#new_user_input").val().trim();
      if (!newName) {
        alert("Please enter a profile name");
        return;
      }
      // Kullanıcı ekle
      states.users.push({
        name: newName,
        day: 2,
        selectedCoin: "btc",
        wallet: {
          cash: 1000,
          coins: []
        }
      });
      saveStates();
  
      // Tekrar render
      renderProfilesPage();
    });
  
    // Profil kutusuna tıklayınca => aktif kullanıcı seç
    $(".container").on("click", ".user_container", function (e) {
      // Eğer X butonuna basıldıysa (kullanıcı silme) => durdur
      if ($(e.target).hasClass("close_img")) return;
      let username = $(this).data("name");
      states.active = username;
      saveStates();
      renderTradePage();
    });
  
    // Kullanıcı silme (X ikonu)
    $(".container").on("click", ".close_img", function (e) {
      e.stopPropagation(); 
      let userName = $(this).closest(".user_container").data("name");
      // Sil
      states.users = states.users.filter(u => u.name !== userName);
      if (states.active === userName) {
        states.active = null;
      }
      saveStates();
      renderProfilesPage();
    });
  
    /****************************************************
     * 5) Trade Page (asıl al-sat ve grafik ekranı)
     ****************************************************/
    function renderTradePage() {
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;
  
      let out = `
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
            <!-- Coin icons -->
            <div class="coins_part">
              ${coins.map(c => `
                <img src="${c.image}" data-code="${c.code}"
                     title="${c.name}"
                     class="coin_icon ${c.code === user.selectedCoin ? "selected_coin_anim":""}">
              `).join("")}
            </div>
  
            <!-- Seçili coin gösterimi -->
            <div class="selected_coin_part">
              <img src="${coins.find(cc => cc.code === user.selectedCoin).image}" alt="coin">
              <div>${coins.find(cc => cc.code === user.selectedCoin).name}</div>
            </div>
  
            <!-- Grafik alanı -->
            <div class="graph_part">
              <div class="candle_tooltip"></div>
            </div>
          </div>
  
          <!-- Bakiye -->
          <div class="wallet_part">
            $${user.wallet.cash.toFixed(2)}
          </div>
  
          <!-- Alt kısım: Trading ve Detailed Wallet -->
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
  
      // Render sonrası ek fonksiyonları çağır
      drawChart();
      fillWalletTable();
    }
  
    /****************************************************
     * 6) Logout Butonu
     ****************************************************/
    $(".container").on("click", "#logout_button", function () {
      states.active = null;
      saveStates();
      renderProfilesPage();  // Profil sayfasına geri dön
    });
  
    /****************************************************
     * 7) Coin seçimi
     ****************************************************/
    $(".container").on("click", ".coin_icon", function () {
      let code = $(this).data("code");
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;
      user.selectedCoin = code;
      saveStates();
      renderTradePage();
    });
  
    /****************************************************
     * 8) Next Day Butonu
     ****************************************************/
    $(".container").on("click", ".next_day_btn", function () {
      goNextDay();
    });
  
    function goNextDay() {
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;
      if (user.day >= 365) return;   // max 365
  
      user.day++;
      saveStates();
  
      if (user.day === 366) {
        // 365'ten sonraki gün => bitir
        endSimulation();
      } else {
        renderTradePage();
      }
    }
  
    /****************************************************
     * 9) Simülasyon Bitişi
     ****************************************************/
    function endSimulation() {
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;
      renderTradePage();
  
      // Trade arayüzünü kapat
      $(".trading_part").remove();
      $(".next_day_btn").remove();
      $(".play_sim_btn").remove();
  
      // Cüzdan değeri animasyonlu
      $(".wallet_part").addClass("final_wallet_value");
    }
  
    /****************************************************
     * Play / Pause (Toggle Mantığı)
     ****************************************************/
    let playInterval = null;

    // .play_sim_btn butonu tıklanınca
    $(".container").on("click", ".play_sim_btn", function () {
        // Butonun o anki durumunu al
        let isPlaying = $(this).data("playing") === true;
      
        if (isPlaying) {
          // Durma işi
          clearInterval(playInterval);
          playInterval = null;
          $(this).find("img").attr("src", "icons/play-svgrepo-com.svg");
          $(this).find("div").text("Play");
          $(this).data("playing", false);    
        } else {
          // Başlama işi
          $(this).find("img").attr("src", "icons/pause-button.svg");
          $(this).find("div").text("Pause");
          $(this).data("playing", true);
      
          playInterval = setInterval(() => {
            let user = states.users.find(u => u.name === states.active);
            if (!user) return;
      
            if (user.day >= 365) {
              clearInterval(playInterval);
              playInterval = null;
              // Butonu tekrar “Play”e döndür
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
     * 11) Grafiği oluşturma (Candle)
     ****************************************************/
    function drawChart() {
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;
      
      let dayIndex = user.day - 1;
      if (dayIndex < 0) return;
  
      // Son 120 günü al
      let startIndex = Math.max(0, dayIndex - 119);
      let relevantDays = market.slice(startIndex, dayIndex + 1);
  
      // Seçilen coin’in min-max fiyatlarını bul
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
  
      // Önceki candle'ları temizle
      graph.find(".candle").remove();
      graph.find(".last_close_line").remove();
  
      // Candle çiz
      let candleWidth = 5;
      let gap = 3;
      relevantDays.forEach((dObj, i) => {
        let coinObj = dObj.coins.find(cc => cc.code === user.selectedCoin);
        if (!coinObj) return;
  
        let x = i * (candleWidth + gap) + 10;
        let range = maxP - minP;
        let scaleY = (val) => h - ((val - minP) / range) * h;
  
        let topY = scaleY(coinObj.high);
        let bottomY = scaleY(coinObj.low);
        let redOrNot = (coinObj.close < coinObj.open) ? "red" : "";
  
        let candleDiv = $(`
          <div class="candle ${redOrNot}"
               data-day-idx="${startIndex + i}"
               style="left:${x}px; top:${topY}px; height:${bottomY - topY}px;">
          </div>
        `);
        graph.append(candleDiv);
      });
  
      // Last close çizgisi
      let lastCoinObj = relevantDays[relevantDays.length - 1]
        .coins.find(cc => cc.code === user.selectedCoin);
      if (lastCoinObj) {
        let scaleY = (val) => h - ((val - minP) / (maxP - minP)) * h;
        let closeY = scaleY(lastCoinObj.close);
        graph.append(`
          <div class="last_close_line" style="top:${closeY}px;"></div>
        `);
      }
    }
  
    // Candle hover => tooltip
    $(".container").on("mousemove", ".candle", function (e) {
      let dayIdx = $(this).data("day-idx");
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;
  
      let dayData = market[dayIdx];
      let coinData = dayData?.coins.find(cc => cc.code === user.selectedCoin);
      if (!coinData) return;
  
      let coinName = coins.find(c => c.code === user.selectedCoin)?.name || user.selectedCoin;
      let tooltip = $(".candle_tooltip");
      tooltip.html(`
        <b>${coinName}</b><br/>
        O: ${coinData.open}<br/>
        C: ${coinData.close}<br/>
        L: ${coinData.low}<br/>
        H: ${coinData.high}
      `);
  
      let offset = $(".graph_part").offset();
      let mouseX = e.pageX - offset.left + 10;
      let mouseY = e.pageY - offset.top + 10;
      tooltip.css({ left: mouseX + "px", top: mouseY + "px", display: "block" });
    });
    $(".container").on("mouseleave", ".candle", function () {
      $(".candle_tooltip").hide();
    });
  
    /****************************************************
     * 12) Al-Sat (Trading) İşlemleri
     ****************************************************/
    let currentTradeType = "BUY";
    
    $(".container").on("click", ".buy_btn", function () {
      currentTradeType = "BUY";
      $(".buy_btn").css("background-color","green");
      $(".sell_btn").css("background-color","white");
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;
      $(".trade_confirm_btn").text(`BUY ${user.selectedCoin}`).css("background-color","green");
      // Sadece renk vs. değiştiriyorsanız burada yapabilirsiniz
    });
    $(".container").on("click", ".sell_btn", function () {
      currentTradeType = "SELL";
      $(".sell_btn").css("background-color","red");
        $(".buy_btn").css("background-color","black");
        let user = states.users.find(u => u.name === states.active);
        if (!user) return;
        $(".trade_confirm_btn").text(`SELL ${user.selectedCoin}`).css("background-color","red");
      // Aynı şekilde SELL için renk ayarları
    });


    // Confirm butonu
    $(".container").on("click", ".trade_confirm_btn", function () {
      let amtStr = $("#amount_input").val().trim();
      let amt = parseFloat(amtStr);
      if (isNaN(amt) || amt <= 0) {
        alert("Invalid amount");
        return;
      }
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;
  
      // Son kapanış fiyatını al
      let dayData = market[user.day - 1];
      let coinObj = dayData?.coins.find(cc => cc.code === user.selectedCoin);
      if (!coinObj) {
        alert("Coin data not found for today");
        return;
      }
      let price = coinObj.close;
  
      if (currentTradeType === "BUY") {
        
        let cost = amt * price;
        if (cost > user.wallet.cash) {
          alert("Not enough cash!");
          return;
        }
        user.wallet.cash -= cost;
        let found = user.wallet.coins.find(c => c.code === user.selectedCoin);
        if (!found) {
          user.wallet.coins.push({ code: user.selectedCoin, amount: amt });
        } else {
          found.amount += amt;
        }
      } else {
        // SELL
        
        let found = user.wallet.coins.find(c => c.code === user.selectedCoin);
        if (!found || found.amount < amt) {
          alert("Not enough coins to sell!");
          return;
        }
        found.amount -= amt;
        let income = amt * price;
        user.wallet.cash += income;
        if (found.amount <= 0) {
          user.wallet.coins = user.wallet.coins.filter(c => c.code !== user.selectedCoin);
        }
      }
  
      saveStates();
      renderTradePage();
    });
  
    // Cüzdan tablosunu doldur
    function fillWalletTable() {
      let user = states.users.find(u => u.name === states.active);
      if (!user) return;
  
      let dayData2 = market[user.day - 1];
      let tbody = $(".detailed_wallet_part table tbody");
  
      // Dollar satırından sonrasını temizle
      tbody.find("tr:gt(0)").remove();
  
      user.wallet.coins.forEach((wcoin) => {
        let cInfo = coins.find(c => c.code === wcoin.code);
        let cName = cInfo ? cInfo.name : wcoin.code;
        let cData = dayData2?.coins.find(cd => cd.code === wcoin.code);
        let lastClose = cData ? cData.close : 0;
        let subtotal = wcoin.amount * lastClose;
        let row = `
          <tr>
            <td>${cName}</td>
            <td>${wcoin.amount.toFixed(6)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>$${lastClose}</td>
          </tr>
        `;
        tbody.append(row);
      });
  
      // Toplam cüzdan değeri
      let sumCoins = 0;
      user.wallet.coins.forEach((wc) => {
        let cData = dayData2?.coins.find(cd => cd.code === wc.code);
        if (cData) {
          sumCoins += wc.amount * cData.close;
        }
      });
      let totalVal = user.wallet.cash + sumCoins;
      $(".wallet_part").text(`$${totalVal.toFixed(2)}`);
    }
  
    /****************************************************
     * 13) Tarih Formatlama
     ****************************************************/
    function formatDayDate(dayNum) {
      let index = dayNum - 1;
      if (index < 0 || index >= market.length) return "???";
      let rawDate = market[index].date; // "02-01-2021"
      let [dd, mm, yyyy] = rawDate.split("-");
      let monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
      ];
      let monIndex = parseInt(mm, 10) - 1;
      return `${dd} ${monthNames[monIndex]} ${yyyy}`;
    }
  
  }); // document.ready
  
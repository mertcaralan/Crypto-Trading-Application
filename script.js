$(function () {
    let states = {};

    // LocalStorage'dan veriyi al
    let storedData = localStorage.getItem("states");
    states = storedData ? JSON.parse(storedData) : { active: null, users: [] };

    // `states.users` kontrolü
    if (!Array.isArray(states.users)) {
        states.users = [];
    }

    // Yeni profil formunu başlangıçta gizle
    $('.new_profile_container').css("display","none");

    $('.new_profile').click(function () {
        $('.new_profile_container').css("display","flex");
        $('#new_user_input').focus();
    });

    // Yeni profil ekle
    $('.btn.add').click(function () {
        const newProfileName = $('#new_user_input').val().trim();

        if (newProfileName) {
            // Kullanıcı bilgisi ekle
            states.users.push({
                name: newProfileName,
                day: 2, // Başlangıç günü
                selectedCoin: "Bitcoin", // Varsayılan seçili coin
                wallet: { cash: 1000, coins: [] }, // Başlangıç cüzdanı
            });

            // Kullanıcıyı UI'ye ekle
            const newUser = `
                <div class="user_container" data-name="${newProfileName}">
                    <img src="icons/close-ellipse-svgrepo-com.svg" class="close_img" alt="Close icon">
                    <img src="icons/user-icon-svgrepo-com.svg" alt="User icon">
                    <div class="username-box">${newProfileName}</div>
                </div>
            `;
            $('.users').prepend(newUser);

            // State'i kaydet
            localStorage.setItem("states", JSON.stringify(states));

            // Input alanını temizle ve formu gizle
            $('#new_user_input').val('');
            $('.new_profile_container').css("display","none"); // Formu gizle
        } else {
            alert('Please enter a profile name');
        }
    });

    // Profil seçme
    $('body').on('click', '.user_container', function () {
        const userName = $(this).data('name');
        const user = states.users.find(u => u.name === userName);

        if (user) {
            states.active = userName;
            localStorage.setItem("states", JSON.stringify(states));

            // Kullanıcı verilerini ekrana yükle
            loadUserScreen(user);
        }
    });

    // Kullanıcı verilerini yükle
    function loadUserScreen(user) {
        $('.profile_screen').css("display", "flex"); // Kullanıcı ekranını göster (block yerine flex tercih ettim)
        $('.profile_name').text(user.name);
        $('.current_day').text(`Day ${user.day}`);
        $('.wallet_cash').text(`$${user.wallet.cash.toFixed(2)}`);

        // Cüzdan bilgilerini göster
        const walletCoins = user.wallet.coins
            .map(
                coin =>
                    `<tr>
                        <td>${coin.name}</td>
                        <td>${coin.amount}</td>
                        <td>$${(coin.amount * coin.lastClose).toFixed(2)}</td>
                        <td>$${coin.lastClose.toFixed(2)}</td>
                    </tr>`
            )
            .join('');
        $('.wallet_table tbody').html(walletCoins);
    }

    // Profil kapama işlemi
    $('body').on('click', '.close_img', function () {
        const userContainer = $(this).closest('.user_container');
        const userName = userContainer.data('name');

        // Kullanıcıyı state'ten sil
        states.users = states.users.filter(user => user.name !== userName);
        localStorage.setItem("states", JSON.stringify(states));

        // UI'den kaldır
        userContainer.remove();
    });

    // Sayfa yüklenirken kullanıcıları listele
    states.users.forEach(user => {
        const userHTML = `
            <div class="user_container" data-name="${user.name}">
                <img src="icons/close-ellipse-svgrepo-com.svg" class="close_img" alt="Close icon">
                <img src="icons/user-icon-svgrepo-com.svg" alt="User icon">
                <div class="username-box">${user.name}</div>
            </div>
        `;
        $('.users').append(userHTML);
    });

    // Çıkış yap
    $('.logout').click(function () {
        states.active = null;
        localStorage.setItem("states", JSON.stringify(states));
        $('.profile_screen').hide(); // Kullanıcı ekranını gizle
    });
});

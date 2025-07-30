// Замените на ваш токен бота, полученный от @BotFather
const BOT_TOKEN = '7804805052:AAFlaCGdMGyx3UdUCBtXj_YfTaj2_74m0gk';

// Проверка авторизации при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem('tg_user'));
    const userAvatar = document.getElementById('userAvatar');
    
    if (user && userAvatar) {
        displayUserInfo(user, userAvatar);
    } else if (!window.location.pathname.includes('login.html')) {
        alert("Авторизуйтесь для использования");
        window.location.href = 'login.html';
    }
});

// Отображение информации о пользователе
async function displayUserInfo(user, element) {
    const userName = `${user.first_name} ${user.last_name || ''}`;
    
    // Если есть фото URL из Telegram Widget
    if (user.photo_url) {
        element.style.backgroundImage = `url(${user.photo_url})`;
        return;
    }
    
    // Если фото нет, пробуем получить через API
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${user.id}`);
        const data = await response.json();

        if (data.ok && data.result.photos.length > 0) {
            const fileId = data.result.photos[0][data.result.photos[0].length - 1].file_id;
            const fileResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
            const fileData = await fileResponse.json();

            if (fileData.ok) {
                const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;
                element.style.backgroundImage = `url(${photoUrl})`;
            }
        } else {
            // Устанавливаем аватар по умолчанию
            element.style.backgroundImage = 'url(img/default-avatar.png)';
        }
    } catch (error) {
        console.error('Ошибка при получении фотографии:', error);
        element.style.backgroundImage = 'url(img/default-avatar.png)';
    }
}

// Выход из системы
function logout() {
    localStorage.removeItem('tg_user');
    window.location.href = 'login.html';
}

// Добавляем обработчик клика на аватар
document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
        avatar.addEventListener('click', function() {
            if (confirm('Вы хотите выйти из системы?')) {
                logout();
            }
        });
    }
});

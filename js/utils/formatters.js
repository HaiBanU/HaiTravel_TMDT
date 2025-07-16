// js/utils/formatters.js

export function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

export function formatDateRange(start, end) {
    if (start === end) {
        return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
}

// [CẢI TIẾN] Hàm này chỉ cần loại bỏ ký hiệu sao khỏi tên
export function formatTourName(name) {
    return name.replace(/(\d)\*$/, '').trim();
}

export function formatTravelTime(distance, speed, vehicleName) {
    let travelHours = distance / speed;
    
    if (vehicleName === 'Máy bay') {
        travelHours += 2; // Cộng 2 giờ làm thủ tục
    }

    const hours = Math.floor(travelHours);
    const minutes = Math.round((travelHours - hours) * 60);

    if (hours > 0 && minutes > 0) {
        return `${hours} giờ ${minutes} phút`;
    } else if (hours > 0) {
        return `${hours} giờ`;
    } else {
        return `${minutes} phút`;
    }
}
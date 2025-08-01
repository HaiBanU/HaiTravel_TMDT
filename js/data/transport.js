export const vietnamProvinces = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

export const transportRoutes = {
    // --- CÁC TUYẾN HIỆN CÓ ---
    'hanoi-danang': { start: 'Hà Nội', end: 'Đà Nẵng', distance: 760, mapImage: 'images/map-hanoi-danang.jpg', trainPrice: 950000, description: 'Hành trình xuyên Việt kinh điển, đưa bạn từ trái tim thủ đô đến thành phố biển đáng sống nhất. Bạn sẽ được chiêm ngưỡng sự thay đổi của cảnh quan từ đồng bằng ra đến biển cả, đi qua những cung đường đèo hùng vĩ.' },
    'hanoi-laocai': { start: 'Hà Nội', end: 'Lào Cai', distance: 320, mapImage: 'images/map-hanoi-sapa.jpg', trainPrice: 550000, description: 'Cung đường cao tốc hiện đại đưa bạn đến cửa ngõ của vùng Tây Bắc. Đây là chặng đường không thể thiếu để tiếp cận "thành phố trong sương" Sapa, với những thửa ruộng bậc thang kỳ vĩ và văn hóa bản địa đặc sắc.' },
    'danang-quangnam': { start: 'Đà Nẵng', end: 'Quảng Nam', distance: 30, mapImage: 'images/map-danang-hoian.jpg', description: 'Chuyến đi ngắn nhưng đầy cảm xúc, kết nối thành phố Đà Nẵng hiện đại với vẻ đẹp trầm mặc, cổ kính của Di sản văn hóa thế giới Hội An. Lý tưởng cho những ai muốn tìm về một không gian yên bình và hoài niệm.' },
    'tphochiminh-khanhhoa': { start: 'TP. Hồ Chí Minh', end: 'Khánh Hòa', distance: 430, mapImage: 'images/map-hcm-nhatrang.jpg', trainPrice: 600000, description: 'Rời xa sự náo nhiệt của Sài Gòn để đến với vịnh biển Nha Trang, một trong những vịnh đẹp nhất thế giới. Hành trình lý tưởng để tận hưởng nắng vàng, biển xanh và các hoạt động giải trí dưới nước sôi động.' },
    'tphochiminh-lamdong': { start: 'TP. Hồ Chí Minh', end: 'Lâm Đồng', distance: 310, mapImage: 'images/map-hcm-dalat.jpg', description: 'Hành trình "trốn nóng" kinh điển, đưa bạn lên cao nguyên Lâm Đồng để đắm mình trong không khí se lạnh của Đà Lạt. Cung đường này nổi tiếng với những đồi thông, vườn hoa và các quán cà phê thơ mộng.' },
    'tphochiminh-bariavungtau': { start: 'TP. Hồ Chí Minh', end: 'Bà Rịa - Vũng Tàu', distance: 100, mapImage: 'images/map-hcm-vungtau.jpg', description: 'Lựa chọn hàng đầu cho chuyến đi cuối tuần nhanh chóng từ Sài Gòn. Chỉ sau vài giờ di chuyển, bạn đã có thể hít thở không khí biển trong lành và thưởng thức hải sản tươi ngon tại Vũng Tàu.' },
    'tphochiminh-binhthuan': { start: 'TP. Hồ Chí Minh', end: 'Bình Thuận', distance: 200, mapImage: 'images/map-hcm-binhthuan.jpg', trainPrice: 250000, description: 'Khám phá "thủ đô resort" Phan Thiết - Mũi Né với hành trình đầy nắng và gió. Tuyến đường sẽ đưa bạn đến với những đồi cát bay độc đáo và những khu nghỉ dưỡng sang trọng ven biển.' },
    'tphochiminh-cantho': { start: 'TP. Hồ Chí Minh', end: 'Cần Thơ', distance: 170, mapImage: 'images/map-hcm-cantho.jpg', description: 'Về với thủ phủ của miền Tây sông nước. Chuyến đi sẽ mang lại trải nghiệm chân thực về văn hóa chợ nổi, những miệt vườn trái cây trĩu quả và sự hiếu khách của người dân địa phương.' },
    'tphochiminh-tayninh': { start: 'TP. Hồ Chí Minh', end: 'Tây Ninh', distance: 100, mapImage: 'images/map-hcm-tayninh.jpg', description: 'Một chuyến đi ngắn phù hợp cho các hoạt động tâm linh và dã ngoại. Bạn sẽ có cơ hội chinh phục núi Bà Đen - "nóc nhà Nam Bộ" và khám phá kiến trúc độc đáo của Toà Thánh Cao Đài.' },

    // [THÊM MỚI] CÁC TUYẾN TỪ TP.HCM ĐẾN ĐIỂM KHỞI HÀNH TOUR
    'tphochiminh-hanoi': { 
        start: 'TP. Hồ Chí Minh', 
        end: 'Hà Nội', 
        distance: 1600, 
        mapImage: 'images/map-hcm-hanoi.jpg', 
        trainPrice: 1200000, 
        description: 'Hành trình Bắc - Nam huyền thoại, kết nối trung tâm kinh tế sôi động nhất nước với trái tim thủ đô ngàn năm văn hiến. Đây là chặng đường khởi đầu để bạn tiếp cận các tour Sapa, Ninh Bình, Hạ Long từ miền Nam.' 
    },
    'tphochiminh-danang': { 
        start: 'TP. Hồ Chí Minh', 
        end: 'Đà Nẵng', 
        distance: 850, 
        mapImage: 'images/map-hcm-danang.jpg', 
        trainPrice: 800000, 
        description: 'Bay hoặc đi tàu đến "thành phố đáng sống nhất Việt Nam". Từ đây, bạn có thể dễ dàng bắt đầu hành trình khám phá Cầu Vàng - Bà Nà Hills hoặc ngược dòng thời gian về với phố cổ Hội An thơ mộng.' 
    },
    'tphochiminh-quangninh': { 
        start: 'TP. Hồ Chí Minh', 
        end: 'Quảng Ninh', 
        distance: 1700, 
        mapImage: 'images/map-hcm-quangninh.jpg', 
        description: 'Hành trình đưa bạn đến thẳng cửa ngõ của Kỳ quan Thiên nhiên Thế giới Vịnh Hạ Long. Lựa chọn bay đến sân bay Vân Đồn là cách nhanh nhất để bắt đầu chuyến du ngoạn trên những du thuyền sang trọng.' 
    },
    'tphochiminh-kiengiang': { 
        start: 'TP. Hồ Chí Minh', 
        end: 'Kiên Giang', 
        distance: 250, 
        mapImage: 'images/map-hcm-kiengiang.jpg', 
        description: 'Đường đến với đảo ngọc Phú Quốc! Bạn có thể chọn bay thẳng hoặc đi xe khách chất lượng cao đến Rạch Giá, sau đó trải nghiệm đi tàu cao tốc ra đảo, tận hưởng trọn vẹn vẻ đẹp của biển trời Tây Nam.' 
    }
};

export const vehicleInfo = {
    'airplane': { name: 'Máy bay', icon: 'fa-solid fa-plane-up', avgSpeed: 800 },
    'bus': { name: 'Xe khách Limousine', icon: 'fa-solid fa-bus-simple', avgSpeed: 55 },
    'train': { name: 'Tàu hoả', icon: 'fa-solid fa-train-subway', avgSpeed: 70 },
};
export const tours = {
    '1': { 
        name: "Khám Phá Vịnh Hạ Long - Du Thuyền 5*",
        price: 2500000, 
        originalPrice: 2850000, 
        startDate: '2025-08-15', 
        endDate: '2025-08-16', 
        gallery: ["images/tour-halong-bay.jpg", "images/activity-halong-cave.jpg", "images/activity-halong-kayak.jpg"], 
        keyInfo: { 
            line: 'Du thuyền Paradise', 
            departure: '11:00 - Cảng Tuần Châu', 
            route: 'Hà Nội - Hạ Long',
            transportDestination: 'Quảng Ninh' // Điểm đến để đặt vé
        }, 
        activities: [
            {
                title: 'Chèo Kayak & Thuyền Nan',
                description: 'Tự mình chèo thuyền kayak len lỏi qua những vách đá sừng sững, khám phá các hang động ẩn mình hoặc ngồi trên thuyền nan để người dân địa phương đưa bạn vào những góc khuất bình yên nhất của vịnh.',
                image: 'images/activity-halong-kayak.jpg'
            },
            {
                title: 'Khám Phá Hang Động Kỳ Vĩ',
                description: 'Bước vào một thế giới khác tại Hang Sửng Sốt, nơi những khối nhũ đá và măng đá hàng triệu năm tuổi tạo nên một không gian tráng lệ, huyền ảo như trong truyện cổ tích.',
                image: 'images/activity-halong-cave.jpg'
            },
            {
                title: 'Lớp Học Nấu Ăn & Tiệc Hoàng Hôn',
                description: 'Tham gia lớp học nấu ăn để tự tay làm những món ăn truyền thống Việt Nam, sau đó thư giãn trên boong tàu, nhâm nhi ly cocktail và ngắm hoàng hôn rực rỡ buông xuống trên mặt vịnh.',
                image: 'images/activity-halong-sundown.jpg'
            },
            {
                title: 'Câu Mực Đêm',
                description: 'Khi màn đêm buông xuống, hãy thử vận may của mình với hoạt động câu mực đêm đầy thú vị. Chiến lợi phẩm sẽ được các đầu bếp chế biến thành món ăn tươi ngon cho bạn thưởng thức.',
                image: 'images/activity-halong-squid.jpg'
            }
        ],
        itinerary: [ 
            { 
                day: 'Ngày 1: Hà Nội – Vịnh Hạ Long – Khám Phá & Tận Hưởng', 
                time: 'Sáng - Trưa (08:00 - 12:30)',
                details: 'Xe limousine sang trọng đón quý khách tại Hà Nội, khởi hành đến Tuần Châu. 12:30, bạn sẽ được chào đón nồng nhiệt tại nhà chờ riêng, thưởng thức đồ uống chào mừng trong khi làm thủ tục lên du thuyền. Sau khi nhận phòng, bữa trưa thịnh soạn với hải sản tươi sống sẽ được phục vụ trong lúc du thuyền bắt đầu hải trình vào trung tâm kỳ quan.' 
            },
            { 
                day: 'Ngày 1: Hà Nội – Vịnh Hạ Long – Khám Phá & Tận Hưởng', 
                time: 'Chiều (14:30 - 18:00)',
                details: 'Du thuyền đưa bạn đến Hang Sửng Sốt - một trong những hang động đẹp nhất. Sau đó, bạn có thể lựa chọn chinh phục đỉnh Ti-tốp để ngắm toàn cảnh vịnh từ trên cao hoặc đắm mình trong làn nước trong xanh. Trải nghiệm chèo kayak là hoạt động không thể bỏ lỡ để khám phá vịnh theo cách riêng của bạn.' 
            },
            {
                day: 'Ngày 1: Hà Nội – Vịnh Hạ Long – Khám Phá & Tận Hưởng', 
                time: 'Tối (18:00 - 21:00)',
                details: 'Khi hoàng hôn buông xuống, hãy tham gia tiệc Sunset Party trên boong tàu. Bữa tối lãng mạn tại nhà hàng 5 sao sẽ là một trải nghiệm đáng nhớ. Sau bữa tối, tự do nghỉ ngơi hoặc tham gia hoạt động câu mực đêm.' 
            },
            { 
                day: 'Ngày 2: Làng Chài – Về Hà Nội', 
                time: 'Sáng - Trưa (06:30 - 12:00)',
                details: 'Chào ngày mới với bài tập Taichi trên boong tàu. Sau bữa sáng nhẹ, thuyền nan sẽ đưa bạn đi tham quan Làng chài, tìm hiểu cuộc sống của ngư dân. Quay lại du thuyền, bạn sẽ tham gia một lớp học nấu ăn ngắn và thưởng thức bữa trưa tự chọn. 12:00, tàu cập bến, xe đưa quý khách trở về Hà Nội, kết thúc hành trình khó quên.' 
            } 
        ], 
       includes: ['Xe di chuyển khứ hồi Hà Nội - Hạ Long bằng limousine', 'Cabin sang trọng', 'Các bữa ăn theo chương trình', 'Vé tham quan', 'Hướng dẫn viên trên tàu', 'Thuyền kayak', 'Bảo hiểm du lịch (mức đền bù tối đa 120.000.000 VNĐ/vụ)'], 
notIncludes: ['Đồ uống', 'Chi phí cá nhân', 'Tip', 'Bảo hiểm hủy tour và các rủi ro cá nhân khác'],

        documents: ['CCCD hoặc Hộ chiếu còn hiệu lực.'], 
        prepare: ['Đồ bơi, kính râm, kem chống nắng.', 'Máy ảnh, sạc dự phòng.', 'Một chút tiền mặt cho các chi phí nhỏ.'], 
        terms: ['Đặt cọc 50% khi đăng ký tour.', 'Hủy tour trước 7 ngày không mất phí.'],
        tags: ['nature', 'resort', 'couple', 'group']
    },
    '2': { 
        name: "Đêm Phố Cổ Hội An Huyền Ảo", 
        price: 1200000, 
        originalPrice: 1500000, 
        startDate: '2025-09-22', 
        endDate: '2025-09-22', 
        gallery: ["images/tour-hoi-an-lanterns.jpg", "images/activity-hoian-boat.jpg", "images/activity-hoian-food.jpg"], 
        keyInfo: { 
            line: 'Tour đi bộ', 
            departure: '18:00 - Tại khách sạn', 
            route: 'Trong khu vực phố cổ',
            transportDestination: 'Quảng Nam'
        }, 
        activities: [
            {
                title: 'Dạo Thuyền Sông Hoài & Thả Hoa Đăng',
                description: 'Ngồi trên chiếc thuyền gỗ nhỏ, nhẹ nhàng trôi trên sông Hoài, ngắm nhìn phố cổ lung linh hai bên bờ. Bạn sẽ được tự tay thả những chiếc đèn hoa đăng lấp lánh xuống dòng sông và gửi gắm những ước nguyện của mình.',
                image: 'images/activity-hoian-boat.jpg'
            },
            {
                title: 'Khám Phá Ẩm Thực Đường Phố',
                description: 'Hội An là thiên đường ẩm thực. Hướng dẫn viên sẽ đưa bạn đến những hàng quán lâu đời nhất để thưởng thức các món đặc sản trứ danh như Cao lầu, Mì Quảng, bánh vạc, và đặc biệt là ổ Bánh mỳ Phượng nổi tiếng thế giới.',
                image: 'images/activity-hoian-food.jpg'
            },
            {
                title: 'Check-in Chùa Cầu & Hẻm Đèn Lồng',
                description: 'Ghi lại những khoảnh khắc đẹp nhất tại Chùa Cầu - biểu tượng của Hội An, và lạc vào những con hẻm nhỏ được trang hoàng bởi hàng trăm chiếc đèn lồng đủ màu sắc, tạo nên một bối cảnh đẹp như tranh vẽ.',
                image: 'images/activity-hoian-checkin.jpg'
            }
        ],
        itinerary: [ 
            { 
                day: 'Hành trình buổi tối', 
                time: '18:00 - 19:30',
                details: 'Hướng dẫn viên sẽ đón bạn tại khách sạn trung tâm. Cuộc hành trình bắt đầu bằng việc dạo bước qua những con phố cổ kính, lắng nghe những câu chuyện lịch sử về Chùa Cầu và các Hội quán của người Hoa. Bạn sẽ cảm nhận được nhịp sống chậm rãi và không khí yên bình đặc trưng.'
            },
            { 
                day: 'Hành trình buổi tối', 
                time: '19:30 - 20:30',
                details: 'Đây là lúc để khám phá ẩm thực. Theo chân người bản địa, bạn sẽ được nếm thử những món ăn ngon nhất, từ bát Cao Lầu đậm đà cho đến những món ăn vặt hấp dẫn. Mỗi món ăn là một câu chuyện văn hóa thú vị.'
            },
            { 
                day: 'Hành trình buổi tối', 
                time: '20:30 - 21:30',
                details: 'Trải nghiệm lãng mạn nhất của đêm Hội An đang chờ đón. Bạn sẽ lên thuyền và tự tay thả đèn hoa đăng trên sông Hoài. Khung cảnh hàng trăm ngọn nến trôi lung linh trên mặt nước chắc chắn sẽ là một kỷ niệm khó phai. Kết thúc chương trình, HDV đưa bạn về lại khách sạn.'
            }
        ], 
        includes: ['Hướng dẫn viên', 'Vé vào cổng Phố cổ', '1 đèn hoa đăng/khách', 'Thuyền trên sông Hoài', 'Bảo hiểm du lịch trong tour'], 
        notIncludes: ['Chi phí ăn uống', 'Chi phí cá nhân'], 
        documents: ['Không yêu cầu'], 
        prepare: ['Giày dép thoải mái', 'Máy ảnh'], 
        terms: ['Lịch trình có thể thay đổi tùy thuộc thời tiết.'],
        tags: ['city', 'culture', 'food', 'couple']
    },
    '3': { 
        name: "Chinh Phục Sapa & Ruộng Bậc Thang", 
        price: 3800000, 
        originalPrice: 4200000, 
        startDate: '2025-10-10', 
        endDate: '2025-10-11', 
        gallery: ["images/tour-sapa-terraces.jpg", "images/activity-sapa-fansipan.jpg", "images/activity-sapa-village.jpg"], 
        keyInfo: { 
            line: 'Tour trekking', 
            departure: '06:00 - Hà Nội', 
            route: 'Hà Nội - Sapa - Bản Cát Cát',
            transportDestination: 'Hà Nội'
        }, 
        activities: [
            {
                title: 'Chinh Phục "Nóc Nhà Đông Dương"',
                description: 'Trải nghiệm hệ thống cáp treo 3 dây hiện đại, lướt qua thung lũng Mường Hoa hùng vĩ để lên tới đỉnh Fansipan. Chạm tay vào cột mốc 3.143m và chiêm ngưỡng biển mây bồng bềnh là một cảm xúc vô cùng đặc biệt.',
                image: 'images/activity-sapa-fansipan.jpg'
            },
            {
                title: 'Trekking Bản Làng & Ruộng Bậc Thang',
                description: 'Đi bộ qua những con đường mòn, băng qua những thửa ruộng bậc thang vàng óng mùa lúa chín, ghé thăm những ngôi nhà của người H’Mông, Dao đỏ để tìm hiểu về cuộc sống và văn hóa độc đáo của họ.',
                image: 'images/activity-sapa-village.jpg'
            },
            {
                title: 'Thưởng Thức Ẩm Thực Tây Bắc',
                description: 'Sapa là nơi hội tụ tinh hoa ẩm thực núi rừng. Bạn sẽ được thưởng thức những món đặc sản nóng hổi như lẩu cá tầm, gà đen, thắng cố, và khám phá sự phong phú của các món nướng tại chợ đêm.',
                image: 'images/activity-sapa-food.jpg'
            },
        ],
        itinerary: [ 
            { 
                day: 'Ngày 1: Hà Nội - Sapa - Khám Phá Bản Cát Cát', 
                time: 'Sáng (06:30 - 13:00)',
                details: 'Xe giường nằm cao cấp đón quý khách tại Hà Nội, bắt đầu hành trình đến với Sapa. Quý khách sẽ có cơ hội ngắm nhìn cảnh sắc ngoạn mục của núi rừng Tây Bắc trên đường đi. Đến Sapa, quý khách ăn trưa tại nhà hàng với các món đặc sản, sau đó nhận phòng khách sạn.'
            },
            { 
                day: 'Ngày 1: Hà Nội - Sapa - Khám Phá Bản Cát Cát', 
                time: 'Chiều - Tối (14:30 - 21:00)',
                details: 'Bắt đầu hành trình trekking nhẹ nhàng đến bản Cát Cát, ngôi làng cổ của người H’mông. Quý khách sẽ được tham quan thác nước, nhà máy thủy điện cũ và tìm hiểu các phong tục, nghề thủ công truyền thống. Bữa tối ấm cúng tại nhà hàng, sau đó tự do khám phá nhà thờ Đá và chợ đêm Sapa.'
            },
            { 
                day: 'Ngày 2: Chinh Phục Fansipan - Về Hà Nội', 
                time: 'Sáng - Trưa (08:00 - 13:00)',
                details: 'Sau bữa sáng, xe đưa quý khách đến ga cáp treo Fansipan. Trải nghiệm cảm giác lướt giữa mây ngàn để lên đỉnh Fansipan. Quý khách có thời gian chiêm bái quần thể tâm linh và chụp ảnh tại cột mốc huyền thoại. Sau đó quay lại thị trấn ăn trưa và trả phòng.'
            },
            { 
                day: 'Ngày 2: Chinh Phục Fansipan - Về Hà Nội', 
                time: 'Chiều (13:00 - 21:00)',
                details: 'Quý khách tự do mua sắm đặc sản địa phương trước khi lên xe giường nằm trở về Hà Nội. Dự kiến 21:00, xe về đến Hà Nội, kết thúc hành trình chinh phục đầy cảm xúc.'
            } 
        ], 
        includes: ['Xe giường nằm khứ hồi', 'Khách sạn tại Sapa (2 người/phòng)', 'Các bữa ăn theo chương trình', 'Vé tham quan bản Cát Cát', 'Vé cáp treo Fansipan khứ hồi', 'Hướng dẫn viên nhiệt tình', 'Bảo hiểm du lịch mạo hiểm (mức đền bù tối đa 150.000.000 VNĐ/vụ)'], 
        notIncludes: ['Đồ uống trong các bữa ăn', 'Chi phí cá nhân ngoài chương trình', 'Tip cho HDV và tài xế'], 
        documents: ['CCCD hoặc Hộ chiếu'], 
        prepare: ['Giày trekking hoặc giày thể thao thoải mái', 'Quần áo ấm, áo khoác gió', 'Mũ, kính, kem chống nắng', 'Máy ảnh'], 
        terms: ['Cần có sức khỏe tốt để tham gia trekking và leo bộ trên đỉnh Fansipan.', 'Lịch trình có thể thay đổi tùy thuộc vào điều kiện thời tiết.'],
        tags: ['nature', 'adventure', 'seasonal', 'culture', 'group']
    },
    '4': { 
        name: "Đà Nẵng - Cầu Vàng & Bà Nà Hills", 
        price: 2990000, 
        originalPrice: 3300000, 
        startDate: '2025-07-25', 
        endDate: '2025-07-25', 
        gallery: ["images/tour-danang-golden-bridge.jpg", "images/activity-danang-fantasy.jpg", "images/activity-danang-village.jpg"], 
        keyInfo: { 
            line: 'Tour trong ngày', 
            departure: '08:00 - Đà Nẵng', 
            route: 'Đà Nẵng - Bà Nà Hills',
            transportDestination: 'Đà Nẵng'
        }, 
        activities: [
            {
                title: 'Check-in Cầu Vàng Biểu Tượng',
                description: 'Dạo bước trên Cầu Vàng, một kiệt tác kiến trúc được nâng đỡ bởi đôi bàn tay khổng lồ, cảm nhận như đang đi dạo trên mây và thu vào tầm mắt toàn bộ khung cảnh núi non hùng vĩ.',
                image: 'images/tour-danang-golden-bridge.jpg'
            },
            {
                title: 'Lạc Giữa Làng Pháp Cổ Kính',
                description: 'Khám phá một "châu Âu thu nhỏ" với những tòa lâu đài, nhà thờ, quảng trường và con phố mang đậm kiến trúc Gothic. Mỗi góc ở đây đều là một background hoàn hảo cho những bức ảnh của bạn.',
                image: 'images/activity-danang-village.jpg'
            },
            {
                title: 'Vui Chơi Tại Fantasy Park',
                description: 'Bước vào khu vui chơi trong nhà hàng đầu Việt Nam, với vô số trò chơi hấp dẫn dành cho mọi lứa tuổi, từ tháp rơi tự do, công viên khủng long đến rạp chiếu phim 4D, 5D hiện đại.',
                image: 'images/activity-danang-fantasy.jpg'
            }
        ],
        itinerary: [ 
            { 
                day: 'Hành trình trong ngày', 
                time: 'Sáng (08:00 - 12:00)',
                details: 'Xe và HDV đón khách tại Đà Nẵng, khởi hành đến Bà Nà Hills. Quý khách sẽ bắt đầu hành trình bằng việc trải nghiệm tuyến cáp treo đạt nhiều kỷ lục thế giới. Điểm đến đầu tiên là Cầu Vàng, sau đó là vườn hoa Le Jardin D’Amour và hầm rượu Debay trăm tuổi.'
            },
            { 
                day: 'Hành trình trong ngày', 
                time: 'Trưa - Chiều (12:00 - 16:00)',
                details: 'Thưởng thức bữa trưa buffet đa dạng tại nhà hàng trên đỉnh Bà Nà. Sau đó, quý khách sẽ tự do khám phá Làng Pháp cổ kính, tham gia các trò chơi cảm giác mạnh tại Fantasy Park, hoặc chiêm bái các công trình tâm linh trên đỉnh núi.'
            },
            { 
                day: 'Hành trình trong ngày', 
                time: 'Kết thúc (16:00)',
                details: 'Tập trung tại ga cáp treo để xuống núi. Xe sẽ đưa quý khách về lại điểm đón ban đầu tại Đà Nẵng, kết thúc một ngày vui chơi và khám phá trọn vẹn tại "đường lên tiên cảnh".'
            }
        ], 
        includes: ['Xe đưa đón', 'Hướng dẫn viên', 'Vé cáp treo và vé vào cổng', 'Ăn trưa buffet', 'Bảo hiểm du lịch (mức đền bù tối đa 100.000.000 VNĐ/vụ)'], 
        notIncludes: ['Vé Bảo tàng Sáp', 'Chi phí cá nhân'], 
        documents: ['Không yêu cầu'], 
        prepare: ['Mũ, nón', 'Kính râm'], 
        terms: ['Giá vé trẻ em tính theo chiều cao.'],
        tags: ['city', 'resort', 'group', 'couple', 'culture']
    },
    '5': { 
        name: "Ninh Bình - Tràng An Cổ Tích", 
        price: 950000, 
        originalPrice: 1100000, 
        startDate: '2025-11-05', 
        endDate: '2025-11-05', 
        gallery: ["images/tour-ninhbinh-trangan.jpg", "images/activity-ninhbinh-pagoda.jpg", "images/activity-ninhbinh-food.jpg"], 
        keyInfo: { 
            line: 'Tour trong ngày', 
            departure: '07:30 - Hà Nội', 
            route: 'Hà Nội - Tràng An - Bái Đính',
            transportDestination: 'Hà Nội'
        }, 
        activities: [
            {
                title: 'Du Thuyền Tràng An',
                description: 'Ngồi trên thuyền nan, xuôi theo dòng nước trong veo, luồn lách qua các hang động đá vôi kỳ bí và chiêm ngưỡng khung cảnh non nước hữu tình được mệnh danh là "Vịnh Hạ Long trên cạn".',
                image: 'images/tour-ninhbinh-trangan.jpg'
            },
            {
                title: 'Viếng Chùa Bái Đính',
                description: 'Tham quan quần thể chùa Bái Đính, ngôi chùa lớn nhất Việt Nam với nhiều kỷ lục châu Á, cảm nhận không khí thanh tịnh và chiêm ngưỡng kiến trúc Phật giáo đồ sộ, hoành tráng.',
                image: 'images/activity-ninhbinh-pagoda.jpg'
            },
            {
                title: 'Thưởng Thức Đặc Sản Dê Núi',
                description: 'Ninh Bình nổi tiếng với món thịt dê núi. Bạn sẽ được thưởng thức bữa trưa với các món ăn chế biến từ thịt dê tươi ngon, cùng với đặc sản cơm cháy giòn rụm.',
                image: 'images/activity-ninhbinh-food.jpg'
            }
        ],
        itinerary: [ 
            { 
                day: 'Hành trình trong ngày', 
                time: 'Sáng (07:30 - 12:00)',
                details: 'Xe khởi hành từ Hà Nội đi Ninh Bình. Điểm đến đầu tiên là Chùa Bái Đính. Quý khách sẽ đi xe điện vào tham quan chùa, chiêm ngưỡng tượng Phật bằng đồng lớn nhất và hành lang La Hán dài nhất châu Á.'
            },
            { 
                day: 'Hành trình trong ngày', 
                time: 'Trưa (12:00 - 13:30)',
                details: 'Thưởng thức bữa trưa tại nhà hàng địa phương với các đặc sản trứ danh của Ninh Bình như thịt dê núi, cơm cháy, và các món ăn dân dã khác.'
            },
            { 
                day: 'Hành trình trong ngày', 
                time: 'Chiều - Tối (13:30 - 19:00)',
                details: 'Lên thuyền đi dọc theo dòng sông Sào Khê trong khu du lịch sinh thái Tràng An, khám phá hệ thống hang động tự nhiên và các di tích lịch sử. Khoảng 17:00, quý khách lên xe trở về Hà Nội, kết thúc chuyến đi.'
            }
        ], 
        includes: ['Xe đưa đón', 'Hướng dẫn viên', 'Ăn trưa', 'Vé thuyền Tràng An', 'Vé xe điện chùa Bái Đính', 'Bảo hiểm du lịch (mức đền bù tối đa 100.000.000 VNĐ/vụ)'], 
        notIncludes: ['Đồ uống', 'Chi phí cá nhân'], 
        documents: ['Không yêu cầu'], 
        prepare: ['Quần áo lịch sự khi vào chùa', 'Mũ, nón'], 
        terms: ['Nên mang theo tiền mặt.'],
        tags: ['nature', 'culture', 'group']
    },
    '6': { 
        name: "Thiên Đường Biển Phú Quốc 3N2Đ", 
        price: 4500000, 
        originalPrice: 4950000, 
        startDate: '2025-12-20', 
        endDate: '2025-12-22', 
        gallery: ["images/tour-phuquoc-beach.jpg", "images/activity-phuquoc-cablecar.jpg", "images/activity-phuquoc-market.jpg"], 
        keyInfo: { 
            line: 'Tour trọn gói', 
            departure: 'Theo chuyến bay', 
            route: 'Tham quan Nam đảo & Bắc đảo',
            transportDestination: 'Kiên Giang'
        }, 
        activities: [
            {
                title: 'Tắm Biển Tại Bãi Sao',
                description: 'Thư giãn trên bãi cát trắng mịn như kem và đắm mình trong làn nước biển trong xanh màu ngọc bích tại Bãi Sao, một trong những bãi biển được mệnh danh là đẹp nhất hành tinh.',
                image: 'images/tour-phuquoc-beach.jpg'
            },
            {
                title: 'Trải Nghiệm Cáp Treo Hòn Thơm',
                description: 'Bay trên biển với hệ thống cáp treo vượt biển dài nhất thế giới, thu vào tầm mắt toàn cảnh 360 độ vẻ đẹp của các hòn đảo và làng chài từ trên cao.',
                image: 'images/activity-phuquoc-cablecar.jpg'
            },
            {
                title: 'Khám Phá Chợ Đêm Dinh Cậu',
                description: 'Hòa mình vào không khí nhộn nhịp của chợ đêm, thiên đường của các loại hải sản tươi sống được chế biến tại chỗ và các món ăn vặt đặc trưng của đảo ngọc.',
                image: 'images/activity-phuquoc-market.jpg'
            }
        ],
        itinerary: [ 
            { 
                day: 'Ngày 1: Chào Phú Quốc & Khám Phá Đông Đảo', 
                time: 'Cả ngày',
                details: 'Xe đón quý khách tại sân bay Phú Quốc, đưa về khách sạn nhận phòng. Buổi chiều, tham quan các điểm đặc trưng của đảo như Dinh Cậu, vườn tiêu, nhà thùng sản xuất nước mắm truyền thống và cơ sở rượu sim. Tối, tự do khám phá và thưởng thức hải sản tại chợ đêm Dinh Cậu.'
            },
            { 
                day: 'Ngày 2: Thiên Đường Nam Đảo', 
                time: 'Cả ngày',
                details: 'Sau bữa sáng, xe đưa quý khách đi tham quan cơ sở nuôi cấy ngọc trai. Tiếp đó, di chuyển đến Bãi Sao để tự do tắm biển. Sau bữa trưa, quý khách có thể lựa chọn tham quan Di tích lịch sử nhà tù Phú Quốc hoặc trải nghiệm cáp treo Hòn Thơm (chi phí tự túc). Bữa tối tự do.'
            },
            { 
                day: 'Ngày 3: Tạm Biệt Đảo Ngọc', 
                time: 'Sáng',
                details: 'Quý khách tự do tắm biển tại khách sạn hoặc đi mua sắm đặc sản. Đến giờ, xe đưa quý khách ra sân bay Phú Quốc, làm thủ tục bay về. Kết thúc chuyến nghỉ dưỡng tuyệt vời.'
            }
        ], 
        includes: ['Xe đưa đón tại sân bay', 'Khách sạn 2 đêm', 'Các bữa ăn theo chương trình', 'Vé tham quan', 'Bảo hiểm du lịch (mức đền bù tối đa 120.000.000 VNĐ/vụ)'], 
        notIncludes: ['Vé máy bay', 'Chi phí cá nhân', 'Vé cáp treo Hòn Thơm', 'Bảo hiểm cho hành lý và tài sản cá nhân'], 
        documents: ['CCCD hoặc Hộ chiếu'], 
        prepare: ['Đồ bơi', 'Kem chống nắng'], 
        terms: ['Giá tour không bao gồm vé máy bay và có thể thay đổi tùy vào hạng khách sạn.'],
        tags: ['resort', 'food', 'couple', 'group', 'nature']
    },
    '7': { 
        name: "Khám Phá Miền Tây Sông Nước 2N1Đ", 
        price: 1950000, 
        originalPrice: 2200000, 
        startDate: '2025-08-20', 
        endDate: '2025-08-21', 
        gallery: ["images/tour-mientay-mekong.jpg", "images/activity-mientay-floatingmarket.jpg", "images/activity-mientay-fruit.jpg"], 
        keyInfo: { 
            line: 'Tour đường bộ', 
            departure: '07:00 - TP. Hồ Chí Minh', 
            route: 'TP.HCM - Mỹ Tho - Bến Tre - Cần Thơ',
            transportDestination: 'TP. Hồ Chí Minh'
        }, 
        activities: [
            {
                title: 'Đi Chợ Nổi Cái Răng',
                description: 'Hòa mình vào không khí mua bán tấp nập trên sông vào sáng sớm. Bạn sẽ được ngồi trên thuyền, thưởng thức tô hủ tiếu nóng hổi và các loại trái cây tươi ngon được bán từ ghe này sang ghe khác.',
                image: 'images/activity-mientay-floatingmarket.jpg'
            },
            {
                title: 'Đi Xuồng Ba Lá',
                description: 'Trải nghiệm cảm giác gần gũi với thiên nhiên khi ngồi trên chiếc xuồng ba lá, len lỏi qua những con rạch nhỏ rợp bóng dừa nước, lắng nghe tiếng mái chèo khua nước và sự tĩnh lặng của miền quê.',
                image: 'images/tour-mientay-mekong.jpg'
            },
            {
                title: 'Tham Quan Vườn Trái Cây',
                description: 'Đến với những miệt vườn trĩu quả, bạn sẽ được tự tay hái và thưởng thức các loại trái cây theo mùa như chôm chôm, măng cụt, sầu riêng... ngay tại vườn.',
                image: 'images/activity-mientay-fruit.jpg'
            }
        ],
        itinerary: [ 
            { 
                day: 'Ngày 1: TP.HCM - Mỹ Tho - Bến Tre - Cần Thơ', 
                time: 'Sáng - Chiều',
                details: 'Khởi hành từ TP.HCM đi Mỹ Tho. Quý khách lên thuyền lớn du ngoạn sông Tiền, ngắm 4 cù lao Long, Lân, Quy, Phụng. Ghé Cồn Lân tham quan lò kẹo dừa, thưởng thức trái cây và nghe đờn ca tài tử. Trải nghiệm đi xuồng ba lá trong rạch dừa nước. Sau bữa trưa miệt vườn, xe đưa quý khách đi Cần Thơ.'
            },
            { 
                day: 'Ngày 1: TP.HCM - Mỹ Tho - Bến Tre - Cần Thơ', 
                time: 'Tối',
                details: 'Đến Cần Thơ, quý khách nhận phòng khách sạn. Tự do dạo chơi bến Ninh Kiều, cây cầu Tình Yêu và thưởng thức ẩm thực đêm của Tây Đô.'
            },
            { 
                day: 'Ngày 2: Chợ nổi Cái Răng - Về TP.HCM', 
                time: 'Sáng - Chiều',
                details: 'Sáng sớm, xe đưa quý khách ra bến tàu tham quan Chợ nổi Cái Răng, chứng kiến nét văn hóa giao thương độc đáo trên sông. Sau khi quay về khách sạn trả phòng và ăn trưa, xe sẽ đưa quý khách về lại TP.HCM, kết thúc chuyến đi về miền sông nước.'
            }
        ], 
        includes: ['Xe du lịch đời mới', 'Khách sạn 1 đêm tại Cần Thơ', 'Các bữa ăn theo chương trình', 'Thuyền tham quan', 'Hướng dẫn viên', 'Bảo hiểm du lịch (mức đền bù tối đa 100.000.000 VNĐ/vụ)'], 
        notIncludes: ['Chi phí ăn uống ngoài chương trình', 'Chi phí cá nhân', 'Tip'], 
        documents: ['CCCD hoặc Hộ chiếu'], 
        prepare: ['Nón rộng vành, kính râm', 'Quần áo thoải mái, dễ vận động', 'Thuốc chống côn trùng'], 
        terms: ['Lịch trình có thể thay đổi tùy theo tình hình thực tế.'],
        tags: ['nature', 'food', 'culture', 'group']
    },
    '8': { 
        name: "Lặn Biển & Khám Phá Nha Trang", 
        price: 2100000, 
        originalPrice: 2500000, 
        startDate: '2025-09-10', 
        endDate: '2025-09-11', 
        gallery: ["images/tour-nhatrang-scuba.jpg", "images/activity-nhatrang-island.jpg", "images/activity-nhatrang-mudbath.jpg"], 
        keyInfo: { 
            line: 'Tour biển đảo', 
            departure: '08:30 - Cảng Cầu Đá', 
            route: 'Vịnh Nha Trang',
            transportDestination: 'Khánh Hòa'
        }, 
        activities: [
            {
                title: 'Lặn Biển Ngắm San Hô (Scuba Diving)',
                description: 'Khám phá thế giới đại dương kỳ thú tại Vịnh San Hô hoặc Hòn Mun. Dù bạn là người mới bắt đầu, các huấn luyện viên chuyên nghiệp sẽ hướng dẫn bạn tận tình để có một trải nghiệm lặn biển an toàn và đáng nhớ.',
                image: 'images/tour-nhatrang-scuba.jpg'
            },
            {
                title: 'Du Ngoạn Các Hòn Đảo',
                description: 'Lướt trên sóng biển bằng cano cao tốc, ghé thăm các hòn đảo xinh đẹp trong vịnh Nha Trang. Bạn sẽ được tự do tắm biển, thư giãn và tham gia các trò chơi thể thao trên biển sôi động.',
                image: 'images/activity-nhatrang-island.jpg'
            },
            {
                title: 'Tắm Bùn Khoáng Thư Giãn',
                description: 'Tận hưởng liệu pháp chăm sóc sức khỏe độc đáo với dịch vụ tắm bùn khoáng nóng. Đây là hoạt động giúp thư giãn cơ bắp, giải độc và làm đẹp da, rất được du khách yêu thích khi đến Nha Trang.',
                image: 'images/activity-nhatrang-mudbath.jpg'
            }
        ],
        itinerary: [ 
            { 
                day: 'Ngày 1: Khám Phá Vịnh Nha Trang', 
                time: 'Sáng (08:30 - 12:00)',
                details: 'Xe và HDV đón tại khách sạn, đưa đến cảng Cầu Đá. Lên cano khởi hành chuyến du ngoạn vịnh. Cano sẽ đưa quý khách đến Vịnh San Hô. Tại đây, bạn sẽ được trang bị đồ lặn chuyên dụng và được huấn luyện viên hướng dẫn 1 kèm 1 để lặn biển ngắm san hô (Scuba Diving).'
            },
            { 
                day: 'Ngày 1: Khám Phá Vịnh Nha Trang', 
                time: 'Trưa - Chiều (12:00 - 15:30)',
                details: 'Cano đưa quý khách đến một hòn đảo khác để dùng bữa trưa với các món hải sản tươi ngon. Sau đó, quý khách tự do nghỉ ngơi, tắm biển, hoặc tham gia các trò chơi trên biển như dù bay, mô tô nước (chi phí tự túc). 15:30, cano đưa quý khách về lại đất liền, xe đưa về khách sạn.'
            },
            { 
                day: 'Ngày 2: Tự Do Khám Phá', 
                time: 'Cả ngày',
                details: 'Hôm nay là ngày để bạn tự do khám phá Nha Trang theo cách riêng. Bạn có thể lựa chọn đi tham quan Tháp Bà Ponagar, Chùa Long Sơn, hoặc dành thời gian thư giãn với dịch vụ tắm bùn khoáng nóng. Tour không bao gồm chi phí và xe trong ngày này. Kết thúc chương trình tour.'
            }
        ], 
        includes: ['Xe đưa đón ngày 1', 'Cano cao tốc', 'Vé lặn biển (Scuba Diving 1 lần)', 'Ăn trưa', 'Nước suối', 'Hướng dẫn viên', 'Bảo hiểm du lịch chuyên biệt cho hoạt động lặn biển (mức đền bù tối đa 200.000.000 VNĐ/vụ)'], 
        notIncludes: ['Chi phí khách sạn', 'Các bữa ăn khác', 'Chi phí cá nhân và các trò chơi trên biển', 'Chi phí ngày 2'], 
        documents: ['CCCD hoặc Hộ chiếu'], 
        prepare: ['Đồ bơi, khăn tắm', 'Kem chống nắng', 'Máy ảnh chống nước (nếu có)'], 
        terms: ['Cần có sức khỏe tốt để tham gia lặn biển.', 'Trẻ em dưới 10 tuổi không tham gia lặn biển.'],
        tags: ['adventure', 'nature', 'resort', 'couple']
    }
};
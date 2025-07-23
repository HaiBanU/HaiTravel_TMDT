// backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Groq from 'groq-sdk';
import { tours } from '../js/data/tours.js';
import fetch from 'node-fetch';

// --- KHỞI TẠO VÀ CẤU HÌNH ---
dotenv.config();
const app = express();

const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    process.env.FRONTEND_URL
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) !== -1){
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  }
}));

app.use(express.json());

// --- KẾT NỐI DATABASE, MODELS, MIDDLEWARE (Không thay đổi) ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB đã kết nối thành công'))
    .catch((err) => console.error('Lỗi kết nối MongoDB:', err));
const userSchema = mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, password: { type: String, required: true }, cart: [{ itemId: { type: String, required: true }, quantity: { type: Number, required: true, default: 1 }, name: { type: String, required: true }, price: { type: Number, required: true }, image: { type: String }, startDate: { type: String }, endDate: { type: String }, }] }, { timestamps: true });
userSchema.pre('save', async function(next) { if (!this.isModified('password')) next(); const salt = await bcrypt.genSalt(10); this.password = await bcrypt.hash(this.password, salt); });
userSchema.methods.matchPassword = async function(enteredPassword) { return await bcrypt.compare(enteredPassword, this.password); };
const User = mongoose.model('User', userSchema);
const reviewSchema = mongoose.Schema({ name: { type: String, required: true }, rating: { type: Number, required: true }, comment: { type: String, required: true }, }, { timestamps: true });
const tourSchema = mongoose.Schema({ tourId: { type: String, required: true, unique: true }, reviews: [reviewSchema], });
const Tour = mongoose.model('Tour', tourSchema);
const protect = async (req, res, next) => { let token; if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { try { token = req.headers.authorization.split(' ')[1]; const decoded = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(decoded.id).select('-password'); if (!req.user) return res.status(401).json({ message: 'Không tìm thấy người dùng' }); next(); } catch (error) { console.error(error); res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' }); } } else { res.status(401).json({ message: 'Không có quyền truy cập, không tìm thấy token' }); } };
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// --- API ROUTES ---

// A. User & Tour Routes (Không thay đổi)
app.post('/api/users/register', async (req, res) => { try { const { name, email, password } = req.body; const userExists = await User.findOne({ email }); if (userExists) return res.status(400).json({ message: 'Email đã được sử dụng' }); const user = await User.create({ name, email, password }); res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) }); } catch (error) { res.status(400).json({ message: 'Dữ liệu không hợp lệ hoặc đã xảy ra lỗi' }); } });
app.post('/api/users/login', async (req, res) => { try { const { email, password } = req.body; const user = await User.findOne({ email }); if (user && (await user.matchPassword(password))) { res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id), cart: user.cart }); } else { res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' }); } } catch (error) { console.error("Lỗi server khi đăng nhập:", error); res.status(500).json({ message: 'Đã có lỗi xảy ra ở máy chủ. Vui lòng thử lại sau.' }); } });
app.get('/api/tours/:tourId/reviews', async (req, res) => { try { const tour = await Tour.findOne({ tourId: req.params.tourId }); res.json(tour ? tour.reviews : []); } catch(error) { res.status(500).json({message: "Lỗi server khi lấy review."}); } });
app.post('/api/tours/:tourId/reviews', async (req, res) => { try { const { name, rating, comment } = req.body; let tour = await Tour.findOne({ tourId: req.params.tourId }); if (!tour) tour = await Tour.create({ tourId: req.params.tourId, reviews: [] }); const review = { name, rating: Number(rating), comment }; tour.reviews.push(review); await tour.save(); res.status(201).json({ message: 'Đã thêm đánh giá' }); } catch (error) { res.status(500).json({ message: 'Lỗi server khi thêm đánh giá.' }); } });

// B. Cart Routes (Không thay đổi)
app.get('/api/cart', protect, (req, res) => res.json(req.user.cart));
app.post('/api/cart', protect, async (req, res) => { try { const itemToAdd = req.body; const user = req.user; const existItem = user.cart.find(item => item.itemId === itemToAdd.itemId); if (existItem) { existItem.quantity += itemToAdd.quantity > 0 ? itemToAdd.quantity : 1; } else { user.cart.push(itemToAdd); } const updatedUser = await user.save(); res.status(201).json(updatedUser.cart); } catch (error) { res.status(400).json({ message: 'Thêm vào giỏ hàng thất bại' }); } });
app.post('/api/cart/sync', protect, async (req, res) => { try { const { items } = req.body; const user = req.user; items.forEach(guestItem => { const existItem = user.cart.find(userItem => userItem.itemId === guestItem.itemId); if (existItem) { existItem.quantity += guestItem.quantity; } else { user.cart.push(guestItem); } }); const updatedUser = await user.save(); res.json(updatedUser.cart); } catch (error) { res.status(400).json({ message: 'Đồng bộ giỏ hàng thất bại' }); } });
app.put('/api/cart', protect, async (req, res) => { try { const { itemId, quantity } = req.body; const user = req.user; const itemToUpdate = user.cart.find(item => item.itemId === itemId); if (itemToUpdate) { if (quantity > 0) { itemToUpdate.quantity = Number(quantity); } else { user.cart = user.cart.filter(item => item.itemId !== itemId); } } const updatedUser = await user.save(); res.json(updatedUser.cart); } catch (error) { res.status(400).json({ message: 'Cập nhật giỏ hàng thất bại' }); } });
app.delete('/api/cart/:itemId', protect, async (req, res) => { try { const user = req.user; user.cart = user.cart.filter(item => item.itemId !== req.params.itemId); const updatedUser = await user.save(); res.json(updatedUser.cart); } catch (error) { res.status(400).json({ message: 'Xóa sản phẩm thất bại' }); } });

// C. AI Routes
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
app.post('/api/ai/chat', async (req, res) => { try { const { message, history, userName } = req.body; let tourDetailsContext = ""; for (const id in tours) { const tour = tours[id]; tourDetailsContext += `\n\n--- TOUR: ${tour.name} ---\n`; tourDetailsContext += `Giá: ${tour.price.toLocaleString('vi-VN')} VNĐ\n`; if (tour.originalPrice) tourDetailsContext += `Giá gốc: ${tour.originalPrice.toLocaleString('vi-VN')} VNĐ\n`; tourDetailsContext += `Thời gian: Từ ${tour.startDate} đến ${tour.endDate}\n`; if (tour.keyInfo) tourDetailsContext += `Khởi hành: ${tour.keyInfo.departure}\n`; tourDetailsContext += `Lịch trình: ${tour.itinerary.map(i => `${i.day} (${i.time}): ${i.details}`).join('; ')}\n`; if (tour.includes) tourDetailsContext += `Bao gồm: ${tour.includes.join(', ')}\n`; if (tour.notIncludes) tourDetailsContext += `Không bao gồm: ${tour.notIncludes.join(', ')}\n`; if (tour.prepare) tourDetailsContext += `Cần chuẩn bị: ${tour.prepare.join(', ')}\n`; if (tour.documents) tourDetailsContext += `Giấy tờ cần thiết: ${tour.documents.join(', ')}\n`; if (tour.terms) tourDetailsContext += `Điều khoản: ${tour.terms.join(', ')}\n`; if (tour.includes && tour.includes.some(item => item.toLowerCase().includes('bảo hiểm'))) { const insuranceInfo = tour.includes.find(item => item.toLowerCase().includes('bảo hiểm')); tourDetailsContext += `Thông tin bảo hiểm: ${insuranceInfo}\n`; } } const systemPrompt = `Bạn là Hai AI, một trợ lý ảo thông minh, thân thiện và chuyên nghiệp của công ty du lịch HaiTravel. Luôn luôn trả lời bằng tiếng Việt.\n\nNhiệm vụ của bạn:\n1. **Chào hỏi:** Nếu đây là tin nhắn đầu tiên từ người dùng trong cuộc trò chuyện (tức là trong 'history' chưa có lời chào của bạn), hãy chào khách hàng. Nếu biết tên khách hàng (biến \`userName\` có giá trị, ví dụ: "Sơn Tùng"), hãy chào "Xin chào ${userName}, tôi là Hai AI, trợ lý ảo của HaiTravel. Tôi có thể giúp gì cho bạn?". Nếu không biết tên, hãy chào "Xin chào, tôi là Hai AI, trợ lý ảo của HaiTravel. Tôi có thể giúp gì cho bạn?". Đối với các tin nhắn tiếp theo, không cần lặp lại lời chào đầy đủ, chỉ cần trả lời câu hỏi.\n2. **Sử dụng kiến thức được cung cấp:** TRẢ LỜI MỌI CÂU HỎI DỰA TRÊN "DỮ LIỆU CHI TIẾT CÁC TOUR" DƯỚI ĐÂY. Đây là nguồn thông tin duy nhất và chính xác nhất của bạn. Không được bịa đặt thông tin.\n3. **Tư vấn chi tiết:** Giải đáp mọi thắc mắc của khách hàng về tour như: lịch trình, giá cả, dịch vụ bao gồm và không bao gồm, thông tin bảo hiểm, những thứ cần chuẩn bị, điều khoản tour. Ví dụ, nếu khách hỏi "tour Hạ Long có bảo hiểm không?", bạn phải tìm trong dữ liệu và trả lời chính xác dựa trên dòng "Thông tin bảo hiểm".\n4. **Tư vấn gợi ý:** Dựa vào sở thích của khách (ví dụ: "đi biển", "leo núi", "tour cho cặp đôi"), hãy gợi ý những tour phù hợp nhất từ danh sách.\n5. **Giọng văn:** Luôn giữ giọng văn thân thiện, chuyên nghiệp, rõ ràng, và nhiệt tình. Trả lời ngắn gọn, đi thẳng vào vấn đề.\n\n**DỮ LIỆU CHI TIẾT CÁC TOUR:**\n${tourDetailsContext}`; const messages = [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: message }]; const chatCompletion = await groq.chat.completions.create({ messages, model: "llama3-8b-8192" }); res.json({ reply: chatCompletion.choices[0]?.message?.content }); } catch (error) { console.error("Lỗi AI Chat:", error); res.status(500).json({ error: 'Lỗi kết nối với trợ lý AI.' }); } });

// [SỬA LỖI LẦN 2] Route để chuyển văn bản thành giọng nói (Text-to-Speech)
app.post('/api/ai/tts', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Không có văn bản để đọc.' });
    }
    if (!process.env.FPT_API_KEY) {
        return res.status(500).json({ error: 'API Key của FPT chưa được cấu hình trên server.' });
    }

    try {
        const fptResponse = await fetch('https://api.fpt.ai/hmi/tts/v5', {
            method: 'POST',
            headers: {
                'api-key': process.env.FPT_API_KEY,
                // [SỬA ĐỔI] Thêm giọng nói và tốc độ vào header theo một số tài liệu
                // Nếu vẫn lỗi, chúng ta có thể thử lại cách dùng URLSearchParams, nhưng cách này thường đúng hơn
                'voice': 'banmai',
                'speed': '' // Để trống cho tốc độ mặc định
            },
            body: text // [SỬA ĐỔI QUAN TRỌNG] Gửi thẳng văn bản thô
        });

        const data = await fptResponse.json();

        if (data.async) {
            res.json({ audioUrl: data.async });
        } else {
            console.error('Lỗi từ FPT.AI:', data);
            res.status(500).json({ error: 'Không thể tạo file âm thanh từ FPT.AI.' });
        }
    } catch (error) {
        console.error('Lỗi khi gọi API FPT.AI TTS:', error);
        res.status(500).json({ error: 'Lỗi server khi xử lý giọng nói.' });
    }
});

// --- KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server HaiTravel đang chạy trên cổng ${PORT}`));
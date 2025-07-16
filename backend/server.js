// backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Groq from 'groq-sdk';
import { tours } from '../js/data/tours.js';

// --- KHỞI TẠO VÀ CẤU HÌNH ---
dotenv.config();
const app = express();

// --- [SỬA ĐỔI QUAN TRỌNG 1]: Cấu hình CORS cho môi trường Production ---
const allowedOrigins = [
    'http://127.0.0.1:5500', // Cho phép Live Server ở máy bạn
    'http://localhost:5500', // Một địa chỉ khác của Live Server
    process.env.FRONTEND_URL  // Biến môi trường chứa URL của web thật trên Render
];

app.use(cors({
  origin: function(origin, callback){
    // Cho phép các request không có 'origin' (ví dụ: từ Postman hoặc app di động)
    if(!origin) return callback(null, true);
    
    // Nếu địa chỉ request nằm trong danh sách trắng, cho phép nó
    if(allowedOrigins.indexOf(origin) !== -1){
      return callback(null, true);
    } else {
      // Nếu không, từ chối request
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  }
}));

app.use(express.json());

// --- KẾT NỐI DATABASE MONGODB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB đã kết nối thành công'))
    .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// --- ĐỊNH NGHĨA MODELS ---

// 1. User Model
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [{
        itemId: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        startDate: { type: String },
        endDate: { type: String },
    }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);

// 2. Tour Model
const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });
const tourSchema = mongoose.Schema({
    tourId: { type: String, required: true, unique: true },
    reviews: [reviewSchema],
});
const Tour = mongoose.model('Tour', tourSchema);


// --- MIDDLEWARE BẢO VỆ API ---
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) return res.status(401).json({ message: 'Không tìm thấy người dùng' });
            next();
        } catch (error) {
            res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' });
        }
    } else {
        res.status(401).json({ message: 'Không có quyền truy cập, không tìm thấy token' });
    }
};


// --- API ROUTES ---
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// A. User Routes
app.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email đã được sử dụng' });
    try {
        const user = await User.create({ name, email, password });
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
    } catch (error) {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
});

app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id), cart: user.cart });
    } else {
        res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }
});

// B. Tour Routes
app.get('/api/tours/:tourId/reviews', async (req, res) => {
    try {
        const tour = await Tour.findOne({ tourId: req.params.tourId });
        res.json(tour ? tour.reviews : []);
    } catch(error) {
        res.status(500).json({message: "Lỗi server khi lấy review."});
    }
});

app.post('/api/tours/:tourId/reviews', async (req, res) => {
    try {
        const { name, rating, comment } = req.body;
        let tour = await Tour.findOne({ tourId: req.params.tourId });
        if (!tour) tour = await Tour.create({ tourId: req.params.tourId, reviews: [] });
        const review = { name, rating: Number(rating), comment };
        tour.reviews.push(review);
        await tour.save();
        res.status(201).json({ message: 'Đã thêm đánh giá' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi thêm đánh giá.' });
    }
});

// C. Cart Routes
app.get('/api/cart', protect, (req, res) => res.json(req.user.cart));

app.post('/api/cart', protect, async (req, res) => {
    const itemToAdd = req.body;
    const user = req.user;
    const existItem = user.cart.find(item => item.itemId === itemToAdd.itemId);
    if (existItem) {
        existItem.quantity += itemToAdd.quantity > 0 ? itemToAdd.quantity : 1;
    } else {
        user.cart.push(itemToAdd);
    }
    const updatedUser = await user.save();
    res.status(201).json(updatedUser.cart);
});

// [THÊM MỚI] Route để đồng bộ giỏ hàng của khách khi đăng nhập
app.post('/api/cart/sync', protect, async (req, res) => {
    const { items } = req.body; // Mảng các sản phẩm từ giỏ hàng của khách
    const user = req.user;
    
    items.forEach(guestItem => {
        const existItem = user.cart.find(userItem => userItem.itemId === guestItem.itemId);
        if (existItem) {
            // Nếu sản phẩm đã có, cộng dồn số lượng
            existItem.quantity += guestItem.quantity;
        } else {
            // Nếu chưa có, thêm mới vào giỏ hàng của user
            user.cart.push(guestItem);
        }
    });

    const updatedUser = await user.save();
    res.json(updatedUser.cart);
});


app.put('/api/cart', protect, async (req, res) => {
    const { itemId, quantity } = req.body;
    const user = req.user;
    const itemToUpdate = user.cart.find(item => item.itemId === itemId);
    if (itemToUpdate) {
        if (quantity > 0) {
            itemToUpdate.quantity = Number(quantity);
        } else {
            user.cart = user.cart.filter(item => item.itemId !== itemId);
        }
    }
    const updatedUser = await user.save();
    res.json(updatedUser.cart);
});

app.delete('/api/cart/:itemId', protect, async (req, res) => {
    const user = req.user;
    user.cart = user.cart.filter(item => item.itemId !== req.params.itemId);
    const updatedUser = await user.save();
    res.json(updatedUser.cart);
});

// D. AI Chat Route
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
app.post('/api/ai/chat', async (req, res) => {
    const { message, history } = req.body;
    const tourContext = Object.values(tours).map(t => `- ${t.name}`).join('\n');
    const systemPrompt = `Bạn là "Jack 97", nhân viên AI của HaiTravel. Nhiệm vụ của bạn là hỗ trợ khách hàng về các tour du lịch dựa trên danh sách sau: ${tourContext}. Luôn trả lời bằng tiếng Việt một cách thân thiện và chuyên nghiệp.`;
    const messages = [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: message }];
    try {
        const chatCompletion = await groq.chat.completions.create({ messages, model: "llama3-8b-8192" });
        res.json({ reply: chatCompletion.choices[0]?.message?.content });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi kết nối với trợ lý AI.' });
    }
});


// --- KHỞI ĐỘNG SERVER ---
// [SỬA ĐỔI QUAN TRỌNG 2]: Sử dụng PORT linh động do Render cung cấp
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server HaiTravel đang chạy trên cổng ${PORT}`));
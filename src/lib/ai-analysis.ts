import OpenAI from 'openai';

interface ScoreData {
  gutHealthIndex: number;
  fiberScore: number;
  microbiomeScore: number;
  nutritionalRiskIndex: number;
  overallScore: number;
}

export async function analyzeGutHealth(scores: ScoreData): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API Key is missing in environment variables!');
    return 'Lỗi: Không tìm thấy API Key của OpenAI trong môi trường. Vui lòng thêm EXPO_PUBLIC_OPENAI_API_KEY vào file .env và khởi động lại (restart) máy chủ Expo (Metro Bundler).';
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const prompt = `Bạn là bác sĩ chuyên khoa dinh dưỡng. Hãy phân tích kết quả đánh giá sức khỏe đường ruột sau đây và đưa ra lời khuyên cá nhân hóa bằng tiếng Việt:

- Chỉ số sức khỏe đường ruột: ${scores.gutHealthIndex}/100
- Điểm chất xơ: ${scores.fiberScore}/100
- Điểm vi khuẩn đường ruột: ${scores.microbiomeScore}/100
- Chỉ số nguy cơ dinh dưỡng: ${scores.nutritionalRiskIndex}/100
- Điểm tổng thể: ${scores.overallScore}/100

Hãy cung cấp:
1. Nhận xét tổng quan về tình trạng đường ruột
2. Những thiếu hụt dinh dưỡng có thể có
3. Đề xuất thực phẩm từ thực vật phù hợp (ưu tiên thực phẩm Việt Nam)
4. Lời khuyên cải thiện

Giữ phân tích ngắn gọn, khoảng 200-300 từ.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content || 'Không thể phân tích lúc này.';
}
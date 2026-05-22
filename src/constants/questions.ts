import { AssessmentQuestion } from '@/types/assessment';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Page 1 - Gut Health Index (8 questions)
  { id: 'gh1', page: 1, question: 'Bạn đi đại tiện mấy lần một ngày?', options: [
    { value: 0, label: '0 lần hoặc ít hơn' },
    { value: 2, label: '1 lần' },
    { value: 4, label: '2 lần' },
    { value: 5, label: '3 lần hoặc nhiều hơn' },
  ]},
  { id: 'gh2', page: 1, question: 'Phân của bạn thường có hình dạng như thế nào?', options: [
    { value: 0, label: 'Viên nhỏ cứng' },
    { value: 2, label: 'Nứt nẻ' },
    { value: 4, label: 'Mềm và hình thù' },
    { value: 5, label: 'Nhiều nước, lỏng' },
  ]},
  { id: 'gh3', page: 1, question: 'Bạn có bị đầy hơi không?', options: [
    { value: 0, label: 'Luôn luôn' },
    { value: 2, label: 'Thường xuyên' },
    { value: 4, label: 'Đôi khi' },
    { value: 5, label: 'Hiếm khi hoặc không bao giờ' },
  ]},
  { id: 'gh4', page: 1, question: 'Bạn có bị đau bụng không?', options: [
    { value: 0, label: 'Rất thường xuyên' },
    { value: 2, label: 'Thỉnh thoảng' },
    { value: 4, label: 'Hiếm khi' },
    { value: 5, label: 'Không bao giờ' },
  ]},
  { id: 'gh5', page: 1, question: 'Bạn có cảm thấy đau khi đi đại tiện không?', options: [
    { value: 0, label: 'Thường xuyên' },
    { value: 2, label: 'Đôi khi' },
    { value: 4, label: 'Hiếm khi' },
    { value: 5, label: 'Không bao giờ' },
  ]},
  { id: 'gh6', page: 1, question: 'Phân của bạn có máu không?', options: [
    { value: 5, label: 'Không' },
    { value: 2, label: 'Đôi khi' },
    { value: 0, label: 'Thường xuyên' },
  ]},
  { id: 'gh7', page: 1, question: 'Bạn có bị táo bón không?', options: [
    { value: 0, label: 'Thường xuyên' },
    { value: 2, label: 'Đôi khi' },
    { value: 4, label: 'Hiếm khi' },
    { value: 5, label: 'Không bao giờ' },
  ]},
  { id: 'gh8', page: 1, question: 'Bạn có bị tiêu chảy không?', options: [
    { value: 0, label: 'Thường xuyên' },
    { value: 2, label: 'Đôi khi' },
    { value: 4, label: 'Hiếm khi' },
    { value: 5, label: 'Không bao giờ' },
  ]},

  // Page 2 - Fiber Score (7 questions)
  { id: 'fs1', page: 2, question: 'Bạn ăn bao nhiêu bữa rau mỗi ngày?', options: [
    { value: 0, label: 'Ít hơn 1 bữa' },
    { value: 2, label: '1 bữa' },
    { value: 4, label: '2 bữa' },
    { value: 5, label: '3 bữa hoặc nhiều hơn' },
  ]},
  { id: 'fs2', page: 2, question: 'Bạn ăn trái cây mấy lần một ngày?', options: [
    { value: 0, label: 'Không ăn hoặc ít hơn 1 lần' },
    { value: 2, label: '1 lần' },
    { value: 4, label: '2 lần' },
    { value: 5, label: '3 lần hoặc nhiều hơn' },
  ]},
  { id: 'fs3', page: 2, question: 'Bạn ăn ngũ cốc nguyên hạt (yến mạch, gạo lứt,...) không?', options: [
    { value: 0, label: 'Không bao giờ' },
    { value: 2, label: 'Đôi khi' },
    { value: 4, label: 'Thường xuyên' },
    { value: 5, label: 'Hàng ngày' },
  ]},
  { id: 'fs4', page: 2, question: 'Bạn ăn đậu, hạt, hoặc các loại đỗ không?', options: [
    { value: 0, label: 'Không bao giờ' },
    { value: 2, label: 'Đôi khi' },
    { value: 4, label: 'Thường xuyên' },
    { value: 5, label: 'Hàng ngày' },
  ]},
  { id: 'fs5', page: 2, question: 'Bạn ăn bao nhiêu phần rau xanh mỗi ngày?', options: [
    { value: 0, label: 'Ít hơn 1 phần' },
    { value: 2, label: '1-2 phần' },
    { value: 4, label: '3-4 phần' },
    { value: 5, label: '5 phần hoặc nhiều hơn' },
  ]},
  { id: 'fs6', page: 2, question: 'Bạn có ăn khoai lang, bí đỏ, hoặc các loại rau củ giàu tinh bột không?', options: [
    { value: 0, label: 'Không bao giờ' },
    { value: 2, label: 'Đôi khi' },
    { value: 4, label: 'Thường xuyên' },
    { value: 5, label: 'Hàng ngày' },
  ]},
  { id: 'fs7', page: 2, question: 'Bạn bổ sung chất xơ từ thực phẩm chức năng không?', options: [
    { value: 5, label: 'Không cần' },
    { value: 4, label: 'Đôi khi' },
    { value: 2, label: 'Thường xuyên' },
    { value: 0, label: 'Luôn luôn phải có' },
  ]},

  // Page 3 - Microbiome Score (7 questions)
  { id: 'ms1', page: 3, question: 'Bạn ăn thực phẩm lên men (sữa chua, kim chi, kombucha,...) không?', options: [
    { value: 0, label: 'Không bao giờ' },
    { value: 2, label: 'Đôi khi' },
    { value: 4, label: 'Vài lần một tuần' },
    { value: 5, label: 'Hàng ngày' },
  ]},
  { id: 'ms2', page: 3, question: 'Bạn uống bao nhiêu nước mỗi ngày?', options: [
    { value: 0, label: 'Ít hơn 1 lít' },
    { value: 2, label: '1-2 lít' },
    { value: 4, label: '2-3 lít' },
    { value: 5, label: 'Hơn 3 lít' },
  ]},
  { id: 'ms3', page: 3, question: 'Bạn có dùng kháng sinh trong 12 tháng qua không?', options: [
    { value: 5, label: 'Không' },
    { value: 2, label: '1 lần' },
    { value: 0, label: '2-3 lần' },
    { value: 0, label: 'Nhiều hơn 3 lần' },
  ]},
  { id: 'ms4', page: 3, question: 'Bạn có uống rượu bia không?', options: [
    { value: 5, label: 'Không bao giờ' },
    { value: 4, label: 'Đôi khi (ít hơn 1 lần/tuần)' },
    { value: 2, label: 'Thường xuyên (1-3 lần/tuần)' },
    { value: 0, label: 'Nhiều (hơn 3 lần/tuần)' },
  ]},
  { id: 'ms5', page: 3, question: 'Bạn có hút thuốc không?', options: [
    { value: 5, label: 'Không bao giờ' },
    { value: 4, label: 'Đã bỏ' },
    { value: 2, label: 'Thỉnh thoảng' },
    { value: 0, label: 'Hàng ngày' },
  ]},
  { id: 'ms6', page: 3, question: 'Bạn ngủ bao nhiêu tiếng mỗi đêm?', options: [
    { value: 0, label: 'Ít hơn 5 tiếng' },
    { value: 2, label: '5-6 tiếng' },
    { value: 4, label: '7-8 tiếng' },
    { value: 5, label: 'Hơn 8 tiếng' },
  ]},
  { id: 'ms7', page: 3, question: 'Mức độ căng thẳng của bạn như thế nào?', options: [
    { value: 0, label: 'Rất cao, liên tục' },
    { value: 2, label: 'Cao' },
    { value: 4, label: 'Trung bình' },
    { value: 5, label: 'Thấp hoặc không có' },
  ]},

  // Page 4 - Nutritional Risk Index (7 questions)
  { id: 'nr1', page: 4, question: 'Bạn ăn thực phẩm chế biến sẵn (đồ hộp, mì gói,...) mấy lần một tuần?', options: [
    { value: 5, label: 'Không ăn hoặc ít hơn 1 lần' },
    { value: 4, label: '1-2 lần' },
    { value: 2, label: '3-4 lần' },
    { value: 0, label: '5 lần hoặc nhiều hơn' },
  ]},
  { id: 'nr2', page: 4, question: 'Bạn ăn đồ chiên rán mỡ nhiều không?', options: [
    { value: 5, label: 'Không hoặc ít' },
    { value: 4, label: 'Đôi khi' },
    { value: 2, label: 'Thường xuyên' },
    { value: 0, label: 'Rất thường xuyên' },
  ]},
  { id: 'nr3', page: 4, question: 'Bạn ăn đồ ngọt (bánh kẹo, nước ngọt,...) không?', options: [
    { value: 5, label: 'Không hoặc rất ít' },
    { value: 4, label: 'Đôi khi' },
    { value: 2, label: 'Thường xuyên' },
    { value: 0, label: 'Rất thường xuyên' },
  ]},
  { id: 'nr4', page: 4, question: 'Bạn ăn thịt đỏ (bò, heo, cừu) mấy lần một tuần?', options: [
    { value: 5, label: 'Ít hơn 1 lần hoặc không ăn' },
    { value: 4, label: '1-2 lần' },
    { value: 2, label: '3-4 lần' },
    { value: 0, label: '5 lần hoặc nhiều hơn' },
  ]},
  { id: 'nr5', page: 4, question: 'Bạn ăn thịt hun khói hoặc thịt chế biến (xúc xích, giăm bông) không?', options: [
    { value: 5, label: 'Không ăn' },
    { value: 4, label: 'Đôi khi' },
    { value: 2, label: 'Thường xuyên' },
    { value: 0, label: 'Rất thường xuyên' },
  ]},
  { id: 'nr6', page: 4, question: 'Bạn tập thể dục mấy lần một tuần?', options: [
    { value: 0, label: 'Không tập' },
    { value: 2, label: '1-2 lần' },
    { value: 4, label: '3-4 lần' },
    { value: 5, label: '5 lần hoặc nhiều hơn' },
  ]},
  { id: 'nr7', page: 4, question: 'Bạn có đang dùng thực phẩm bổ sung (vitamin, men vi sinh,...) không?', options: [
    { value: 0, label: 'Không' },
    { value: 2, label: 'Có, 1 loại' },
    { value: 4, label: 'Có, 2-3 loại' },
    { value: 5, label: 'Có, nhiều hơn 3 loại' },
  ]},
];

export const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length; // 29
export const QUESTIONS_PER_PAGE = 4; // First page has 8, but we show 4 per screen for wizard
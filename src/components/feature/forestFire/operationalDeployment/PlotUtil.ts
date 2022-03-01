const Util: any = {
    // 添加文本折行
    addTextLineSeperator(text: any, lineLimit: any = 20) {
        if (text) {
            const chars: any = [];
            for (let i = 0 ; i < text.length ; i++) {
                chars.push(text[i]);
                if (i > 0 && (i + 1) % lineLimit === 0) {
                    chars.push('\r\n');
                }
            }
            return chars.join('');
        } else {
            return '';
        }
    },
    // 移除文本折行
    removeTextLineSeperator(text: any) {
        if (text) {
            while (text.indexOf('\r\n') >= 0 ) {
                text = text.replace('\r\n', '');
            }
            return text;
        } else {
            return '';
        }
    },
};
export default Util;

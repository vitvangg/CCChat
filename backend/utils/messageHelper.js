
// Ham cập nhật cuộc trò chuyện sau khi gửi tin nhắn
export const updateConversationAfterCreateMessage = async (conversation, message, senderID) => {
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderID,
            createAt: message.createAt
        },
    });

    // Cập nhật số lượng tin nhắn chưa đọc cho từng người tham gia
    conversation.participants.forEach(p => {
        const memberID = p.userID.toString();
        const isSender = memberID === senderID.toString();
        const prevCount = conversation.unreadCount.get(memberID) || 0;
        conversation.unreadCount.set(memberID, isSender ? 0 : prevCount + 1);
    })
}
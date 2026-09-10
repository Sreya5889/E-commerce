import { supabase } from '../lib/supabase';

export const messageService = {
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select('conversation_id, conversations(*, messages(*))')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map((cp: any) => cp.conversations);
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, profiles:sender_id(display_name, avatar_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async sendMessage(conversationId: string, senderId: string, text: string, attachmentUrl?: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        message: text,
        attachment_url: attachmentUrl || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToMessages(conversationId: string, callback: (message: any) => void) {
    return supabase
      .channel(`public:messages:conversation_id=eq.${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => callback(payload.new)
      )
      .subscribe();
  }
};

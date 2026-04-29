import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateTitle, estimateTokens } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, content, isNew, firstMessage } = await req.json();

    // Check ownership
    const { data: conversation } = await supabase
      .from("conversations")
      .select("user_id")
      .eq("id", conversationId)
      .single();

    if (!conversation || conversation.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Insert assistant message
    const { data: savedMessage, error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content: content,
        tokens: estimateTokens(content),
      })
      .select()
      .single();

    if (msgError) throw msgError;

    // Update conversation stats
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Note: In a real app, you'd use a RPC or increment logic. 
    // For simplicity, we'll fetch and update or just assume the client handles the count if needed.
    // The prompt asks to "increment", which we'll do via a direct update here.
    const { data: conv } = await supabase
      .from("conversations")
      .select("message_count, total_tokens")
      .eq("id", conversationId)
      .single();

    if (conv) {
      updateData.message_count = (conv.message_count || 0) + 1;
      updateData.total_tokens = (conv.total_tokens || 0) + estimateTokens(content);
    }

    if (isNew && firstMessage) {
      const title = await generateTitle(firstMessage);
      updateData.title = title;
    }

    await supabase
      .from("conversations")
      .update(updateData)
      .eq("id", conversationId);

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

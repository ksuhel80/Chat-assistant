import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { streamChatResponse, estimateTokens } from "@/lib/ai/gemini";
import { Message, Persona } from "@/types";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId, personaId } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let convId = conversationId;
    let isNew = false;
    let systemPrompt = "You are a helpful AI assistant.";

    if (!convId) {
      isNew = true;
      if (personaId) {
        const { data: persona } = await supabase
          .from("personas")
          .select("system_prompt")
          .eq("id", personaId)
          .single();
        if (persona) systemPrompt = persona.system_prompt;
      }

      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          persona_id: personaId || null,
          system_prompt: systemPrompt,
          title: "New Conversation",
        })
        .select()
        .single();

      if (convError) throw convError;
      convId = conversation.id;
    } else {
      const { data: conversation } = await supabase
        .from("conversations")
        .select("system_prompt")
        .eq("id", convId)
        .single();
      if (conversation) systemPrompt = conversation.system_prompt;
    }

    // Save user message
    await supabase.from("messages").insert({
      conversation_id: convId,
      role: "user",
      content: message,
      tokens: estimateTokens(message),
    });

    // Fetch last 20 messages for context
    const { data: history } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: false })
      .limit(20);

    const formattedHistory = (history || [])
      .reverse()
      .filter((msg: Message) => msg.content !== message); // Exclude the message we just sent as it's passed separately

    const stream = await streamChatResponse(
      message,
      formattedHistory,
      systemPrompt
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Conversation-Id": convId,
        "X-Is-New": String(isNew),
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const tonePrompts = {
  friendly: "You are a friendly, warm, and approachable AI assistant. Use a casual, conversational tone.",
  professional: "You are a professional AI assistant. Use formal language and be structured and precise in your responses.",
  creative: "You are a creative and imaginative AI assistant. Be witty, expressive, and think outside the box.",
  concise: "You are a concise AI assistant. Be direct, brief, and get straight to the point."
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, tone = 'friendly' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build conversation with tone
    const systemMessage = {
      role: "system",
      content: tonePrompts[tone as keyof typeof tonePrompts] || tonePrompts.friendly
    };

    const conversationMessages = [
      systemMessage,
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call Lovable AI for text response
    const chatResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: conversationMessages,
      }),
    });

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      console.error("Chat API error:", chatResponse.status, errorText);
      throw new Error(`AI API error: ${chatResponse.status}`);
    }

    const chatData = await chatResponse.json();
    const responseText = chatData.choices[0].message.content;

    // Generate audio response
    let audioBase64 = null;
    try {
      const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: responseText.substring(0, 500), // Limit length for performance
          voice: "alloy",
          response_format: "mp3",
        }),
      });

      if (ttsResponse.ok) {
        const audioBuffer = await ttsResponse.arrayBuffer();
        const uint8Array = new Uint8Array(audioBuffer);
        audioBase64 = btoa(String.fromCharCode(...uint8Array));
      }
    } catch (error) {
      console.error("TTS error:", error);
      // Continue without audio if TTS fails
    }

    return new Response(
      JSON.stringify({
        response: responseText,
        audio: audioBase64,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

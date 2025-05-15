import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CalWebhookPayload {
  triggerEvent: string;
  payload: {
    startTime: string;
    endTime: string;
    title: string;
    description?: string;
    attendees: Array<{
      email: string;
      name: string;
    }>;
    organizer: {
      email: string;
      name: string;
    };
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json() as CalWebhookPayload;

    // Verificar se é um evento de agendamento confirmado
    if (payload.triggerEvent !== "BOOKING_CREATED") {
      return new Response(
        JSON.stringify({ message: "Evento ignorado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calcular duração em horas
    const startTime = new Date(payload.payload.startTime);
    const endTime = new Date(payload.payload.endTime);
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    // Gerar URL de pagamento
    const paymentUrl = new URL("/payment", req.url);
    paymentUrl.searchParams.set("recipient", "Mandrill Filmes");
    paymentUrl.searchParams.set("amount", "945,00");
    paymentUrl.searchParams.set("service", payload.payload.title);
    paymentUrl.searchParams.set("location", "São Paulo, SP");
    paymentUrl.searchParams.set("startDate", startTime.toLocaleString("pt-BR"));
    paymentUrl.searchParams.set("duration", duration.toString());

    return new Response(
      JSON.stringify({ 
        redirectUrl: paymentUrl.toString(),
        message: "Redirecionando para pagamento" 
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
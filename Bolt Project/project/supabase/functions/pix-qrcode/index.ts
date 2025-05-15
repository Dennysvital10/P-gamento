import { createClient } from "npm:@supabase/supabase-js@2.39.0";
import QRCode from "npm:qrcode@1.5.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface PixRequest {
  valor: number;
  chavePix: string;
  descricao: string;
  identificador: string;
  nomeBeneficiario: string;
  cidadeBeneficiario: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { valor, chavePix, descricao, identificador, nomeBeneficiario, cidadeBeneficiario } = await req.json() as PixRequest;

    // Validate required fields
    if (!valor || !chavePix || !nomeBeneficiario) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format amount to always have 2 decimal places
    const formattedAmount = valor.toFixed(2);

    // Generate PIX EMV code following BR Code specifications
    const pixData = [
      "00020126", // PIX GUI header
      `0014BR.GOV.BCB.PIX`, // PIX GUI
      `01${chavePix.length.toString().padStart(2, '0')}${chavePix}`, // PIX key
      `0211${identificador}`, // Transaction ID
      `5204000053039865802BR5913${nomeBeneficiario}6009${cidadeBeneficiario}`, // Merchant info
      `54${formattedAmount.length.toString().padStart(2, '0')}${formattedAmount}`, // Transaction amount
      `5802BR`, // Country code
      `62${descricao.length.toString().padStart(2, '0')}${descricao}`, // Description
      "6304", // CRC16 (placeholder)
    ].join('');

    // Generate QR code
    const qrCodeImage = await QRCode.toDataURL(pixData, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 300,
    });

    // Generate unique transaction ID
    const txId = crypto.randomUUID();

    const response = {
      qrCodeImage,
      qrCodeText: pixData,
      txId,
      location: `pix/${txId}`,
    };

    return new Response(
      JSON.stringify(response),
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
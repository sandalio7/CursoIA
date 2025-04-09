// Guardar en /netlify/functions/register-interest.js
const { createClient } = require('@supabase/supabase-js');

// Inicializar cliente de Supabase (necesitarás configurar estas variables de entorno en Netlify)
// Si prefieres usar otro servicio como Airtable, Firebase, etc. puedes modificar este código
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración para envío de emails (usando Mailgun como ejemplo)
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// Función principal que maneja solicitudes
exports.handler = async (event, context) => {
  // Asegurar que el método es POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  try {
    // Parsear el cuerpo de la solicitud
    const data = JSON.parse(event.body);
    
    // Validar datos
    if (data.type === 'early-access' && (!data.name || !data.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Nombre y email son requeridos para acceso anticipado' })
      };
    } else if (data.type === 'interest' && !data.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email es requerido para registrar interés' })
      };
    }

    // Almacenar en Supabase según el tipo de solicitud
    let result;
    if (data.type === 'early-access') {
      result = await supabase
        .from('early_access')
        .insert([
          {
            name: data.name,
            email: data.email,
            interest: data.interest || '',
            created_at: new Date().toISOString()
          }
        ]);
    } else if (data.type === 'interest') {
      result = await supabase
        .from('interest_list')
        .insert([
          {
            email: data.email,
            created_at: new Date().toISOString()
          }
        ]);
    }

    // Verificar si hubo error en Supabase
    if (result.error) {
      console.error('Error de Supabase:', result.error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al guardar los datos' })
      };
    }

    // Enviar email de confirmación
    let messageData;
    if (data.type === 'early-access') {
      messageData = {
        from: 'CursoIA <info@tudominio.com>',
        to: data.email,
        subject: '¡Gracias por solicitar acceso anticipado a CursoIA!',
        text: `Hola ${data.name},\n\nGracias por solicitar acceso anticipado a CursoIA. Te notificaremos tan pronto como esté disponible.\n\nSaludos,\nEl equipo de CursoIA`
      };
    } else {
      messageData = {
        from: 'CursoIA <info@tudominio.com>',
        to: data.email,
        subject: '¡Gracias por tu interés en CursoIA!',
        text: 'Gracias por mostrar interés en CursoIA. Te mantendremos informado sobre nuestro lanzamiento.\n\nSaludos,\nEl equipo de CursoIA'
      };
    }

    // Enviar email a administrador para seguimiento
    const adminData = {
      from: 'Notificación CursoIA <info@tudominio.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `Nuevo registro en CursoIA: ${data.type}`,
      text: `Se ha registrado un nuevo interesado:\n\nTipo: ${data.type}\nEmail: ${data.email}${data.name ? `\nNombre: ${data.name}` : ''}${data.interest ? `\nInterés: ${data.interest}` : ''}`
    };

    // Enviar emails
    try {
      await mailgun.messages().send(messageData);
      await mailgun.messages().send(adminData);
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      // Continuamos aunque falle el envío de email
    }

    // Retornar éxito
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

// Inicializar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Inicializar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  // Solo acepta POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  try {
    // Parsear datos
    const data = JSON.parse(event.body);
    
    // Validar datos mínimos
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

    // Guardar en Supabase
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

    // Verificar errores de Supabase
    if (result.error) {
      console.error('Error de Supabase:', result.error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al guardar los datos' })
      };
    }

    // Preparar emails
    let userMessage;
    if (data.type === 'early-access') {
      userMessage = {
        to: data.email,
        from: process.env.SENDER_EMAIL,
        subject: '¡Gracias por solicitar acceso anticipado a CursoIA!',
        text: `Hola ${data.name},\n\nGracias por solicitar acceso anticipado a CursoIA. Te notificaremos tan pronto como esté disponible.\n\nSaludos,\nEl equipo de CursoIA`
      };
    } else {
      userMessage = {
        to: data.email,
        from: process.env.SENDER_EMAIL,
        subject: '¡Gracias por tu interés en CursoIA!',
        text: 'Gracias por mostrar interés en CursoIA. Te mantendremos informado sobre nuestro lanzamiento.\n\nSaludos,\nEl equipo de CursoIA'
      };
    }

    const adminMessage = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.SENDER_EMAIL,
      subject: `Nuevo registro en CursoIA: ${data.type}`,
      text: `Se ha registrado un nuevo interesado:\n\nTipo: ${data.type}\nEmail: ${data.email}${data.name ? `\nNombre: ${data.name}` : ''}${data.interest ? `\nInterés: ${data.interest}` : ''}`
    };

    // Enviar emails
    try {
      await sgMail.send(userMessage);
      await sgMail.send(adminMessage);
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
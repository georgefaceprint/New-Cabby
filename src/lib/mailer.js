import { Resend } from "@resend/node";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Simple wrapper to send a transactional email.
 * @param {{to:string, subject:string, html:string}} param0
 */
export async function sendMail({ to, subject, html }) {
    const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html,
    });

    if (error) {
        console.error("✉️  Resend error:", error);
        throw new Error(error.message);
    }
    console.log("✉️  Email sent – ID:", data.id);
    return data;
}

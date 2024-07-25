import { render } from "@react-email/components";
import { API_URL, CSRF_TOKEN } from "../config";

export async function sendEmail(token, to, subject, template) {
    try {
        const emailHTML = render(template);
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRF_TOKEN,
        };

        if (token?.access) {
            headers["Authorization"] = `Bearer ${token.access}`;
        }

        const response = await fetch(`${API_URL}api/stuff/email/send_email/`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                html_message: emailHTML,
                to: to,
                subject: subject,
            }),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to send email email.");
        }

        return true;
    } catch (error) {
        return error;
    }
}

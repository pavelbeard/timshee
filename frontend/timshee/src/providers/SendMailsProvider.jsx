import {useMutation} from "react-query";
import {createContext} from "react";
import {privateApi} from "../lib/api";
import {render} from "@react-email/components";

export const SendMailsContext = createContext(null);

export default function SendMailsProvider({ children }) {
    const sendEmail = useMutation({
        mutationKey: ['sender'],
        mutationFn: async ({ recipient, subject, template }) => {
            const emailHTML = render(template);
            await privateApi.post('/api/stuff/profile/send_email/',
                JSON.stringify({
                    html_message: emailHTML,
                    to: recipient,
                    subject: subject,
                }),
            );
        }
    });


    return(
        <SendMailsContext.Provider value={{ sendEmail }} >
            {children}
        </SendMailsContext.Provider>
    )
}
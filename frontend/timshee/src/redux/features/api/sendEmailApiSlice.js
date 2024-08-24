import {apiSlice} from "../../services/app/api/apiSlice";

export const sendEmailApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        sendEmail: builder.mutation({
            query: (data) => ({
                url: '/stuff/email/send_email/',
                method: 'POST',
                body: {...data}
            })
        })
    })
});

export const {
    useSendEmailMutation
} = sendEmailApiSlice;
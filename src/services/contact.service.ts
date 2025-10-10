import axios from "axios";
import { CONTACT_ROUTES, HEADERS } from "@/constant";

type ContactFormData = {
    fullname: string;
    email: string;
    reason: string;
    message: string;
};

export const submitContactForm = async (formData: ContactFormData) => {

    const response = await axios.post(
		CONTACT_ROUTES.SUBMIT_CONTACT_FORM, 
		formData,
		{ headers: HEADERS }
	);
    return response.data;
};
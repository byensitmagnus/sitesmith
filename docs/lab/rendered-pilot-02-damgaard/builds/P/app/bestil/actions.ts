"use server";

import { redirect } from "next/navigation";
import { validate } from "@/lib/validation.js";
import { FORM_FIELD_ORDER } from "@/lib/content.js";
import { logSubmission } from "@/lib/log";

export type BookingState = {
  values: Record<string, string>;
  errors: Record<string, string>;
  errorFocusField?: string;
  submitted: boolean;
  attempt: number;
};

export async function bookAction(
  prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const values: Record<string, string> = {};
  for (const field of FORM_FIELD_ORDER as string[]) {
    values[field] = String(formData.get(field) ?? "").trim();
  }

  const { errors, errorFocusField, isValid } = validate(values);

  if (!isValid) {
    return {
      values,
      errors,
      errorFocusField,
      submitted: true,
      attempt: prevState.attempt + 1,
    };
  }

  await logSubmission(values);

  redirect("/kvittering");
}

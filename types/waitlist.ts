export type WaitlistField = "email" | "phone" | "location";

export interface WaitlistFieldCopy {
  label: string;
  placeholder: string;
}

export interface WaitlistLocationOption {
  value: string;
  label: string;
}

export type WaitlistFormErrorField = WaitlistField | "optIn";

export interface WaitlistPageContent {
  title: string;
  introduction: string;
  fields: Record<WaitlistField, WaitlistFieldCopy>;
  consentLabel: string;
  submitLabel: string;
  pendingLabel: string;
  success: {
    title: string;
    message: string;
  };
}

export type WaitlistFormValues = Record<WaitlistField, string>;

export type WaitlistFormState =
  | { status: "idle" }
  | {
      status: "error";
      errors: Partial<Record<WaitlistFormErrorField, string>>;
      message?: string;
      values: WaitlistFormValues;
    }
  | { status: "success" };

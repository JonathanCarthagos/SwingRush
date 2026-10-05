"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import { joinWaitlist } from "@/app/(site)/waitlist/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  WaitlistField,
  WaitlistFormState,
  WaitlistLocationOption,
  WaitlistPageContent,
} from "@/types/waitlist";

// Type and spacing ramp from the mobile frame (402px) to the desktop frame (1680px) across the tablet range.
const FIELD_GAP =
  "gap-[1.1rem] min-[768px]:gap-[clamp(1.1rem,calc(3.008vw-0.34375rem),2.0625rem)] min-[1280px]:gap-[2.0625rem]";
const FIELD_BOX =
  "flex h-[3.2rem] w-full items-center bg-white text-black min-[768px]:h-[clamp(3.2rem,calc(8.75vw-1rem),6rem)] min-[1280px]:h-24";
const FIELD_INSET =
  "px-[0.733rem] min-[768px]:px-[clamp(0.733rem,calc(2.006vw-0.23rem),1.375rem)] min-[1280px]:px-[1.375rem]";
const FIELD_TEXT =
  "font-display text-[2.5rem] leading-[1.05] min-[768px]:text-[clamp(2.5rem,calc(6.836vw-0.78rem),4.6875rem)] min-[1280px]:text-[4.6875rem]";
// Errors carry a red bar inside the white field; keyboard focus gets a white ring outside it.
const FIELD_STATES =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-white aria-invalid:shadow-[inset_0_-0.375rem_0_#f92524]";
const CONTROL =
  "min-w-0 rounded-none border-0 py-0 caret-[#f92524] outline-none selection:bg-[#f92524] selection:text-white placeholder:text-black placeholder:uppercase placeholder:opacity-100";
// Keeps browser autofill from repainting the white field blue or yellow.
const AUTOFILL =
  "autofill:shadow-[inset_0_0_0_100rem_#fff] autofill:[-webkit-text-fill-color:#000]";
const ERROR_TEXT =
  "mt-2 font-body text-[0.9375rem] leading-[1.3] tracking-body text-brand min-[768px]:text-[clamp(0.9375rem,calc(0.9766vw+0.46875rem),1.25rem)] min-[1280px]:mt-3 min-[1280px]:text-xl";
const CHEVRON =
  "pointer-events-none h-[1rem] w-[1.333rem] shrink-0 min-[768px]:h-[clamp(1rem,calc(2.734vw-0.3125rem),1.875rem)] min-[768px]:w-[clamp(1.333rem,calc(3.646vw-0.417rem),2.5rem)] min-[1280px]:h-[1.875rem] min-[1280px]:w-10";

const FIELD_ORDER = ["email", "phone", "location"] as const satisfies readonly WaitlistField[];

const initialState: WaitlistFormState = { status: "idle" };

export interface WaitlistFormProps {
  content: WaitlistPageContent;
  locations: readonly WaitlistLocationOption[];
}

export function WaitlistForm({ content, locations }: WaitlistFormProps) {
  const [state, formAction, isPending] = useActionState(
    joinWaitlist,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : undefined;
  const [location, setLocation] = useState(values?.location ?? "");
  const selectedLocation = locations.find((option) => option.value === location);

  useEffect(() => {
    if (state.status === "success") {
      successHeadingRef.current?.focus();
      return;
    }
    if (state.status === "error") {
      const firstInvalid = FIELD_ORDER.find((field) => state.errors[field]);
      const target = firstInvalid
        ? formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        : state.errors.optIn
          ? formRef.current?.querySelector<HTMLElement>('[name="optIn"]')
          : null;
      target?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        aria-live="polite"
        // Holds the form's height so the footer doesn't jump when the confirmation replaces it.
        className="mt-[4.375rem] min-h-[15.357rem] max-w-[48.086rem] min-[768px]:mt-[clamp(3.875rem,calc(5.125rem-1.5625vw),4.375rem)] min-[768px]:min-h-[clamp(15.357rem,calc(37.56vw-2.67rem),27.375rem)] min-[1280px]:mt-[3.875rem] min-[1280px]:min-h-[27.375rem]"
      >
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-display text-[2.5rem] uppercase leading-[0.9] text-white outline-none [text-wrap:balance] min-[768px]:text-[clamp(2.5rem,calc(6.836vw-0.78rem),4.6875rem)] min-[1280px]:text-[4.6875rem]"
        >
          {content.success.title}
        </h2>
        <p className="mt-[0.9375rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white min-[768px]:mt-[clamp(0.9375rem,calc(1.758vw+0.09375rem),1.5rem)] min-[768px]:text-[clamp(1.0625rem,calc(2.539vw-0.15625rem),1.875rem)] min-[1280px]:mt-6 min-[1280px]:text-[1.875rem]">
          {content.success.message}
        </p>
      </div>
    );
  }

  const describedBy = (field: WaitlistField) =>
    errors[field] ? `waitlist-${field}-error` : undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      // With JS, submit inside a transition so React skips its post-action reset and the
      // visitor keeps what they typed; without JS the native action above still posts.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      noValidate
      className="relative mt-[4.375rem] flex w-full max-w-[48.086rem] flex-col items-start min-[768px]:mt-[clamp(3.875rem,calc(5.125rem-1.5625vw),4.375rem)] min-[1280px]:mt-[3.875rem]"
    >
      <div className={cn("flex w-full flex-col", FIELD_GAP)}>
        <Field
          field="email"
          label={content.fields.email.label}
          error={errors.email}
        >
          <input
            id="waitlist-email"
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            // A blank native placeholder drives :placeholder-shown; the visual one carries the drawn asterisk.
            placeholder=" "
            defaultValue={values?.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={cn("peer", FIELD_BOX, FIELD_INSET, FIELD_TEXT, FIELD_STATES, CONTROL, AUTOFILL)}
          />
          <RequiredPlaceholder
            text={content.fields.email.placeholder}
            className="peer-placeholder-shown:flex"
          />
        </Field>

        <Field
          field="phone"
          label={content.fields.phone.label}
          error={errors.phone}
        >
          <input
            id="waitlist-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder=" "
            defaultValue={values?.phone}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("phone")}
            className={cn("peer", FIELD_BOX, FIELD_INSET, FIELD_TEXT, FIELD_STATES, CONTROL, AUTOFILL)}
          />
          <RequiredPlaceholder
            text={content.fields.phone.placeholder}
            className="peer-placeholder-shown:flex"
          />
        </Field>

        <Field
          field="location"
          label={content.fields.location.label}
          error={errors.location}
        >
          {/* The visible field is drawn here; the native select sits on top at 16px so its
              popup and the iOS picker stay legible instead of inheriting the display size. */}
          <div
            aria-hidden="true"
            className={cn(
              FIELD_BOX,
              FIELD_INSET,
              FIELD_TEXT,
              "pr-[2.8rem] min-[768px]:pr-[clamp(2.8rem,calc(7.656vw-0.875rem),5.25rem)] min-[1280px]:pr-[5.25rem]",
              "group-has-[select:focus-visible]:outline-2 group-has-[select:focus-visible]:outline-solid group-has-[select:focus-visible]:outline-offset-4 group-has-[select:focus-visible]:outline-white",
              errors.location && "shadow-[inset_0_-0.375rem_0_#f92524]",
            )}
          >
            {selectedLocation ? (
              <span className="truncate uppercase [@media(scripting:none)]:invisible">
                {selectedLocation.label}
              </span>
            ) : (
              <RequiredPlaceholder
                text={content.fields.location.placeholder}
                className="flex [@media(scripting:none)]:invisible"
              />
            )}
            <svg
              viewBox="0 0 40 30"
              className={cn(
                CHEVRON,
                "absolute top-1/2 right-[0.733rem] -translate-y-1/2 text-black min-[768px]:right-[clamp(0.733rem,calc(2.006vw-0.23rem),1.375rem)] min-[1280px]:right-[1.375rem]",
              )}
            >
              <polygon points="0,0 11,0 20,17 29,0 40,0 25.5,30 14.5,30" fill="currentColor" />
            </svg>
          </div>
          <select
            id="waitlist-location"
            name="location"
            required
            defaultValue={values?.location ?? ""}
            onChange={(event) => setLocation(event.target.value)}
            aria-invalid={errors.location ? true : undefined}
            aria-describedby={describedBy("location")}
            className={cn(
              FIELD_INSET,
              // Without JS the drawn label can't follow the choice, so the native text shows instead.
              "absolute inset-0 size-full cursor-pointer appearance-none rounded-none border-0 bg-transparent py-0 font-body text-base text-black uppercase opacity-0 outline-none [@media(scripting:none)]:opacity-100",
            )}
          >
            <option value="" disabled>
              {content.fields.location.placeholder}
            </option>
            {locations.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div aria-hidden="true" className="sr-only">
        <label>
          Company
          <input
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      <div className="mt-[1.432rem] flex w-full flex-col min-[768px]:mt-[clamp(1.432rem,calc(5.29vw-1.1075rem),3.125rem)] min-[1280px]:mt-[3.125rem]">
        <label className="flex items-start gap-3 font-body text-[0.9375rem] leading-[1.3] tracking-body text-white min-[768px]:text-[clamp(0.9375rem,calc(0.9766vw+0.46875rem),1.25rem)] min-[1280px]:text-xl">
          <input
            id="waitlist-opt-in"
            name="optIn"
            type="checkbox"
            required
            aria-invalid={errors.optIn ? true : undefined}
            aria-describedby={errors.optIn ? "waitlist-opt-in-error" : undefined}
            className="mt-[0.2em] size-4 shrink-0 accent-brand outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-white"
          />
          <span>{content.consentLabel}</span>
        </label>
        {errors.optIn ? (
          <p id="waitlist-opt-in-error" role="alert" className={ERROR_TEXT}>
            {errors.optIn}
          </p>
        ) : null}
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className={ERROR_TEXT}>
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="outline-white"
        disabled={isPending}
        aria-busy={isPending || undefined}
        className="mt-[1.432rem] h-[2.125rem] px-4 py-0 text-[0.875rem] transition-colors duration-150 hover:bg-white hover:text-black min-[768px]:px-[clamp(1rem,calc(1.09375vw+0.475rem),1.35rem)] min-[768px]:text-[clamp(0.875rem,calc(1.171875vw+0.3125rem),1.25rem)] min-[1280px]:px-[1.35rem] min-[1280px]:text-xl"
      >
        {isPending ? content.pendingLabel : content.submitLabel}
      </Button>
    </form>
  );
}

interface FieldProps {
  field: WaitlistField;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ field, label, error, children }: FieldProps) {
  return (
    <div className="flex w-full flex-col">
      <label htmlFor={`waitlist-${field}`} className="sr-only">
        {label}
      </label>
      <div className="group relative w-full">{children}</div>
      {error ? (
        <p id={`waitlist-${field}-error`} role="alert" className={ERROR_TEXT}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

// The display face ships without an asterisk glyph, so the required mark is drawn to match its weight and slant.
function RequiredPlaceholder({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 left-0 hidden items-center whitespace-nowrap uppercase text-black",
        FIELD_INSET,
        FIELD_TEXT,
        className,
      )}
    >
      {text}
      <svg
        viewBox="0 0 20 20"
        className="ml-[0.05em] size-[0.4em] shrink-0 -translate-y-[0.32em] -skew-x-12"
      >
        {[0, 60, 120].map((angle) => (
          <rect
            key={angle}
            x="7.4"
            y="0"
            width="5.2"
            height="20"
            transform={`rotate(${angle} 10 10)`}
            fill="currentColor"
          />
        ))}
      </svg>
    </span>
  );
}

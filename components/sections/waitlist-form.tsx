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
import { validateWaitlistFields } from "@/lib/waitlist-fields";
import { cn } from "@/lib/utils";
import type {
  WaitlistField,
  WaitlistFormErrorField,
  WaitlistFormState,
  WaitlistLocationOption,
  WaitlistPageContent,
} from "@/types/waitlist";

// Type and spacing ramp from the mobile frame (402px) to the desktop frame (1680px) across the tablet range.
// Owners Black Italic hangs about 0.35em below the baseline, outside the em box. The line box has to
// contain that ink, and the field has to be taller than the line or the input clips it.
const FIELD_GAP =
  "gap-[1.1rem] min-[768px]:gap-[clamp(1.1rem,calc(3.008vw-0.34375rem),2.0625rem)] min-[1280px]:gap-[2.0625rem]";
const FIELD_BOX =
  "flex h-[5rem] w-full items-center overflow-visible bg-white text-black min-[768px]:h-[clamp(5rem,calc(12.5vw-1rem),9rem)] min-[1280px]:h-[9rem]";
// City pages draw shorter fields (51px to 96px). The line box overflows them, so both inputs use the drawn text.
const FIELD_BOX_COMPACT =
  "flex h-[3.1956rem] w-full items-center overflow-visible bg-white text-black min-[768px]:h-[clamp(3.1956rem,calc(8.752vw-1.005rem),5.9963rem)] min-[1280px]:h-[5.9963rem]";
const FIELD_INSET =
  "pr-[0.733rem] pl-[calc(0.733rem+0.12em)] min-[768px]:pr-[clamp(0.733rem,calc(2.006vw-0.23rem),1.375rem)] min-[768px]:pl-[calc(clamp(0.733rem,calc(2.006vw-0.23rem),1.375rem)+0.12em)] min-[1280px]:pr-[1.375rem] min-[1280px]:pl-[calc(1.375rem+0.12em)]";
// Mobile uses the body face so a full email fits in the field. Tablet and desktop keep Owners Black Italic.
// The global .font-display rule is italic at every width, so the display face is only applied from 768px.
// The display size caps below the old 4.6875rem so a long email stays inside the field.
const FIELD_TEXT =
  "font-body text-[1.0625rem] font-normal not-italic leading-[1.3] tracking-body min-[768px]:font-display min-[768px]:text-[clamp(2.5rem,calc(6.836vw-0.78rem),3.25rem)] min-[768px]:font-extrabold min-[768px]:italic min-[768px]:leading-[1.85] min-[768px]:tracking-normal min-[1280px]:text-[3.25rem]";
// Errors carry a red bar inside the white field; keyboard focus gets a white ring outside it.
const FIELD_STATES =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-white aria-invalid:shadow-[inset_0_-0.375rem_0_#f92524]";
const CONTROL =
  "min-w-0 rounded-none border-0 py-0 caret-[#f92524] outline-none selection:bg-[#f92524] selection:text-white placeholder:text-black placeholder:uppercase placeholder:opacity-100";
// Keeps browser autofill from repainting the white field blue or yellow.
const AUTOFILL =
  "autofill:shadow-[inset_0_0_0_100rem_#fff] autofill:[-webkit-text-fill-color:#000]";
// Mirrored fields keep the input transparent from 768px so the span is the only painted value.
// Below that, the input itself is the visible body text and can scroll when the value is long.
const MIRROR_INPUT =
  "peer h-full w-full overflow-x-auto bg-transparent text-black [-webkit-text-fill-color:#000] autofill:shadow-[inset_0_0_0_100rem_#fff] autofill:[-webkit-text-fill-color:#000] min-[768px]:absolute min-[768px]:inset-0 min-[768px]:text-transparent min-[768px]:[-webkit-text-fill-color:transparent] min-[768px]:autofill:[-webkit-text-fill-color:transparent]";
const MIRROR_TEXT =
  "pointer-events-none hidden h-full w-full items-center overflow-visible min-[768px]:flex [@media(scripting:none)]:invisible";
const AUTOFILL_ANIMATION = "waitlist-autofill-watch";
const ERROR_TEXT =
  "mt-2 font-body text-[0.9375rem] leading-[1.3] tracking-body text-brand min-[768px]:text-[clamp(0.9375rem,calc(0.9766vw+0.46875rem),1.25rem)] min-[1280px]:mt-3 min-[1280px]:text-xl";
const CHEVRON =
  "pointer-events-none h-[1rem] w-[1.333rem] shrink-0 min-[768px]:h-[clamp(1rem,calc(2.734vw-0.3125rem),1.875rem)] min-[768px]:w-[clamp(1.333rem,calc(3.646vw-0.417rem),2.5rem)] min-[1280px]:h-[1.875rem] min-[1280px]:w-10";

const FIELD_ORDER = ["email", "phone", "location"] as const satisfies readonly WaitlistField[];

// National US format: 801-209-5792. A leading 1 from autofill is the country code, not part of the number.
function formatUsPhone(raw: string, previous = "") {
  let digits = raw.replace(/\D/g, "");
  const previousDigits = previous.replace(/\D/g, "");
  if (
    previous &&
    digits === previousDigits &&
    raw.length < previous.length &&
    digits.length > 0
  ) {
    digits = digits.slice(0, -1);
  }
  if (digits.startsWith("1") && digits.length > 10) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return area;
  if (digits.length <= 6) return `${area}-${prefix}`;
  return `${area}-${prefix}-${line}`;
}

function formatPhoneInput(input: HTMLInputElement) {
  const previous = input.dataset.formatted ?? "";
  const formatted = formatUsPhone(input.value, previous);
  input.dataset.formatted = formatted;
  if (input.value === formatted) return;

  const caretDigits = input.value
    .slice(0, input.selectionStart ?? input.value.length)
    .replace(/\D/g, "").length;
  input.value = formatted;
  if (document.activeElement !== input) return;

  let seen = 0;
  let caret = formatted.length;
  if (caretDigits === 0) {
    caret = 0;
  } else {
    for (let index = 0; index < formatted.length; index += 1) {
      if (/\d/.test(formatted[index] ?? "")) seen += 1;
      if (seen >= caretDigits) {
        caret = index + 1;
        break;
      }
    }
  }
  input.setSelectionRange(caret, caret);
}

const initialState: WaitlistFormState = { status: "idle" };

function focusWaitlistError(
  form: HTMLFormElement,
  fieldErrors: Partial<Record<WaitlistFormErrorField, string>>,
) {
  const firstInvalid = FIELD_ORDER.find((field) => fieldErrors[field]);
  const target = firstInvalid
    ? form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
    : fieldErrors.optIn
      ? form.querySelector<HTMLElement>('[name="optIn"]')
      : null;
  target?.focus();
}

export interface WaitlistFormProps {
  content: WaitlistPageContent;
  locations: readonly WaitlistLocationOption[];
  /** Id of the heading that names this form. */
  headingId: string;
  /** Locks the signup to one city: the location picker is replaced by a hidden field and the fields get the compact city-page size. */
  fixedLocation?: { slug: string; sourcePath: string };
  className?: string;
}

export function WaitlistForm({
  content,
  locations,
  headingId,
  fixedLocation,
  className,
}: WaitlistFormProps) {
  const [state, formAction, isPending] = useActionState(
    joinWaitlist,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [clientErrors, setClientErrors] = useState<
    Partial<Record<WaitlistFormErrorField, string>>
  >({});
  const errors =
    Object.keys(clientErrors).length > 0
      ? clientErrors
      : state.status === "error"
        ? state.errors
        : {};
  const values = state.status === "error" ? state.values : undefined;
  const [location, setLocation] = useState(values?.location ?? "");
  const [email, setEmail] = useState(values?.email ?? "");
  const [phone, setPhone] = useState(
    values?.phone ? formatUsPhone(values.phone) : "",
  );
  const selectedLocation = locations.find((option) => option.value === location);
  const compact = Boolean(fixedLocation);
  const fieldBox = compact ? FIELD_BOX_COMPACT : FIELD_BOX;
  // A fixed city can only fail validation if it was unpublished mid-visit; surface that as a form message.
  const formMessage =
    Object.keys(clientErrors).length > 0
      ? undefined
      : state.status === "error"
        ? (state.message ?? (compact ? errors.location : undefined))
        : undefined;

  const syncMirroredField = (input: HTMLInputElement) => {
    if (input.name === "phone") {
      formatPhoneInput(input);
      setPhone(input.value);
      return;
    }
    if (input.name === "email") setEmail(input.value);
  };

  const onAutofill = (event: React.AnimationEvent<HTMLInputElement>) => {
    if (event.animationName !== "waitlist-autofill") return;
    syncMirroredField(event.currentTarget);
  };

  useEffect(() => {
    const phoneInput = phoneRef.current;
    if (phoneInput && phoneInput.dataset.formatted === undefined) {
      phoneInput.dataset.formatted = phoneInput.value;
    }
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const applyAutofill = () => {
      const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
      const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]');
      if (emailInput?.value) setEmail(emailInput.value);
      if (phoneInput?.value) {
        formatPhoneInput(phoneInput);
        setPhone(phoneInput.value);
      }
    };

    applyAutofill();
    const retry = window.setTimeout(applyAutofill, 300);
    return () => window.clearTimeout(retry);
  }, []);

  useEffect(() => {
    if (state.status === "success" || state.status === "duplicate") {
      successHeadingRef.current?.focus();
      return;
    }
    if (state.status === "error" && formRef.current) {
      focusWaitlistError(formRef.current, state.errors);
    }
  }, [state]);

  if (state.status === "success" || state.status === "duplicate") {
    return (
      <div
        aria-live="polite"
        // Holds the form's height so the footer doesn't jump when the confirmation replaces it.
        className={cn(
          "max-w-[48.086rem]",
          compact
            ? "min-h-[13rem] min-[1280px]:min-h-[19rem]"
            : "mt-[4.375rem] min-h-[15.357rem] min-[768px]:mt-[clamp(3.875rem,calc(5.125rem-1.5625vw),4.375rem)] min-[768px]:min-h-[clamp(15.357rem,calc(37.56vw-2.67rem),27.375rem)] min-[1280px]:mt-[3.875rem] min-[1280px]:min-h-[27.375rem]",
          className,
        )}
      >
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-display text-[2.5rem] uppercase leading-[0.9] text-white outline-none [text-wrap:balance] min-[768px]:text-[clamp(2.5rem,calc(6.836vw-0.78rem),4.6875rem)] min-[1280px]:text-[4.6875rem]"
        >
          {state.status === "duplicate"
            ? `You’re already on the list for ${state.city}`
            : content.success.title}
        </h2>
        {state.status === "success" ? (
          <p className="mt-[0.9375rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white min-[768px]:mt-[clamp(0.9375rem,calc(1.758vw+0.09375rem),1.5rem)] min-[768px]:text-[clamp(1.0625rem,calc(2.539vw-0.15625rem),1.875rem)] min-[1280px]:mt-6 min-[1280px]:text-[1.875rem]">
            {content.success.message}
          </p>
        ) : null}
      </div>
    );
  }

  const describedBy = (field: WaitlistField) =>
    errors[field] ? `waitlist-${field}-error` : undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      aria-labelledby={headingId}
      // With JS, submit inside a transition so React skips its post-action reset and the
      // visitor keeps what they typed; without JS the native action above still posts.
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        // Chrome can fill a hidden field during autofill. Clear it so a real submit still requires consent.
        const honeypot = form.elements.namedItem("sr_hp");
        if (honeypot instanceof HTMLInputElement) honeypot.value = "";
        const formData = new FormData(form);
        const readField = (name: string) => {
          const value = formData.get(name);
          return typeof value === "string" ? value : "";
        };
        const nextErrors = validateWaitlistFields({
          email: readField("email"),
          phone: readField("phone"),
          location: readField("location"),
          optIn: formData.get("optIn") === "on",
        });
        if (Object.keys(nextErrors).length > 0) {
          setClientErrors(nextErrors);
          focusWaitlistError(form, nextErrors);
          return;
        }
        setClientErrors({});
        startTransition(() => formAction(formData));
      }}
      noValidate
      className={cn(
        "relative flex w-full max-w-[48.086rem] flex-col items-start",
        !compact &&
          "mt-[4.375rem] min-[768px]:mt-[clamp(3.875rem,calc(5.125rem-1.5625vw),4.375rem)] min-[1280px]:mt-[3.875rem]",
        className,
      )}
    >
      <style>
        {`@keyframes waitlist-autofill { from { opacity: 1; } to { opacity: 1; } }
          .waitlist-autofill-watch:-webkit-autofill { animation-name: waitlist-autofill; animation-duration: 1ms; }`}
      </style>
      {fixedLocation ? (
        <>
          <input type="hidden" name="location" value={fixedLocation.slug} />
          <input type="hidden" name="sourcePath" value={fixedLocation.sourcePath} />
        </>
      ) : null}

      <div className={cn("flex w-full flex-col", FIELD_GAP)}>
        <Field
          field="email"
          label={content.fields.email.label}
          error={errors.email}
        >
          {/* The native input clips italic descenders. The visible text is the span; the input stays on top for typing, caret, and autofill. */}
          <div className={cn(fieldBox, "relative")}>
            <span
              aria-hidden="true"
              className={cn(
                FIELD_INSET,
                FIELD_TEXT,
                MIRROR_TEXT,
                !email && "invisible",
              )}
            >
              {email}
            </span>
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
              onInput={(event) => syncMirroredField(event.currentTarget)}
              onChange={(event) => syncMirroredField(event.currentTarget)}
              onAnimationStart={onAutofill}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email")}
              className={cn(
                MIRROR_INPUT,
                AUTOFILL_ANIMATION,
                FIELD_INSET,
                FIELD_TEXT,
                FIELD_STATES,
                CONTROL,
                "[@media(scripting:none)]:static [@media(scripting:none)]:bg-white [@media(scripting:none)]:text-black [@media(scripting:none)]:[-webkit-text-fill-color:#000]",
              )}
            />
            <RequiredPlaceholder
              text={content.fields.email.placeholder}
              className="peer-placeholder-shown:flex"
            />
          </div>
        </Field>

        <Field
          field="phone"
          label={content.fields.phone.label}
          error={errors.phone}
        >
          {compact ? (
            <div className={cn(fieldBox, "relative")}>
              <span
                aria-hidden="true"
                className={cn(
                  FIELD_INSET,
                  FIELD_TEXT,
                  MIRROR_TEXT,
                  "min-[768px]:whitespace-nowrap",
                  !phone && "invisible",
                )}
              >
                {phone}
              </span>
              <input
                ref={phoneRef}
                id="waitlist-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                required
                placeholder=" "
                maxLength={17}
                defaultValue={values?.phone ? formatUsPhone(values.phone) : undefined}
                onInput={(event) => syncMirroredField(event.currentTarget)}
                onChange={(event) => syncMirroredField(event.currentTarget)}
                onAnimationStart={onAutofill}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={describedBy("phone")}
                className={cn(
                  MIRROR_INPUT,
                  AUTOFILL_ANIMATION,
                  FIELD_INSET,
                  FIELD_TEXT,
                  FIELD_STATES,
                  CONTROL,
                  "[@media(scripting:none)]:static [@media(scripting:none)]:bg-white [@media(scripting:none)]:text-black [@media(scripting:none)]:[-webkit-text-fill-color:#000]",
                )}
              />
              <RequiredPlaceholder
                text={content.fields.phone.placeholder}
                className="peer-placeholder-shown:flex"
              />
            </div>
          ) : (
            <>
              <input
                ref={phoneRef}
                id="waitlist-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                required
                placeholder=" "
                // Room for a pasted +1 before the mask keeps 10 national digits.
                maxLength={17}
                defaultValue={values?.phone ? formatUsPhone(values.phone) : undefined}
                onInput={(event) => syncMirroredField(event.currentTarget)}
                onChange={(event) => syncMirroredField(event.currentTarget)}
                onAnimationStart={onAutofill}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={describedBy("phone")}
                className={cn(
                  "peer",
                  AUTOFILL_ANIMATION,
                  FIELD_BOX,
                  FIELD_INSET,
                  FIELD_TEXT,
                  FIELD_STATES,
                  CONTROL,
                  AUTOFILL,
                )}
              />
              <RequiredPlaceholder
                text={content.fields.phone.placeholder}
                className="peer-placeholder-shown:flex"
              />
            </>
          )}
        </Field>

        {fixedLocation ? null : (
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
              <span className="overflow-visible whitespace-nowrap uppercase [@media(scripting:none)]:invisible">
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
        )}
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input
          name="sr_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
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

      {formMessage ? (
        <p role="alert" className={ERROR_TEXT}>
          {formMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="outline-white"
        disabled={isPending}
        aria-busy={isPending || undefined}
        className={cn(
          "mt-[1.432rem] h-[2.125rem] px-4 py-0 text-[0.875rem] transition-colors duration-150 hover:bg-white hover:text-black min-[768px]:px-[clamp(1rem,calc(1.09375vw+0.475rem),1.35rem)] min-[768px]:text-[clamp(0.875rem,calc(1.171875vw+0.3125rem),1.25rem)] min-[1280px]:px-[1.35rem] min-[1280px]:text-xl",
          compact &&
            "min-[768px]:mt-[clamp(1.432rem,calc(3.926vw-0.4525rem),2.6875rem)] min-[1280px]:mt-[2.6875rem]",
        )}
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

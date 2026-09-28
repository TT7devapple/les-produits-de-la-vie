"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { sendContactMessage, type ContactState } from "@/app/contact/actions";
import { store } from "@/data/store";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle" };

const labelClass = "mb-1.5 flex items-baseline justify-between text-ui font-bold tracking-[0.06em] uppercase";
const fieldClass = "w-full bg-label px-4 text-base text-print focus:outline-[2.5px] focus:outline-offset-2 focus:outline-ink focus:outline-solid";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = "values" in state ? state.values : undefined;

  if (state.status === "success") {
    return (
      <div role="status" className="label px-6 py-10 sm:px-10">
        <p className="display text-4xl">Merci, c&apos;est bien reçu.</p>
        <p className="mt-3 text-print-soft">Nous vous répondons dès que possible. À très vite en boutique !</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {/* Anti-spam : champ invisible pour les humains */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom" name="name" autoComplete="name" required error={errors.name} defaultValue={values?.name} />
        <Field label="E-mail" name="email" type="email" autoComplete="email" inputMode="email" required error={errors.email} defaultValue={values?.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Téléphone" name="phone" type="tel" autoComplete="tel" inputMode="tel" hint="facultatif" defaultValue={values?.phone} />
        <div>
          <label htmlFor="subject" className={labelClass}>
            Sujet
          </label>
          <select
            id="subject"
            name="subject"
            key={values?.subject ?? "defaut"}
            defaultValue={values?.subject || "Question sur un produit"}
            className={cn(
              fieldClass,
              "h-13 appearance-none border-2 border-ink bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22none%22%20stroke=%22%236e1a2f%22%20stroke-width=%222%22%3E%3Cpath%20d=%22m2%204%204%204%204-4%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat",
            )}
          >
            <option>Question sur un produit</option>
            <option>Disponibilité d&apos;un produit</option>
            <option>Horaires / accès</option>
            <option>Autre demande</option>
          </select>
        </div>
      </div>
      <Field label="Message" name="message" as="textarea" required error={errors.message} defaultValue={values?.message} />

      {state.status === "error" && !Object.keys(errors).length && (
        <p role="alert" className="border-2 border-ink p-4 font-bold">
          {state.message}
        </p>
      )}

      {state.status === "not-configured" && (
        <div role="status" className="label p-4 leading-relaxed">
          <p className="font-bold">Le formulaire en ligne n&apos;est pas encore activé.</p>
          <p className="mt-1 text-print-soft">
            En attendant, le plus simple est de passer en boutique
            {store.phone && (
              <>
                {" "}ou d&apos;appeler le{" "}
                <a href={store.phone.href} className="font-mono whitespace-nowrap text-print underline decoration-2 underline-offset-4">
                  {store.phone.display}
                </a>
              </>
            )}
            .
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-snug sm:max-w-xs">
          Vos informations servent uniquement à vous répondre.{" "}
          <a href="/confidentialite" className="underline decoration-2 underline-offset-4">
            En savoir plus
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex min-h-13 items-center justify-center gap-3 bg-ink px-7 font-bold tracking-[0.06em] text-kraft uppercase transition-colors hover:bg-ink-deep active:translate-y-px disabled:cursor-progress disabled:opacity-80"
        >
          {pending ? "Envoi…" : "Envoyer le message"}
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          )}
        </button>
      </div>

      {store.phone && (
        <p className="border-t-2 border-ink pt-5">
          Plus rapide :{" "}
          <a href={store.phone.href} className="font-mono font-medium underline decoration-2 underline-offset-4">
            {store.phone.display}
          </a>
        </p>
      )}
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  required?: boolean;
  hint?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  defaultValue?: string;
}

function Field({ label, name, type = "text", as = "input", required, hint, error, autoComplete, inputMode, defaultValue }: FieldProps) {
  const id = `champ-${name}`;
  const describedBy = error ? `${id}-erreur` : undefined;
  // Une erreur se marque par un filet épaissi et une mention, pas par une couleur étrangère à la palette.
  const classes = cn(fieldClass, error ? "border-[3.5px] border-ink" : "border-2 border-ink");
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        <span>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </span>
        {hint && <span className="font-mono text-xs font-normal tracking-normal normal-case">{hint}</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={6}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(classes, "min-h-40 resize-y py-3")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(classes, "h-13")}
        />
      )}
      {error && (
        <p id={`${id}-erreur`} className="mt-1.5">
          <strong>À corriger :</strong> {error}
        </p>
      )}
    </div>
  );
}

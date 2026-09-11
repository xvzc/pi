/**
 * Public event contract for the local ask-user-question extension.
 *
 * Payloads must be JSON-safe: primitives, arrays, plain objects. No
 * Set/Map/Date/class instances — payloads must survive JSON serialization
 * when listeners forward them across process or network boundaries.
 *
 * Naming: `pi-ask-user:<phase>`, lowercase, hyphen-separated.
 */

export const ASK_USER_PROMPT_EVENT = "pi-ask-user:prompt" as const;

export interface AskUserPromptEventPayload {
	questions: ReadonlyArray<AskUserPromptQuestion>;
}

/**
 * Emitted while the questionnaire is awaiting user input (TUI `ui.custom` and
 * RPC dialog walker). Cleared with `{ active: false }` in `finally` so listeners
 * can distinguish blocked-on-human from working.
 */
export const ASK_USER_BLOCKED_EVENT = "pi-ask-user:blocked" as const;

export interface AskUserBlockedEventPayload {
	/** True while input is awaited; false when the wait ends (answer, cancel, or error). */
	active: boolean;
}

export interface AskUserPromptQuestion {
	/** The full question text, exactly as the agent authored it. */
	question: string;
	/** The short chip/tag shown next to the question. */
	header: string;
	/** True iff the user may pick multiple options. Normalized from optional. */
	multiSelect: boolean;
	options: ReadonlyArray<AskUserPromptOption>;
}

export interface AskUserPromptOption {
	label: string;
	description: string;
	/** True iff the option carries rich preview content (content not shipped). */
	hasPreview: boolean;
}
